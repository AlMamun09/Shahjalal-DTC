import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-orange-500 text-white hover:bg-orange-400",
        secondary: "border border-white/[0.08] bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]",
        outline: "border border-white/[0.12] text-gray-300",
        muted: "bg-white/[0.06] text-gray-400 hover:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }