/**
 * Doctor-alias create/edit drawer (feature 027): one zod schema for both
 * modes, plus a "Documents" tab (edit mode only — a record must exist before
 * files can attach to it).
 */
import { useEffect, useMemo, useState } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { MediaDocumentsPanel } from '../../../common/media-upload';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { cn } from '../../../lib/cn';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateDoctorAlias, useAdminUpdateDoctorAlias } from '../../../sdk/inventory';
import type { DoctorAliasRow } from '../api/doctor-aliases';
import { useDoctorOptions } from '../hooks/useDoctors';
import {
  useDoctorAliasForm,
  doctorAliasFormDefaults,
  type DoctorAliasFormValues,
} from '../hooks/useCreateDoctorAliasForm';

export interface DoctorAliasDrawerProps {
  open: boolean;
  /** Row being edited; null/undefined → create mode. */
  alias?: DoctorAliasRow | null;
  /** Tab to land on when opening in edit mode (e.g. the row's Documents action). */
  initialTab?: 'details' | 'documents';
  onClose: () => void;
  onSaved: () => void;
}

type TabKey = 'details' | 'documents';

export function DoctorAliasDrawer({ open, alias, initialTab, onClose, onSaved }: DoctorAliasDrawerProps) {
  const { toast } = useToast();
  const isEdit = alias != null;
  const [tab, setTab] = useState<TabKey>('details');
  const { control, handleSubmit, reset, setError } = useDoctorAliasForm(alias);
  const { handleApiError } = useFormApiErrors(setError);
  const { doctors } = useDoctorOptions();

  const doctorItems = useMemo(
    () => doctors.map((d) => ({ value: String(d.id), label: `${d.name} (${d.code})` })),
    [doctors],
  );

  // Pick the landing tab during render when the drawer (re)opens — the
  // React-endorsed alternative to a setState-in-effect cascade.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTab(alias != null && initialTab === 'documents' ? 'documents' : 'details');
  }

  // Re-seed the form when the target row changes (or the drawer re-opens).
  useEffect(() => {
    if (open) reset(doctorAliasFormDefaults(alias));
  }, [open, alias, reset]);

  const onMutationError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      // Uniqueness is on the (doctor, alias) pair — surface it on the alias field.
      setError('alias', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const createMutation = useAdminCreateDoctorAlias({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Alias added.') });
        reset(doctorAliasFormDefaults());
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const updateMutation = useAdminUpdateDoctorAlias({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Alias updated.') });
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const handleClose = () => {
    reset(doctorAliasFormDefaults(alias));
    onClose();
  };

  const onSubmit = (data: DoctorAliasFormValues) => {
    const payload = { doctor_id: Number(data.doctor_id), alias: data.alias };
    if (isEdit) updateMutation.mutate({ aliasId: alias.id, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? `Edit alias — ${alias.alias}` : 'Add doctor alias'}
      open={open}
      onClose={handleClose}
      drawerWidth="30rem"
    >
      {isEdit && (
        <div className="mb-4 border-b border-border">
          <nav className="-mb-px flex gap-1">
            {(
              [
                { key: 'details', label: 'Details' },
                { key: 'documents', label: 'Documents' },
              ] as { key: TabKey; label: string }[]
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={tab === t.key ? 'page' : undefined}
                className={cn(
                  'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none',
                  tab === t.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {tab === 'documents' && isEdit ? (
        <MediaDocumentsPanel owner={{ ownerType: 'doctor_alias', ownerId: alias.id }} onChanged={onSaved} />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <RHFSelect<DoctorAliasFormValues>
            name="doctor_id"
            control={control}
            label="Doctor"
            required
            placeholder={doctorItems.length ? 'Select doctor' : 'No doctors yet'}
            items={doctorItems}
          />
          <RHFInput<DoctorAliasFormValues> name="alias" control={control} label="Alias" required placeholder="Enter alias" />
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={saving}>
              {isEdit ? 'Save changes' : 'Add alias'}
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
