import { useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateBom } from '../../../sdk/inventory';
import { useProducts } from '../hooks/useProducts';
import { useRawMaterials } from '../hooks/useRawMaterials';
import { useCreateBomForm, type CreateBomFormValues } from '../hooks/useCreateBomForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateBomDialog({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const { control, handleSubmit, reset, setError } = useCreateBomForm();
  const { handleApiError } = useFormApiErrors(setError);
  const { fields, append, remove } = useFieldArray({ control, name: 'lines' });
  const { products } = useProducts();
  const { materials } = useRawMaterials();

  const productItems = useMemo(
    () => products.map((p) => ({ value: String(p.id), label: `${p.name} (${p.code})` })),
    [products],
  );
  const materialItems = useMemo(
    () => materials.map((m) => ({ value: String(m.id), label: `${m.name} (${m.code})` })),
    [materials],
  );

  const createMutation = useAdminCreateBom({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'BOM created.') });
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

  const onSubmit = (data: CreateBomFormValues) => {
    createMutation.mutate({
      data: {
        code: data.code,
        name: data.name,
        product_id: data.product_id ? Number(data.product_id) : null,
        output_qty: data.output_qty ? Number(data.output_qty) : null,
        lines: data.lines.map((l) => ({
          raw_material_id: l.raw_material_id ? Number(l.raw_material_id) : null,
          quantity: Number(l.quantity),
          unit: l.unit || null,
        })),
      },
    });
  };

  return (
    <CustomDrawer anchor="right" title="Add BOM" open={open} onClose={handleClose} drawerWidth="48rem">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <RHFInput<CreateBomFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
          <RHFInput<CreateBomFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <RHFSelect<CreateBomFormValues>
            name="product_id"
            control={control}
            label="Output product"
            placeholder={productItems.length ? 'Select product' : 'No products yet'}
            items={productItems}
            enableDeselect
          />
          <RHFInput<CreateBomFormValues> name="output_qty" control={control} label="Output qty" placeholder="Enter quantity" />
        </div>

        {/* Line items */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <CustomLabel htmlFor="lines" isRequired label="Line items" />
            <button
              type="button"
              onClick={() => append({ raw_material_id: '', quantity: '', unit: '' })}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="size-3.5" /> Add line
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <RHFSelect<CreateBomFormValues>
                    name={`lines.${index}.raw_material_id`}
                    control={control}
                    placeholder="Select material"
                    items={materialItems}
                    enableDeselect
                  />
                </div>
                <div className="w-24">
                  <RHFInput<CreateBomFormValues>
                    name={`lines.${index}.quantity`}
                    control={control}
                    placeholder="Qty"
                  />
                </div>
                <div className="w-20">
                  <RHFInput<CreateBomFormValues>
                    name={`lines.${index}.unit`}
                    control={control}
                    placeholder="Unit"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label="Remove line"
                  className="mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive disabled:opacity-40"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <CustomButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" variant="primary" loading={createMutation.isPending}>
            Add BOM
          </CustomButton>
        </div>
      </form>
    </CustomDrawer>
  );
}
