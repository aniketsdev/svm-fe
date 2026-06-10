import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { formatValue, personLabel } from '../api/crm';
import { useLeadDetail } from '../hooks/useLeadDetail';
import { CrmGuard } from '../components/CrmGuard';
import { StageBadge } from '../components/StageBadge';
import { LeadNotesPanel } from '../components/LeadNotesPanel';
import { LeadRemindersPanel } from '../components/LeadRemindersPanel';

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value && value !== '' ? value : '—'}</dd>
    </div>
  );
}

/** Dedicated lead detail page (Roles & Permissions pattern). */
export function CrmLeadDetailPage() {
  const { leadUuid = '' } = useParams<{ leadUuid: string }>();
  const [params] = useSearchParams();
  const backTo = `/crm${params.toString() ? `?${params.toString()}` : ''}`;
  const { lead, isLoading, isError } = useLeadDetail(leadUuid);

  return (
    <CrmGuard>
      <div className="w-full px-4 py-5">
        <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to leads
        </Link>

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
          </div>
        ) : isError || !lead ? (
          <div className="py-16 text-center">
            <h1 className="text-xl font-semibold text-foreground">Lead not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">It may have been removed.</p>
          </div>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{lead.contact_name}</h1>
              <span className="text-muted-foreground">·</span>
              <span className="text-lg text-foreground">{lead.clinic_name}</span>
              <StageBadge stage={lead.stage} />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <section className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-1">
                <h2 className="text-sm font-semibold text-foreground">Details</h2>
                <dl className="mt-3 grid grid-cols-2 gap-4">
                  <Field label="Phone" value={lead.phone} />
                  <Field label="WhatsApp" value={lead.whatsapp_phone} />
                  <Field label="Email" value={lead.email} />
                  <Field label="Est. annual value" value={formatValue(lead.estimated_annual_value)} />
                  <Field label="City" value={lead.city} />
                  <Field label="State" value={lead.state} />
                  <Field label="Address" value={lead.address} />
                  <Field label="Source" value={lead.source?.name ?? '—'} />
                  <Field label="Assignee" value={personLabel(lead.assignee)} />
                  <Field label="Messaging opt-in" value={lead.messaging_opt_in ? 'Yes' : 'No'} />
                  {lead.closure_reason ? (
                    <Field label="Closure reason" value={`${lead.closure_reason.name} (${lead.closure_reason.outcome})`} />
                  ) : null}
                </dl>
              </section>

              <div className="flex flex-col gap-6 lg:col-span-2">
                <LeadRemindersPanel reminders={lead.reminders ?? []} />
                <LeadNotesPanel notes={lead.notes ?? []} />
              </div>
            </div>
          </>
        )}
      </div>
    </CrmGuard>
  );
}

export default CrmLeadDetailPage;
