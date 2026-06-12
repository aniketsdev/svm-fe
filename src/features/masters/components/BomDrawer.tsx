/**
 * BOM create/edit drawer (feature 027): one zod schema for both modes
 * (header + line items — edit seeds the lines carried on the list row), plus
 * a "Documents" tab (edit mode only — a record must exist before files can
 * attach to it).
 */
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { CustomLabel } from '../../../common/custom-label';
import { RHFInput, RHFSelect } from '../../../common/rhf-wrappers';
import { MediaDocumentsPanel } from '../../../common/media-upload';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { cn } from '../../../lib/cn';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateBom, useAdminUpdateBom } from '../../../sdk/inventory';
import type { BomRow } from '../api/boms';
import { useProducts } from '../hooks/useProducts';
import { useRawMaterials } from '../hooks/useRawMaterials';
import { useBomForm, bomFormDefaults, type BomFormValues } from '../hooks/useCreateBomForm';

export interface BomDrawerProps {
  open: boolean;
  /** Row being edited; null/undefined → create mode. */
  bom?: BomRow | null;
  /** Tab to land on when opening in edit mode (e.g. the row's Documents action). */
  initialTab?: 'details' | 'documents';
  onClose: () => void;
  onSaved: () => void;
}

type TabKey = 'details' | 'documents';

export function BomDrawer({ open, bom, initialTab, onClose, onSaved }: BomDrawerProps) {
  const { toast } = useToast();
  const isEdit = bom != null;
  const [tab, setTab] = useState<TabKey>('details');
  const { control, handleSubmit, reset, setError } = useBomForm(bom);
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

  // Pick the landing tab during render when the drawer (re)opens — the
  // React-endorsed alternative to a setState-in-effect cascade.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTab(bom != null && initialTab === 'documents' ? 'documents' : 'details');
  }

  // Re-seed the form (header + lines) when the target row changes (or the
  // drawer re-opens).
  useEffect(() => {
    if (open) reset(bomFormDefaults(bom));
  }, [open, bom, reset]);

  const onMutationError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('code', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const createMutation = useAdminCreateBom({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'BOM created.') });
        reset(bomFormDefaults());
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const updateMutation = useAdminUpdateBom({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'BOM updated.') });
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const handleClose = () => {
    reset(bomFormDefaults(bom));
    onClose();
  };

  const onSubmit = (data: BomFormValues) => {
    const payload = {
      code: data.code,
      name: data.name,
      product_id: data.product_id ? Number(data.product_id) : null,
      output_qty: data.output_qty ? Number(data.output_qty) : null,
      // Lines are seeded from the row in edit mode, so the array is always
      // the user's current intent — send it in both modes.
      lines: data.lines.map((l) => ({
        raw_material_id: l.raw_material_id ? Number(l.raw_material_id) : null,
        quantity: Number(l.quantity),
        unit: l.unit || null,
      })),
    };
    if (isEdit) updateMutation.mutate({ bomId: bom.id, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? `Edit BOM — ${bom.name}` : 'Add BOM'}
      open={open}
      onClose={handleClose}
      drawerWidth="44rem"
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
        <MediaDocumentsPanel owner={{ ownerType: 'bom', ownerId: bom.id }} onChanged={onSaved} />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFInput<BomFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
            <RHFInput<BomFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFSelect<BomFormValues>
              name="product_id"
              control={control}
              label="Output product"
              placeholder={productItems.length ? 'Select product' : 'No products yet'}
              items={productItems}
              enableDeselect
            />
            <RHFInput<BomFormValues> name="output_qty" control={control} label="Output qty" placeholder="Enter quantity" />
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
                    <RHFSelect<BomFormValues>
                      name={`lines.${index}.raw_material_id`}
                      control={control}
                      placeholder="Select material"
                      items={materialItems}
                      enableDeselect
                    />
                  </div>
                  <div className="w-24">
                    <RHFInput<BomFormValues>
                      name={`lines.${index}.quantity`}
                      control={control}
                      placeholder="Qty"
                    />
                  </div>
                  <div className="w-20">
                    <RHFInput<BomFormValues>
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
            <CustomButton type="submit" variant="primary" loading={saving}>
              {isEdit ? 'Save changes' : 'Add BOM'}
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
