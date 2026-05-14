import { type ChangeEvent } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import CustomInput from '../custom-input/custom-input';

type CustomInputProps = React.ComponentProps<typeof CustomInput>;

interface RHFInputProps<T extends FieldValues>
  extends Omit<CustomInputProps, 'value' | 'onChange' | 'hasError' | 'errorMessage' | 'name'> {
  name: Path<T>;
  control: Control<T>;
}

export function RHFInput<T extends FieldValues>({
  name,
  control,
  ...rest
}: RHFInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <CustomInput
          {...rest}
          name={name}
          value={field.value ?? ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
          hasError={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
