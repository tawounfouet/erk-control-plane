import { useState } from 'react'
import { Phone, Mail, Search, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react'
import { useCarnet } from '@/hooks/useContacts'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import type { ContactPublic } from '@/lib/types/contacts.types'

const CATEGORY_LABELS: Record<string, string> = {
  emergency: 'Urgences',
  staff: 'Personnel Eureka',
  services: 'Services',
  administration: 'Administration',
  businesses: 'Entreprises',
  associations: 'Associations',
  individuals: 'Particuliers',
}

const CATEGORY_ORDER: Array<keyof typeof CATEGORY_LABELS> = [
  'emergency', 'staff', 'services', 'administration', 'businesses', 'associations', 'individuals',
]

function ContactCard({ contact }: { contact: ContactPublic }) {
  return (
    <div className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium">{contact.name}</p>
          {contact.organization && (
            <p className="text-xs text-muted-foreground">{contact.organization}</p>
          )}
          {contact.position && (
            <p className="text-xs text-muted-foreground">{contact.position}</p>
          )}
        </div>
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {contact.type_display}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {contact.phone_number && (
          <a href={`tel:${contact.phone_number}`} className="flex items-center gap-1 hover:text-foreground">
            <Phone className="h-3 w-3" />
            {contact.phone_number}
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-foreground">
            <Mail className="h-3 w-3" />
            {contact.email}
          </a>
        )}
      </div>
    </div>
  )
}

export function ContactsPage() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    emergency: true,
    staff: true,
  })

  const { data: carnet, isLoading, error } = useCarnet()

  const toggleSection = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredSections = carnet
    ? CATEGORY_ORDER.map((key) => {
        const contacts = carnet[key as keyof typeof carnet] ?? []
        const filtered = search
          ? contacts.filter(
              (c) =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.organization.toLowerCase().includes(search.toLowerCase()) ||
                c.phone_number.includes(search)
            )
          : contacts
        return { key, label: CATEGORY_LABELS[key], contacts: filtered, total: contacts.length }
      })
    : []

  return (
    <div>
      <PageHeader
        title="Contacts"
        description="Annuaire des résidences Eureka"
      />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-xs outline-none focus:border-foreground"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Erreur lors du chargement des contacts
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSections.map(({ key, label, contacts, total }) => (
            <div key={key} className="rounded-lg border bg-card">
              <button
                onClick={() => toggleSection(key)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-accent/50"
              >
                <div className="flex items-center gap-2">
                  {key === 'emergency' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  {expanded[key] ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">{label}</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                    {total}
                  </span>
                </div>
              </button>

              {expanded[key] && (
                <div className="space-y-2 px-4 pb-4">
                  {contacts.length === 0 ? (
                    <p className="py-2 text-xs text-muted-foreground">
                      {search ? 'Aucun résultat' : 'Aucun contact'}
                    </p>
                  ) : (
                    contacts.map((contact) => (
                      <ContactCard key={contact.id} contact={contact} />
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
