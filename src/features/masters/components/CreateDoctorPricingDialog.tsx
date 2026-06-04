import { useMemo } from 'react';
import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminCreateDoctorPricing } from '../../../sdk/admin';
import { useDoctors } from '../hooks/useDoctors';
import { useProducts } from '../hooks/useProducts';
import {
  useCreateDoctorPricingForm,
  type CreateDoctorPricingFormValues,
} from '../hooks/useCreateDoctorPricingForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateDoctorPricingDialog({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateDoctorPricingForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { doctors } = useDoctors();
  const { products } = useProducts();

  const doctorItems = useMemo(
    () => doctors.map((d) => ({ value: String(d.id), label: `${d.name} (${d.code})` })),
    [doctors],
  );
  const productItems = useMemo(
    () => products.map((p) => ({ value: String(p.id), label: `${p.name} (${p.code})` })),
    [products],
  );

  const createMutation = useAdminCreateDoctorPricing({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'Pricing added.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        const general = handleApiError(error);
        if (general) toast({ severity: 'error', message: general });
        else if (error instanceof ApiError)
          toast({ severity: 'error', message: 'Could not save pricing.' });
      },
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CreateDoctorPricingFormValues) => {
    createMutation.mutate({
      data: {
        doctor_id: Number(data.doctor_id),
        product_id: Number(data.product_id),
        price: Number(data.price),
        valid_from: data.valid_from || null,
        valid_to: data.valid_to || null,
      },
    });
  };

  return (
    <CustomDialog title="Add doctor pricing" open={open} onClose={handleClose} width="34rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFSelect<CreateDoctorPricingFormValues>
          name="doctor_id"
          control={control}
          label="Doctor"
          required
          placeholder={doctorItems.length ? 'Select a doctor' : 'No doctors yet'}
          items={doctorItems}
        />
        <RHFSelect<CreateDoctorPricingFormValues>
          name="product_id"
          control={control}
          label="Product"
          required
          placeholder={productItems.length ? 'Select a product' : 'No products yet'}
          items={productItems}
        />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <CustomLabel htmlFor="price" isRequired label="Price (₹)" />
            <RHFInput<CreateDoctorPricingFormValues> name="price" control={control} placeholder="199.50" />
          </div>
          <div>
            <CustomLabel htmlFor="valid_from" label="Valid from" />
            <RHFInput<CreateDoctorPricingFormValues> name="valid_from" control={control} placeholder="2026-06-01" />
          </div>
          <div>
            <CustomLabel htmlFor="valid_to" label="Valid to" />
            <RHFInput<CreateDoctorPricingFormValues> name="valid_to" control={control} placeholder="2026-12-31" />
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add pricing
          </CustomButton>
        </div>
      </form>
    </CustomDialog>
  );
}
