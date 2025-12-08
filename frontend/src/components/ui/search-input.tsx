import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  className = "w-1/2 mb-4",
  ariaLabel = "Search Input",
}: SearchInputProps) {
  return (
    <Input
      aria-label={ariaLabel}
      type="text"
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}