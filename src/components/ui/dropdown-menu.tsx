import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext<{
  open: boolean
  setOpen: (v: boolean) => void
}>({ open: false, setOpen: () => {} })

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext)
  return (
    <div ref={ref} onClick={() => setOpen(true)} {...props}>
      {children}
    </div>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = ({
  children,
  className,
  align = "start",
}: {
  children: React.ReactNode
  className?: string
  align?: "start" | "end"
}) => {
  const { open, setOpen } = React.useContext(DropdownMenuContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md absolute top-full mt-1",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) => {
  const { setOpen } = React.useContext(DropdownMenuContext)
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      onClick={() => {
        onClick?.()
        setOpen(false)
      }}
    >
      {children}
    </div>
  )
}

const DropdownMenuSeparator = () => (
  <div className="-mx-1 my-1 h-px bg-border" />
)

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
