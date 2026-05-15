import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import dayjs, { type Dayjs } from 'dayjs';
import { DatePickerField, type DatePickerProps } from '../date-picker-field';

export interface RHFDatePickerProps<TFieldValues extends FieldValues>
  extends Omit<DatePickerProps, 'value' | 'onChange' | 'hasError' | 'errorMessage' | 'name'> {
  name: Path<TFieldValues>;
  control?: Control<TFieldValues>;
}

export function RHFDatePicker<TFieldValues extends FieldValues>(
  props: RHFDatePickerProps<TFieldValues>,
) {
  const { name, control, ...rest } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePickerField
          {...rest}
          name={name}
          value={field.value ? dayjs(field.value as string | Date) : null}
          onChange={(date: Dayjs | null) => field.onChange(date ? date.toISOString() : '')}
          hasError={Boolean(fieldState.error)}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
