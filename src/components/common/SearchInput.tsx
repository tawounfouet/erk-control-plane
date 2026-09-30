import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function SearchInput({ value, onChange, placeholder, label = 'Rechercher' }: SearchInputProps) {
  return (
    <div className="relative">
      <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Rechercher...'}
        className="flex h-11 w-full rounded-lg border border-input bg-background/80 py-2 pl-10 pr-3 text-base shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 sm:text-sm"
      />
    </div>
  )
}
