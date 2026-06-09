import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { CustomCheckbox } from '../../../common/custom-checkbox';
import { CustomLabel } from '../../../common/custom-label';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionPickerProps<T extends FieldValues> {
  /** RHF field path holding a string[] of permission names. */
  name: Path<T>;
  control: Control<T>;
  label?: string;
  disabled?: boolean;
}

/**
 * Category-grouped checkbox list over the permission catalog, bound to a single
 * RHF field whose value is a string[] of permission names (matches RoleCreate
 * .permissions and the grant/revoke payloads). Custom-component-first per the
 * constitution: every checkbox is the shared `CustomCheckbox`.
 */
export function PermissionPicker<T extends FieldValues>({
  name,
  control,
  label = 'Permissions',
  disabled,
}: PermissionPickerProps<T>) {
  const { groups, isLoading } = usePermissions();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected: string[] = Array.isArray(field.value) ? field.value : [];
        const selectedSet = new Set(selected);

        const toggle = (permission: string, checked: boolean) => {
          if (checked) {
            if (!selectedSet.has(permission)) field.onChange([...selected, permission]);
          } else {
            field.onChange(selected.filter((p) => p !== permission));
          }
        };

        return (
          <div className="flex flex-col gap-2">
            <CustomLabel label={label} />
            {isLoading ? (
              <div className="flex flex-col gap-2" aria-hidden>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : groups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No permissions in the catalog.</p>
            ) : (
              <div className="flex flex-col gap-4 rounded-lg border border-border p-3">
                {groups.map((group) => (
                  <fieldset key={group.category} className="flex flex-col gap-2">
                    <legend className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                      {group.category}
                    </legend>
                    {group.items.map((permission) => (
                      <CustomCheckbox
                        key={permission.name}
                        label={permission.name}
                        supportingText={permission.description || undefined}
                        checked={selectedSet.has(permission.name)}
                        disabled={disabled}
                        onChange={(checked) => toggle(permission.name, checked)}
                      />
                    ))}
                  </fieldset>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
