import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-full border border-hairline bg-surface-card px-5 py-2 body-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ash outline-none focus-visible:ring-2 focus-visible:ring-ring-focus focus-visible:border-hairline-strong disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
