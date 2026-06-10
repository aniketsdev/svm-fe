import { useState } from 'react';
import { ArrowLeft, Loader2, Pencil } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CustomButton } from '../../../common/custom-buttons';
import { useToast } from '../../../common/common-snackbar';
import { errorMessage } from '../../../utils/api-messages';
import { useAdminChangeLeadStage, useAdminReopenLead } from '../../../sdk/crm';
import { formatValue, personLabel, type Stage } from '../api/crm';
import { useLeadDetail } from '../hooks/useLeadDetail';
import { useCrmPermissions } from '../hooks/usePermissions';
import { CrmGuard } from '../components/CrmGuard';
import { StageBadge } from '../components/StageBadge';
import { LeadNotesPanel } from '../components/LeadNotesPanel';
import { LeadRemindersPanel } from '../components/LeadRemindersPanel';
import { EditLeadDrawer } from '../components/EditLeadDrawer';
import { CloseLeadDialog } from '../components/CloseLeadDialog';

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value && value !== '' ? value : '—'}</dd>
    </div>
  );
}

const ACTIVE_STAGES: { value: Stage; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'FOLLOW_UP', label: 'Follow-Up' },
];

export function CrmLeadDetailPage() {
  const { leadUuid = '' } = useParams<{ leadUuid: string }>();
  const [params] = useSearchParams();
  const backTo = `/crm${params.toString() ? `?${params.toString()}` : ''}`;
  const { lead, isLoading, isError, refetch } = useLeadDetail(leadUuid);
  const { canUpdate, canCreate, canDelete } = useCrmPermissions();
  const { toast } = useToast();

  const [editOpen, setEditOpen] = useState(false);
  const [closeOutcome, setCloseOutcome] = useState<'WON' | 'LOST' | null>(null);

  const onFail = (e: unknown) => toast({ severity: 'error', message: errorMessage(e) });
  const stageMutation = useAdminChangeLeadStage({
    mutation: { onSuccess: () => { toast({ severity: 'success', message: 'Stage updated.' }); refetch(); }, onError: onFail },
  });
  const reopenMutation = useAdminReopenLead({
    mutation: { onSuccess: () => { toast({ severity: 'success', message: 'Lead reopened.' }); refetch(); }, onError: onFail },
  });

  const isClosed = lead ? lead.stage === 'WON' || lead.stage === 'LOST' : false;

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
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-foreground">{lead.contact_name}</h1>
                <span className="text-muted-foreground">·</span>
                <span className="text-lg text-foreground">{lead.clinic_name}</span>
                <StageBadge stage={lead.stage} />
              </div>
              {canUpdate ? (
                <CustomButton variant="outline" icon={<Pencil className="size-4" />} onClick={() => setEditOpen(true)}>
                  Edit
                </CustomButton>
              ) : null}
            </div>

            {/* Pipeline controls */}
            {canUpdate ? (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
                <span className="text-sm font-medium text-muted-foreground">Stage:</span>
                {ACTIVE_STAGES.map((s) => (
                  <CustomButton
                    key={s.value}
                    type="button"
                    size="sm"
                    variant={lead.stage === s.value ? 'primary' : 'outline'}
                    onClick={() => stageMutation.mutate({ leadUuid, data: { stage: s.value } })}
                  >
                    {s.label}
                  </CustomButton>
                ))}
                <span className="mx-1 h-5 w-px bg-border" aria-hidden />
                <CustomButton type="button" size="sm" variant="outline" onClick={() => setCloseOutcome('WON')}>
                  Mark Won
                </CustomButton>
                <CustomButton type="button" size="sm" variant="outline" onClick={() => setCloseOutcome('LOST')}>
                  Mark Lost
                </CustomButton>
                {isClosed ? (
                  <CustomButton type="button" size="sm" variant="ghost" onClick={() => reopenMutation.mutate({ leadUuid })}>
                    Reopen
                  </CustomButton>
                ) : null}
              </div>
            ) : null}

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
                  {lead.closure_comment ? <Field label="Closure comment" value={lead.closure_comment} /> : null}
                </dl>
              </section>

              <div className="flex flex-col gap-6 lg:col-span-2">
                <LeadRemindersPanel
                  leadUuid={leadUuid}
                  reminders={lead.reminders ?? []}
                  onChanged={refetch}
                  canCreate={canCreate}
                  canUpdate={canUpdate}
                />
                <LeadNotesPanel
                  leadUuid={leadUuid}
                  notes={lead.notes ?? []}
                  onChanged={refetch}
                  canCreate={canCreate}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                />
              </div>
            </div>

            <EditLeadDrawer lead={editOpen ? lead : null} onClose={() => setEditOpen(false)} onUpdated={refetch} />
            <CloseLeadDialog
              leadUuid={leadUuid}
              outcome={closeOutcome}
              onClose={() => setCloseOutcome(null)}
              onClosed={refetch}
            />
          </>
        )}
      </div>
    </CrmGuard>
  );
}

export default CrmLeadDetailPage;
