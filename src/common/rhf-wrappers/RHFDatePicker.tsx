import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import dayjs, { type Dayjs } from 'dayjs';
import DatePickerField from '../date-picker-field/date-picker-field';

type DatePickerProps = React.ComponentProps<typeof DatePickerField>;

interface RHFDatePickerProps<T extends FieldValues>
  extends Omit<DatePickerProps, 'value' | 'onChange' | 'hasError' | 'errorMessage'> {
  name: Path<T>;
  control: Control<T>;
}

export function RHFDatePicker<T extends FieldValues>({
  name,
  control,
  ...rest
}: RHFDatePickerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePickerField
          {...rest}
          value={field.value ? dayjs(field.value) : null}
          onChange={(date: Dayjs | null) => field.onChange(date ? date.toISOString() : '')}
          hasError={!!fieldState.error}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
