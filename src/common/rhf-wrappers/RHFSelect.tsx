import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { type SelectChangeEvent } from '@mui/material';
import CustomSelect from '../custom-select/custom-select';

type CustomSelectProps = React.ComponentProps<typeof CustomSelect>;

interface RHFSelectProps<T extends FieldValues>
  extends Omit<CustomSelectProps, 'value' | 'onChange' | 'hasError' | 'errorMessage' | 'name'> {
  name: Path<T>;
  control: Control<T>;
}

export function RHFSelect<T extends FieldValues>({
  name,
  control,
  ...rest
}: RHFSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <CustomSelect
          {...rest}
          name={name}
          value={field.value ?? ''}
          onChange={(e: SelectChangeEvent<string>) => field.onChange(e.target.value)}
          hasError={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
