/**
 * Courier partner create/edit drawer (feature 027): one zod schema for both
 * modes, plus a "Documents" tab (edit mode only — a record must exist before
 * files can attach to it).
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
import { useAdminCreateCourierPartner, useAdminUpdateCourierPartner } from '../../../sdk/inventory';
import type { CourierRow } from '../api/couriers';
import { useCourierForm, courierFormDefaults, type CourierFormValues } from '../hooks/useCreateCourierForm';

export interface CourierDrawerProps {
  open: boolean;
  /** Row being edited; null/undefined → create mode. */
  courier?: CourierRow | null;
  /** Tab to land on when opening in edit mode (e.g. the row's Documents action). */
  initialTab?: 'details' | 'documents';
  onClose: () => void;
  onSaved: () => void;
}

type TabKey = 'details' | 'documents';

export function CourierDrawer({ open, courier, initialTab, onClose, onSaved }: CourierDrawerProps) {
  const { toast } = useToast();
  const isEdit = courier != null;
  const [tab, setTab] = useState<TabKey>('details');
  const { control, handleSubmit, reset, setError } = useCourierForm(courier);
  const { handleApiError } = useFormApiErrors(setError);

  // Pick the landing tab during render when the drawer (re)opens — the
  // React-endorsed alternative to a setState-in-effect cascade.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTab(courier != null && initialTab === 'documents' ? 'documents' : 'details');
  }

  // Re-seed the form when the target row changes (or the drawer re-opens).
  useEffect(() => {
    if (open) reset(courierFormDefaults(courier));
  }, [open, courier, reset]);

  const onMutationError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('code', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const createMutation = useAdminCreateCourierPartner({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Courier partner created.') });
        reset(courierFormDefaults());
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const updateMutation = useAdminUpdateCourierPartner({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Courier partner updated.') });
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const handleClose = () => {
    reset(courierFormDefaults(courier));
    onClose();
  };

  const onSubmit = (data: CourierFormValues) => {
    const payload = {
      name: data.name,
      code: data.code,
      contact_phone: data.contact_phone || null,
      tracking_url: data.tracking_url || null,
    };
    if (isEdit) updateMutation.mutate({ courierId: courier.id, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? `Edit courier partner — ${courier.name}` : 'Add courier partner'}
      open={open}
      onClose={handleClose}
      drawerWidth="32rem"
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
        <MediaDocumentsPanel owner={{ ownerType: 'courier_partner', ownerId: courier.id }} onChanged={onSaved} />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <RHFInput<CourierFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFInput<CourierFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
            <RHFInput<CourierFormValues> name="contact_phone" control={control} label="Phone" placeholder="Enter phone" />
          </div>
          <RHFInput<CourierFormValues> name="tracking_url" control={control} label="Tracking URL" placeholder="Enter tracking URL" />
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={saving}>
              {isEdit ? 'Save changes' : 'Add courier'}
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
