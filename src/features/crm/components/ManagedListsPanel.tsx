import { useQuery } from '@tanstack/react-query';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import {
  useAdminCreateLeadSource,
  useAdminUpdateLeadSource,
  useAdminCreateClosureReason,
  useAdminUpdateClosureReason,
} from '../../../sdk/crm';
import type { ClosureReasonOut, SourceOut } from '../../../sdk/schemas';
import { sourcesQueryOptions, closureReasonsQueryOptions, type Envelope } from '../api/crm';
import {
  useSourceForm,
  useClosureReasonForm,
  type SourceFormValues,
  type ClosureReasonFormValues,
} from '../hooks/useManagedListForms';

const OUTCOME_ITEMS = [
  { value: 'LOST', label: 'Lost' },
  { value: 'WON', label: 'Won' },
];

/** Admin management of the CRM lookup lists (sources & closure reasons). */
export function ManagedListsPanel() {
  const { toast } = useToast();

  // --- Sources -------------------------------------------------------------
  const sourcesQuery = useQuery(sourcesQueryOptions(true));
  const sources = (sourcesQuery.data as Envelope<SourceOut[]> | undefined)?.data ?? [];
  const sourceForm = useSourceForm();
  const sourceApiErrors = useFormApiErrors(sourceForm.setError);

  const createSource = useAdminCreateLeadSource({
    mutation: {
      onSuccess: (res) => {
        toast({ severity: 'success', message: successMessage(res, 'Source added.') });
        sourceForm.reset({ name: '' });
        sourcesQuery.refetch();
      },
      onError: (e) => {
        const general = sourceApiErrors.handleApiError(e);
        toast({ severity: 'error', message: general ?? errorMessage(e) });
      },
    },
  });
  const updateSource = useAdminUpdateLeadSource({
    mutation: {
      onSuccess: () => sourcesQuery.refetch(),
      onError: (e) => toast({ severity: 'error', message: errorMessage(e) }),
    },
  });

  // --- Closure reasons -----------------------------------------------------
  const reasonsQuery = useQuery(closureReasonsQueryOptions(undefined, true));
  const reasons = (reasonsQuery.data as Envelope<ClosureReasonOut[]> | undefined)?.data ?? [];
  const reasonForm = useClosureReasonForm();
  const reasonApiErrors = useFormApiErrors(reasonForm.setError);

  const createReason = useAdminCreateClosureReason({
    mutation: {
      onSuccess: (res) => {
        toast({ severity: 'success', message: successMessage(res, 'Closure reason added.') });
        reasonForm.reset({ name: '', outcome: 'LOST' });
        reasonsQuery.refetch();
      },
      onError: (e) => {
        const general = reasonApiErrors.handleApiError(e);
        toast({ severity: 'error', message: general ?? errorMessage(e) });
      },
    },
  });
  const updateReason = useAdminUpdateClosureReason({
    mutation: {
      onSuccess: () => reasonsQuery.refetch(),
      onError: (e) => toast({ severity: 'error', message: errorMessage(e) }),
    },
  });

  const onAddSource = (v: SourceFormValues) => createSource.mutate({ data: { name: v.name } });
  const onAddReason = (v: ClosureReasonFormValues) =>
    createReason.mutate({ data: { name: v.name, outcome: v.outcome } });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Sources */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Lead sources</h2>
        <form
          noValidate
          onSubmit={sourceForm.handleSubmit(onAddSource)}
          className="mt-3 flex items-end gap-2"
        >
          <div className="flex-1">
            <RHFInput<SourceFormValues> name="name" control={sourceForm.control} label="New source" placeholder="e.g. Trade Fair" />
          </div>
          <CustomButton type="submit" variant="primary" size="md" loading={createSource.isPending}>
            Add
          </CustomButton>
        </form>
        <ul className="mt-3 flex flex-col gap-2">
          {sources.map((s) => (
            <li key={s.uuid} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
              <span className={`text-sm ${s.is_active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>{s.name}</span>
              <CustomButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateSource.mutate({ sourceUuid: s.uuid, data: { is_active: !s.is_active } })}
              >
                {s.is_active ? 'Deactivate' : 'Activate'}
              </CustomButton>
            </li>
          ))}
        </ul>
      </section>

      {/* Closure reasons */}
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Closure reasons</h2>
        <form
          noValidate
          onSubmit={reasonForm.handleSubmit(onAddReason)}
          className="mt-3 flex items-end gap-2"
        >
          <div className="flex-1">
            <RHFInput<ClosureReasonFormValues> name="name" control={reasonForm.control} label="New reason" placeholder="e.g. Budget cut" />
          </div>
          <div className="w-28">
            <RHFSelect<ClosureReasonFormValues> name="outcome" control={reasonForm.control} label="Outcome" placeholder="Outcome" items={OUTCOME_ITEMS} />
          </div>
          <CustomButton type="submit" variant="primary" size="md" loading={createReason.isPending}>
            Add
          </CustomButton>
        </form>
        <ul className="mt-3 flex flex-col gap-2">
          {reasons.map((r) => (
            <li key={r.uuid} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
              <span className={`text-sm ${r.is_active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                {r.name} <span className="text-xs text-muted-foreground">({r.outcome})</span>
              </span>
              <CustomButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => updateReason.mutate({ reasonUuid: r.uuid, data: { is_active: !r.is_active } })}
              >
                {r.is_active ? 'Deactivate' : 'Activate'}
              </CustomButton>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
