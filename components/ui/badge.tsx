import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 caption transition-colors focus:outline-none focus:ring-2 focus:ring-ring-focus",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-on-primary",
        secondary:
          "border-transparent bg-surface-bone text-ink",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-ink border-hairline-strong",
        success: "border-transparent bg-badge-success text-on-dark",
        tag: "border-hairline bg-canvas text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
