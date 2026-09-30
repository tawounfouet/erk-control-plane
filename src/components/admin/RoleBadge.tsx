interface RoleBadgeProps {
  isSuperuser: boolean
  isStaff: boolean
  roleDisplay?: string
}

export function RoleBadge({ isSuperuser, isStaff, roleDisplay }: RoleBadgeProps) {
  if (isSuperuser) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-950 dark:text-red-300">
        Superuser
      </span>
    )
  }
  if (isStaff) {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
        {roleDisplay || 'Staff'}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
      Tenant
    </span>
  )
}
