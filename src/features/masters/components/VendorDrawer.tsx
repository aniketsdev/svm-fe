/**
 * Vendor create/edit drawer (feature 027): one zod schema for both modes,
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
import { useAdminCreateVendor, useAdminUpdateVendor } from '../../../sdk/inventory';
import type { VendorRow } from '../api/vendors';
import { useVendorForm, vendorFormDefaults, type VendorFormValues } from '../hooks/useCreateVendorForm';

export interface VendorDrawerProps {
  open: boolean;
  /** Row being edited; null/undefined → create mode. */
  vendor?: VendorRow | null;
  /** Tab to land on when opening in edit mode (e.g. the row's Documents action). */
  initialTab?: 'details' | 'documents';
  onClose: () => void;
  onSaved: () => void;
}

type TabKey = 'details' | 'documents';

export function VendorDrawer({ open, vendor, initialTab, onClose, onSaved }: VendorDrawerProps) {
  const { toast } = useToast();
  const isEdit = vendor != null;
  const [tab, setTab] = useState<TabKey>('details');
  const { control, handleSubmit, reset, setError } = useVendorForm(vendor);
  const { handleApiError } = useFormApiErrors(setError);

  // Pick the landing tab during render when the drawer (re)opens — the
  // React-endorsed alternative to a setState-in-effect cascade.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTab(vendor != null && initialTab === 'documents' ? 'documents' : 'details');
  }

  // Re-seed the form when the target row changes (or the drawer re-opens).
  useEffect(() => {
    if (open) reset(vendorFormDefaults(vendor));
  }, [open, vendor, reset]);

  const onMutationError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('code', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const createMutation = useAdminCreateVendor({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Vendor created.') });
        reset(vendorFormDefaults());
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const updateMutation = useAdminUpdateVendor({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Vendor updated.') });
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const handleClose = () => {
    reset(vendorFormDefaults(vendor));
    onClose();
  };

  const onSubmit = (data: VendorFormValues) => {
    const payload = {
      name: data.name,
      code: data.code,
      gstin: data.gstin || null,
      state_code: data.state_code || null,
      city: data.city || null,
    };
    if (isEdit) updateMutation.mutate({ vendorId: vendor.id, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? `Edit vendor — ${vendor.name}` : 'Add vendor'}
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
        <MediaDocumentsPanel owner={{ ownerType: 'vendor', ownerId: vendor.id }} onChanged={onSaved} />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <RHFInput<VendorFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFInput<VendorFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
            <RHFInput<VendorFormValues> name="gstin" control={control} label="GSTIN" placeholder="Enter GSTIN" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFInput<VendorFormValues> name="state_code" control={control} label="State code" placeholder="Enter state code" />
            <RHFInput<VendorFormValues> name="city" control={control} label="City" placeholder="Enter city" />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={saving}>
              {isEdit ? 'Save changes' : 'Add vendor'}
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
