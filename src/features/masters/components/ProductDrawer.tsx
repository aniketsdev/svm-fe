/**
 * Product create/edit drawer (feature 027): one zod schema for both modes,
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
import { toNumberOrNull } from '../../../utils/format';
import { useAdminCreateProduct, useAdminUpdateProduct } from '../../../sdk/inventory';
import type { ProductRow } from '../api/products';
import { useProductForm, productFormDefaults, type ProductFormValues } from '../hooks/useCreateProductForm';

export interface ProductDrawerProps {
  open: boolean;
  /** Row being edited; null/undefined → create mode. */
  product?: ProductRow | null;
  /** Tab to land on when opening in edit mode (e.g. the row's Documents action). */
  initialTab?: 'details' | 'documents';
  onClose: () => void;
  onSaved: () => void;
}

type TabKey = 'details' | 'documents';

export function ProductDrawer({ open, product, initialTab, onClose, onSaved }: ProductDrawerProps) {
  const { toast } = useToast();
  const isEdit = product != null;
  const [tab, setTab] = useState<TabKey>('details');
  const { control, handleSubmit, reset, setError } = useProductForm(product);
  const { handleApiError } = useFormApiErrors(setError);

  // Pick the landing tab during render when the drawer (re)opens — the
  // React-endorsed alternative to a setState-in-effect cascade.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTab(product != null && initialTab === 'documents' ? 'documents' : 'details');
  }

  // Re-seed the form when the target row changes (or the drawer re-opens).
  useEffect(() => {
    if (open) reset(productFormDefaults(product));
  }, [open, product, reset]);

  const onMutationError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('code', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const createMutation = useAdminCreateProduct({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Product created.') });
        reset(productFormDefaults());
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const updateMutation = useAdminUpdateProduct({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Product updated.') });
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const handleClose = () => {
    reset(productFormDefaults(product));
    onClose();
  };

  const onSubmit = (data: ProductFormValues) => {
    const payload = {
      name: data.name,
      code: data.code,
      hsn: data.hsn || null,
      mrp: toNumberOrNull(data.mrp),
      gst_rate: toNumberOrNull(data.gst_rate),
      pack_size: data.pack_size || null,
    };
    if (isEdit) updateMutation.mutate({ productId: product.id, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? `Edit product — ${product.name}` : 'Add product'}
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
        <MediaDocumentsPanel owner={{ ownerType: 'product', ownerId: product.id }} onChanged={onSaved} />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <RHFInput<ProductFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFInput<ProductFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
            <RHFInput<ProductFormValues> name="hsn" control={control} label="HSN" placeholder="Enter HSN" />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <RHFInput<ProductFormValues> name="mrp" control={control} label="MRP (₹)" placeholder="Enter MRP" />
            <RHFInput<ProductFormValues> name="gst_rate" control={control} label="GST %" placeholder="Enter GST %" />
            <RHFInput<ProductFormValues> name="pack_size" control={control} label="Pack size" placeholder="Enter pack size" />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={saving}>
              {isEdit ? 'Save changes' : 'Add product'}
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
