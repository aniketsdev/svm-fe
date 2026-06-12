/**
 * Doctor create/edit drawer (feature 027): one zod schema for both modes,
 * plus a "Documents" tab (edit mode only — a record must exist before files
 * can attach to it).
 */
import { useEffect, useState } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput } from '../../../common/rhf-wrappers';
import { MediaDocumentsPanel } from '../../../common/media-upload';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { cn } from '../../../lib/cn';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateDoctor, useAdminUpdateDoctor } from '../../../sdk/inventory';
import type { DoctorRow } from '../api/doctors';
import { useDoctorForm, doctorFormDefaults, type DoctorFormValues } from '../hooks/useCreateDoctorForm';

export interface DoctorDrawerProps {
  open: boolean;
  /** Row being edited; null/undefined → create mode. */
  doctor?: DoctorRow | null;
  /** Tab to land on when opening in edit mode (e.g. the row's Documents action). */
  initialTab?: 'details' | 'documents';
  onClose: () => void;
  onSaved: () => void;
}

type TabKey = 'details' | 'documents';

export function DoctorDrawer({ open, doctor, initialTab, onClose, onSaved }: DoctorDrawerProps) {
  const { toast } = useToast();
  const isEdit = doctor != null;
  const [tab, setTab] = useState<TabKey>('details');
  const { control, handleSubmit, reset, setError } = useDoctorForm(doctor);
  const { handleApiError } = useFormApiErrors(setError);

  // Pick the landing tab during render when the drawer (re)opens — the
  // React-endorsed alternative to a setState-in-effect cascade.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTab(doctor != null && initialTab === 'documents' ? 'documents' : 'details');
  }

  // Re-seed the form when the target row changes (or the drawer re-opens).
  useEffect(() => {
    if (open) reset(doctorFormDefaults(doctor));
  }, [open, doctor, reset]);

  const onMutationError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('code', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const createMutation = useAdminCreateDoctor({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Doctor created.') });
        reset(doctorFormDefaults());
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const updateMutation = useAdminUpdateDoctor({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Doctor updated.') });
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const handleClose = () => {
    reset(doctorFormDefaults(doctor));
    onClose();
  };

  const onSubmit = (data: DoctorFormValues) => {
    const payload = {
      name: data.name,
      code: data.code,
      clinic_name: data.clinic_name || null,
      phone: data.phone || null,
      state_code: data.state_code || null,
      city: data.city || null,
    };
    if (isEdit) updateMutation.mutate({ doctorId: doctor.id, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? `Edit doctor — ${doctor.name}` : 'Add doctor'}
      open={open}
      onClose={handleClose}
      drawerWidth="34rem"
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
        <MediaDocumentsPanel owner={{ ownerType: 'doctor', ownerId: doctor.id }} onChanged={onSaved} />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFInput<DoctorFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
            <RHFInput<DoctorFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
          </div>
          <RHFInput<DoctorFormValues> name="clinic_name" control={control} label="Clinic" placeholder="Enter clinic name" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <RHFInput<DoctorFormValues> name="phone" control={control} label="Phone" placeholder="Enter phone" />
            <RHFInput<DoctorFormValues> name="state_code" control={control} label="State code" placeholder="Enter state code" />
            <RHFInput<DoctorFormValues> name="city" control={control} label="City" placeholder="Enter city" />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={saving}>
              {isEdit ? 'Save changes' : 'Add doctor'}
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
