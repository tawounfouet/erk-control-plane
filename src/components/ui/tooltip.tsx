import * as React from "react"
import { cn } from "@/lib/utils"

const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
}

const Tooltip = ({ children, content }: TooltipProps) => {
  const [open, setOpen] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const show = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 100)
  }

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {open && (
        <div
          className={cn(
            "z-50 absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
            "rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
            "whitespace-nowrap pointer-events-none",
          )}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export { Tooltip, TooltipProvider }
