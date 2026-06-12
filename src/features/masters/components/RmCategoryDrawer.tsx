/**
 * RM category create/edit drawer (feature 027): one zod schema for both
 * modes, plus a "Documents" tab (edit mode only — a record must exist before
 * files can attach to it).
 */
import { useEffect, useState } from 'react';
import { CustomDrawer } from '../../../common/custom-drawer';
import { CustomButton } from '../../../common/custom-buttons';
import { RHFInput, RHFTextarea } from '../../../common/rhf-wrappers';
import { MediaDocumentsPanel } from '../../../common/media-upload';
import { useToast } from '../../../common/common-snackbar';
import { useFormApiErrors } from '../../../hooks/useFormApiErrors';
import { ApiError } from '../../../api/client';
import { cn } from '../../../lib/cn';
import { errorMessage, successMessage } from '../../../utils/api-messages';
import { useAdminCreateRmCategory, useAdminUpdateRmCategory } from '../../../sdk/inventory';
import type { RmCategoryRow } from '../api/rm-categories';
import {
  useRmCategoryForm,
  rmCategoryFormDefaults,
  type RmCategoryFormValues,
} from '../hooks/useCreateRmCategoryForm';

export interface RmCategoryDrawerProps {
  open: boolean;
  /** Row being edited; null/undefined → create mode. */
  category?: RmCategoryRow | null;
  /** Tab to land on when opening in edit mode (e.g. the row's Documents action). */
  initialTab?: 'details' | 'documents';
  onClose: () => void;
  onSaved: () => void;
}

type TabKey = 'details' | 'documents';

export function RmCategoryDrawer({ open, category, initialTab, onClose, onSaved }: RmCategoryDrawerProps) {
  const { toast } = useToast();
  const isEdit = category != null;
  const [tab, setTab] = useState<TabKey>('details');
  const { control, handleSubmit, reset, setError } = useRmCategoryForm(category);
  const { handleApiError } = useFormApiErrors(setError);

  // Pick the landing tab during render when the drawer (re)opens — the
  // React-endorsed alternative to a setState-in-effect cascade.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setTab(category != null && initialTab === 'documents' ? 'documents' : 'details');
  }

  // Re-seed the form when the target row changes (or the drawer re-opens).
  useEffect(() => {
    if (open) reset(rmCategoryFormDefaults(category));
  }, [open, category, reset]);

  const onMutationError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 409) {
      setError('code', { type: 'manual', message: errorMessage(error) });
      return;
    }
    const general = handleApiError(error);
    toast({ severity: 'error', message: general ?? errorMessage(error) });
  };

  const createMutation = useAdminCreateRmCategory({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Category created.') });
        reset(rmCategoryFormDefaults());
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const updateMutation = useAdminUpdateRmCategory({
    mutation: {
      onSuccess: (response) => {
        toast({ severity: 'success', message: successMessage(response, 'Category updated.') });
        onSaved();
        onClose();
      },
      onError: onMutationError,
    },
  });

  const handleClose = () => {
    reset(rmCategoryFormDefaults(category));
    onClose();
  };

  const onSubmit = (data: RmCategoryFormValues) => {
    const payload = { name: data.name, code: data.code, description: data.description || null };
    if (isEdit) updateMutation.mutate({ categoryId: category.id, data: payload });
    else createMutation.mutate({ data: payload });
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <CustomDrawer
      anchor="right"
      title={isEdit ? `Edit RM category — ${category.name}` : 'Add RM category'}
      open={open}
      onClose={handleClose}
      drawerWidth="30rem"
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
        <MediaDocumentsPanel owner={{ ownerType: 'rm_category', ownerId: category.id }} onChanged={onSaved} />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RHFInput<RmCategoryFormValues> name="name" control={control} label="Name" required placeholder="Enter name" />
            <RHFInput<RmCategoryFormValues> name="code" control={control} label="Code" required placeholder="Enter code" />
          </div>
          <RHFTextarea<RmCategoryFormValues>
            name="description"
            control={control}
            label="Description"
            placeholder="Enter description"
            minRow={3}
          />
          <div className="mt-2 flex justify-end gap-3">
            <CustomButton type="button" variant="outline" onClick={handleClose}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="primary" loading={saving}>
              {isEdit ? 'Save changes' : 'Add category'}
            </CustomButton>
          </div>
        </form>
      )}
    </CustomDrawer>
  );
}
