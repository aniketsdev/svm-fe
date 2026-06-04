import { CustomDialog } from '../../../common/custom-dialog';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { useAdminCreateProduct } from '../../../sdk/admin';
import { useCreateProductForm, type CreateProductFormValues } from '../hooks/useCreateProductForm';

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

function toNumber(v?: string): number | null {
  if (!v || !v.trim()) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export function CreateProductDialog({ open, onClose, onCreated }: CreateProductDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateProductForm();
  const { handleApiError } = useFormApiErrors(setError);

  const createMutation = useAdminCreateProduct({
    mutation: {
      onSuccess: () => {
        toast({ severity: 'success', message: 'Product created.' });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('code', { type: 'manual', message: 'A product with this code already exists.' });
          return;
        }
        const general = handleApiError(error);
        if (general) toast({ severity: 'error', message: general });
      },
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CreateProductFormValues) => {
    createMutation.mutate({
      data: {
        name: data.name,
        code: data.code,
        hsn: data.hsn || null,
        mrp: toNumber(data.mrp),
        gst_rate: toNumber(data.gst_rate),
        pack_size: data.pack_size || null,
      },
    });
  };

  return (
    <CustomDialog title="Add product" open={open} onClose={handleClose} width="34rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <CustomLabel htmlFor="name" isRequired label="Name" />
          <RHFInput<CreateProductFormValues> name="name" control={control} placeholder="Ashwagandha Churna 100g" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <CustomLabel htmlFor="code" isRequired label="Code" />
            <RHFInput<CreateProductFormValues> name="code" control={control} placeholder="PRD-001" />
          </div>
          <div>
            <CustomLabel htmlFor="hsn" label="HSN" />
            <RHFInput<CreateProductFormValues> name="hsn" control={control} placeholder="30049011" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <CustomLabel htmlFor="mrp" label="MRP (₹)" />
            <RHFInput<CreateProductFormValues> name="mrp" control={control} placeholder="250.00" />
          </div>
          <div>
            <CustomLabel htmlFor="gst_rate" label="GST %" />
            <RHFInput<CreateProductFormValues> name="gst_rate" control={control} placeholder="12" />
          </div>
          <div>
            <CustomLabel htmlFor="pack_size" label="Pack size" />
            <RHFInput<CreateProductFormValues> name="pack_size" control={control} placeholder="100g" />
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add product
          </CustomButton>
        </div>
      </form>
    </CustomDialog>
  );
}
