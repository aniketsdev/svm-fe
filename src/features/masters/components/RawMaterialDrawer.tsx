/**
 * Raw material create/edit drawer (feature 027): one zod schema for both
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
import { ApiError } from '../../../api/client';
import { cn } from '../../../lib/cn';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateRawMaterial, useAdminUpdateRawMaterial } from '../../../sdk/inventory';
import { useRmCategories } from '../hooks/useRmCategories';
import type { RawMaterialRow } from '../api/raw-materials';
import {
  useRawMaterialForm,
  rawMaterialFormDefaults,
  type RawMaterialFormValues,
} from '../hooks/useCreateRawMaterialForm';

export interface RawMaterialDrawerProps {
  open: boolean;
  /** Row being edited; null/undefined → create mode. */
  material?: RawMaterialRow | null;
  /** Tab to land on when opening in edit mode (e.g. the row's Documents action). */
  initialTab?: 'details' | 'documents';
  onClose: () => void;
  onSaved: () => void;
}

type TabKey = 'details' | 'documents';

export function RawMaterialDrawer({ open, material, initialTab, onClose, onSaved }: RawMaterialDrawerProps) {
  const { toast } = useToast();
  const isEdit = material != null;
  const [tab, setTab] = useState<TabKey>('details');
  const { control, handleSubmit, reset, setError } = useRawMaterialForm(material);
  const { handleApiError } = useFormApiErrors(setError);
  const { categories } = useRmCategories({ page: 0, pageSize: 100, sort: 'name' });

  const categoryItems = useMemo(
    () => categories.map((c) => ({ value: String(c.id), label: c.name })),
    [categories],
  );

  // Pick the landing tab during render when the drawer (re)opens — the
  // React-endorsed alternative to a setState-in-effect cascade.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTab(material != null && initialTab === 'documents' ? 'documents' : 'details');
  }

  // Re-seed the form when the target row changes (or the drawer re-opens).
  useEffect(() => {
    if (open) reset(rawMaterialFormDefaults(material));
  }, [open, material, reset]);

  const onMutationError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('code', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const createMutation = useAdminCreateRawMaterial({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Raw material created.') });
        reset(rawMaterialFormDefaults());
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const updateMutation = useAdminUpdateRawMaterial({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Raw material updated.') });
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const handleClose = () => {
    reset(rawMaterialFormDefaults(material));
    onClose();
  };

  const onSubmit = (data: RawMaterialFormValues) => {
    const payload = {
      name: data.name,
      code: data.code,
      rm_category_id: data.rm_category_id ? Number(data.rm_category_id) : null,
      unit: data.unit || null,
    };
    if (isEdit) updateMutation.mutate({ materialId: material.id, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? `Edit raw material — ${material.name}` : 'Add raw material'}
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
        <MediaDocumentsPanel owner={{ ownerType: 'raw_material', ownerId: material.id }} onChanged={onSaved} />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <RHFInput<RawMaterialFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFInput<RawMaterialFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
            <RHFInput<RawMaterialFormValues> name="unit" control={control} label="Unit" placeholder="Enter unit" />
          </div>
          <RHFSelect<RawMaterialFormValues>
            name="rm_category_id"
            control={control}
            label="Category"
            placeholder={categoryItems.length ? 'Select category' : 'No categories yet'}
            items={categoryItems}
            enableDeselect
          />
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={saving}>
              {isEdit ? 'Save changes' : 'Add raw material'}
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
