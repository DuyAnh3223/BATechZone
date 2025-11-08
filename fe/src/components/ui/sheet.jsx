import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Sheet({ open, onOpenChange, children, ...props }) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={() => onOpenChange?.(false)}
      {...props}
    >
      {children}
    </div>
  )
}

function SheetOverlay({ className, ...props }) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 z-40 transition-opacity",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({ 
  side = "right", 
  className, 
  children,
  onClose,
  ...props 
}) {
  return (
    <>
      <SheetOverlay />
      <div
        className={cn(
          "fixed z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out",
          side === "right" && "right-0 top-0 h-full w-full max-w-lg",
          side === "left" && "left-0 top-0 h-full w-full max-w-lg",
          side === "top" && "top-0 left-0 w-full max-h-[80vh]",
          side === "bottom" && "bottom-0 left-0 w-full max-h-[80vh]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </>
  )
}

function SheetHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-2 p-6 border-b", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  )
}

function SheetBody({ className, ...props }) {
  return (
    <div
      className={cn("p-6 overflow-y-auto", className)}
      style={{ maxHeight: 'calc(100vh - 200px)' }}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center p-6 border-t bg-gray-50", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
}

