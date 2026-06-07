import { useMemo } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { errorMessage, successMessage } from '../../../utils/api-messages';
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
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Pricing added.') });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        const general = handleApiError(error);
        toast({ severity: 'error', message: general ?? errorMessage(error) });
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
    <CustomDrawer anchor="right" title="Add doctor pricing" open={open} onClose={handleClose} drawerWidth="34rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFSelect<CreateDoctorPricingFormValues>
          name="doctor_id"
          control={control}
          label="Doctor"
          required
          placeholder={doctorItems.length ? 'Select doctor' : 'No doctors yet'}
          items={doctorItems}
        />
        <RHFSelect<CreateDoctorPricingFormValues>
          name="product_id"
          control={control}
          label="Product"
          required
          placeholder={productItems.length ? 'Select product' : 'No products yet'}
          items={productItems}
        />
        <div className="grid grid-cols-3 gap-3">
          <RHFInput<CreateDoctorPricingFormValues> name="price" control={control} label="Price (₹)" required placeholder="Enter price" />
          <RHFInput<CreateDoctorPricingFormValues> name="valid_from" control={control} label="Valid from" placeholder="YYYY-MM-DD" />
          <RHFInput<CreateDoctorPricingFormValues> name="valid_to" control={control} label="Valid to" placeholder="YYYY-MM-DD" />
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
    </CustomDrawer>
  );
}
