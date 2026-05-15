import { useEffect, useState, type ChangeEvent } from 'react';
import { CustomInput } from '../custom-input';
import { cn } from '../../lib/cn';

export interface SearchFilterProps {
  textData: {
    placeholder: string;
    /** Reserved for legacy compatibility. The migrated component does not render a separate search button. */
    btnTitle: string;
  };
  /** Fires (debounced) with the current input value. */
  onSearch?: (value: string) => void;
  /** Wrapper width passthrough (Tailwind-friendly e.g. `"24rem"` or `"100%"`). */
  width?: string;
  /** Render a search icon on the left. */
  hasStartSearchIcon?: boolean;
  /** Move the search icon to the right side. */
  startSearchIconOnRight?: boolean;
  /** Debounce in ms before `onSearch` fires. */
  debounceMs?: number;
  /** Allow callers to clear the field; defaults to true. */
  clearable?: boolean;
  className?: string;
}

const SearchFilter = ({
  textData,
  onSearch,
  width,
  hasStartSearchIcon,
  startSearchIconOnRight,
  debounceMs = 300,
  className,
}: SearchFilterProps) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!onSearch) return;
    const t = setTimeout(() => onSearch(inputValue), debounceMs);
    return () => clearTimeout(t);
  }, [inputValue, onSearch, debounceMs]);

  return (
    <div className={cn('flex items-center', className)} style={width ? { width } : undefined}>
      <CustomInput
        name="search"
        placeholder={textData.placeholder}
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        bgWhite
        hasStartSearchIcon={hasStartSearchIcon}
        startSearchIconOnRight={startSearchIconOnRight}
        className={width ? undefined : 'w-52'}
      />
    </div>
  );
};

export default SearchFilter;
export { SearchFilter as CustomSearch };
