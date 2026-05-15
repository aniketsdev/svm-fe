import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { cn } from '../../lib/cn';

export interface AutocompleteOption {
  key: string;
  value: string;
  /** Optional fully-custom rendering for this item. */
  child?: ReactElement;
}

export interface CustomAutoCompleteProps {
  options: AutocompleteOption[];
  /** Selected key. */
  value?: string;
  loading?: boolean;
  loadingText?: string;
  onChange: (selectedKey: string) => void;
  onClick?: () => void;
  /** Called (debounced) with the current input value. */
  onDebounceCall?: (selectedValue: string) => void;
  /** Called when the user clears the input. */
  onInputEmpty?: () => void;
  width?: string;
  height?: string;
  hasError?: boolean;
  errorMessage?: string;
  placeholder?: string;
  isDisabled?: boolean;
  bgWhite?: boolean;
  hasStartSearchIcon?: boolean;
  /** Render the input value as empty even when an option is selected. */
  hideTextPreview?: boolean;
  /** Hide the dropdown caret. */
  hideArrow?: boolean;
  /** Debounce in ms before `onDebounceCall` fires. */
  debounceMs?: number;
  className?: string;
}

const CustomAutoComplete = ({
  options,
  value,
  loading,
  loadingText = 'Loading…',
  onChange,
  onClick,
  onDebounceCall,
  onInputEmpty,
  width,
  height,
  hasError,
  errorMessage,
  placeholder,
  isDisabled,
  bgWhite,
  hasStartSearchIcon,
  hideTextPreview,
  hideArrow,
  debounceMs = 1000,
  className,
}: CustomAutoCompleteProps) => {
  const selected = options.find((opt) => opt.key === value);
  const [input, setInput] = useState(selected?.value ?? '');
  const [open, setOpen] = useState(false);

  // Keep input in sync when the parent changes `value` from the outside.
  // React's official "store information from previous renders" pattern:
  // compare a snapshot-state against the latest prop, and trigger a re-derive
  // when they diverge. https://react.dev/reference/react/useState#storing-information-from-previous-renders
  const [lastValue, setLastValue] = useState(value);
  if (lastValue !== value) {
    setLastValue(value);
    const next = options.find((o) => o.key === value)?.value ?? '';
    if (next !== input) setInput(next);
  }

  // Debounced callback.
  useEffect(() => {
    if (!onDebounceCall) return;
    const t = setTimeout(() => {
      if (input && (input.length > 3 || input === '')) onDebounceCall(input);
    }, debounceMs);
    return () => clearTimeout(t);
  }, [input, onDebounceCall, debounceMs]);

  // Memoized filter result — must be unconditional (rules-of-hooks).
  const filteredOptions = useMemo(() => {
    const q = input.toLowerCase();
    return options.filter((o) => o.value.toLowerCase().includes(q));
  }, [options, input]);

  return (
    <div
      className={cn('flex w-full flex-col', className)}
      style={width ? { width } : undefined}
    >
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Anchor asChild>
          <div
            onClick={onClick}
            style={height ? { height } : undefined}
            className={cn(
              'flex h-11 w-full items-center gap-2 rounded-md border px-3',
              'border-input',
              'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40',
              bgWhite ? 'bg-white' : 'bg-background',
              hasError && 'border-destructive focus-within:border-destructive focus-within:ring-destructive/30',
              isDisabled && 'cursor-not-allowed opacity-60',
            )}
          >
            {hasStartSearchIcon && (
              <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
            )}
            <input
              type="text"
              placeholder={placeholder}
              value={hideTextPreview ? '' : input}
              disabled={isDisabled}
              onFocus={() => setOpen(true)}
              onChange={(e) => {
                setInput(e.target.value);
                setOpen(true);
                if (e.target.value === '') onInputEmpty?.();
              }}
              className="block w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed"
            />
            {loading && <Loader2 aria-hidden className="size-4 shrink-0 animate-spin text-muted-foreground" />}
            {!hideArrow && !loading && (
              <span className="text-muted-foreground">▾</span>
            )}
          </div>
        </PopoverPrimitive.Anchor>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            sideOffset={4}
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-md border border-border bg-background shadow-lg"
          >
            <CommandPrimitive shouldFilter={false}>
              <CommandPrimitive.List className="max-h-60 overflow-y-auto p-1">
                {loading ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                    {loadingText}
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
                ) : (
                  filteredOptions.map((opt) => (
                    <CommandPrimitive.Item
                      key={opt.key}
                      value={opt.value}
                      onSelect={() => {
                        onChange(opt.key);
                        setInput(opt.value);
                        setOpen(false);
                      }}
                      className="cursor-pointer rounded px-3 py-1.5 text-sm data-[selected=true]:bg-secondary data-[selected=true]:outline-none"
                    >
                      {opt.child ?? opt.value}
                    </CommandPrimitive.Item>
                  ))
                )}
              </CommandPrimitive.List>
            </CommandPrimitive>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {hasError && errorMessage && (
        <p role="alert" className="mt-1 text-xs leading-tight text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default CustomAutoComplete;
export { CustomAutoComplete };
