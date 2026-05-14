import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { CustomCheckbox } from '../custom-checkbox/custom-checkbox';

type CustomCheckboxProps = React.ComponentProps<typeof CustomCheckbox>;

interface RHFCheckboxProps<T extends FieldValues>
  extends Omit<CustomCheckboxProps, 'checked' | 'onChange'> {
  name: Path<T>;
  control: Control<T>;
}

export function RHFCheckbox<T extends FieldValues>({
  name,
  control,
  ...rest
}: RHFCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <CustomCheckbox
          {...rest}
          checked={!!field.value}
          onChange={(checked: boolean) => field.onChange(checked)}
        />
      )}
    />
  );
}
