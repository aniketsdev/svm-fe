import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { toNumberOrNull } from '../../../utils/format';
import { useAdminCreateProduct } from '../../../sdk/admin';
import { useCreateProductForm, type CreateProductFormValues } from '../hooks/useCreateProductForm';

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateProductDialog({ open, onClose, onCreated }: CreateProductDialogProps) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateProductForm();
  const { handleApiError } = useFormApiErrors(setError);

  const createMutation = useAdminCreateProduct({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Product created.') });
        reset();
        onCreated();
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 409) {
          setError('code', { type: 'manual', message: errorMessage(error) });
          return;
        }
        const general = handleApiError(error);
        toast({ severity: 'error', message: general ?? errorMessage(error) });
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
        mrp: toNumberOrNull(data.mrp),
        gst_rate: toNumberOrNull(data.gst_rate),
        pack_size: data.pack_size || null,
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="Add product" open={open} onClose={handleClose} drawerWidth="34rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <RHFInput<CreateProductFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<CreateProductFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
          <RHFInput<CreateProductFormValues> name="hsn" control={control} label="HSN" placeholder="Enter HSN" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <RHFInput<CreateProductFormValues> name="mrp" control={control} label="MRP (₹)" placeholder="Enter MRP" />
          <RHFInput<CreateProductFormValues> name="gst_rate" control={control} label="GST %" placeholder="Enter GST %" />
          <RHFInput<CreateProductFormValues> name="pack_size" control={control} label="Pack size" placeholder="Enter pack size" />
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
    </CustomDrawer>
  );
}
