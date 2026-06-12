/**
 * Doctor-pricing create/edit drawer (feature 027): one zod schema for both
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
import { cn } from '../../../lib/cn';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateDoctorPricing, useAdminUpdateDoctorPricing } from '../../../sdk/inventory';
import type { DoctorPricingRow } from '../api/doctor-pricing';
import { useDoctorOptions } from '../hooks/useDoctors';
import { useProducts } from '../hooks/useProducts';
import {
  useDoctorPricingForm,
  doctorPricingFormDefaults,
  type DoctorPricingFormValues,
} from '../hooks/useCreateDoctorPricingForm';

export interface DoctorPricingDrawerProps {
  open: boolean;
  /** Row being edited; null/undefined → create mode. */
  pricing?: DoctorPricingRow | null;
  /** Tab to land on when opening in edit mode (e.g. the row's Documents action). */
  initialTab?: 'details' | 'documents';
  onClose: () => void;
  onSaved: () => void;
}

type TabKey = 'details' | 'documents';

export function DoctorPricingDrawer({ open, pricing, initialTab, onClose, onSaved }: DoctorPricingDrawerProps) {
  const { toast } = useToast();
  const isEdit = pricing != null;
  const [tab, setTab] = useState<TabKey>('details');
  const { control, handleSubmit, reset, setError } = useDoctorPricingForm(pricing);
  const { handleApiError } = useFormApiErrors(setError);
  const { doctors } = useDoctorOptions();
  const { products } = useProducts();

  const doctorItems = useMemo(
    () => doctors.map((d) => ({ value: String(d.id), label: `${d.name} (${d.code})` })),
    [doctors],
  );
  const productItems = useMemo(
    () => products.map((p) => ({ value: String(p.id), label: `${p.name} (${p.code})` })),
    [products],
  );

  // Pick the landing tab during render when the drawer (re)opens — the
  // React-endorsed alternative to a setState-in-effect cascade.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTab(pricing != null && initialTab === 'documents' ? 'documents' : 'details');
  }

  // Re-seed the form when the target row changes (or the drawer re-opens).
  useEffect(() => {
    if (open) reset(doctorPricingFormDefaults(pricing));
  }, [open, pricing, reset]);

  // No single unique field here — 409s (and everything else unmapped) toast.
  const onMutationError = (error: unknown) => {
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const createMutation = useAdminCreateDoctorPricing({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Pricing added.') });
        reset(doctorPricingFormDefaults());
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const updateMutation = useAdminUpdateDoctorPricing({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Pricing updated.') });
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const handleClose = () => {
    reset(doctorPricingFormDefaults(pricing));
    onClose();
  };

  const onSubmit = (data: DoctorPricingFormValues) => {
    const payload = {
      doctor_id: Number(data.doctor_id),
      product_id: Number(data.product_id),
      price: Number(data.price),
      valid_from: data.valid_from || null,
      valid_to: data.valid_to || null,
    };
    if (isEdit) updateMutation.mutate({ pricingId: pricing.id, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? `Edit pricing — ${pricing.doctor_name} / ${pricing.product_name}` : 'Add doctor pricing'}
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
        <MediaDocumentsPanel owner={{ ownerType: 'doctor_pricing', ownerId: pricing.id }} onChanged={onSaved} />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <RHFSelect<DoctorPricingFormValues>
            name="doctor_id"
            control={control}
            label="Doctor"
            required
            placeholder={doctorItems.length ? 'Select doctor' : 'No doctors yet'}
            items={doctorItems}
          />
          <RHFSelect<DoctorPricingFormValues>
            name="product_id"
            control={control}
            label="Product"
            required
            placeholder={productItems.length ? 'Select product' : 'No products yet'}
            items={productItems}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <RHFInput<DoctorPricingFormValues> name="price" control={control} label="Price (₹)" required placeholder="Enter price" />
            <RHFInput<DoctorPricingFormValues> name="valid_from" control={control} label="Valid from" placeholder="YYYY-MM-DD" />
            <RHFInput<DoctorPricingFormValues> name="valid_to" control={control} label="Valid to" placeholder="YYYY-MM-DD" />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={saving}>
              {isEdit ? 'Save changes' : 'Add pricing'}
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
