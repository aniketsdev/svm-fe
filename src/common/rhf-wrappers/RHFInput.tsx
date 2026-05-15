import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { CustomInput, type CustomInputProps } from '../custom-input';
import { CustomLabel } from '../custom-label';

export interface RHFInputProps<TFieldValues extends FieldValues>
  extends Omit<
    CustomInputProps,
    'value' | 'onChange' | 'hasError' | 'errorMessage' | 'name'
  > {
  name: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  /** Optional label rendered above the input via `CustomLabel`. */
  label?: React.ReactNode;
}

export function RHFInput<TFieldValues extends FieldValues>(
  props: RHFInputProps<TFieldValues>,
) {
  const { name, control, label, required, ...rest } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col">
          {label && <CustomLabel label={label} htmlFor={name} isRequired={required} />}
          <CustomInput
            {...rest}
            required={required}
            name={field.name}
            id={name}
            value={(field.value as string | number | undefined) ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
            hasError={Boolean(fieldState.error)}
            errorMessage={fieldState.error?.message}
          />
        </div>
      )}
    />
  );
}
