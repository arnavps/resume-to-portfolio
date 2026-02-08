import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                primary: "border-transparent bg-indigo-100 text-indigo-700",
                secondary: "border-transparent bg-emerald-100 text-emerald-700",
                accent: "border-transparent bg-amber-100 text-amber-700",
                success: "border-transparent bg-emerald-100 text-emerald-700",
                warning: "border-transparent bg-amber-100 text-amber-700",
                error: "border-transparent bg-red-100 text-red-700",
                neutral: "border-transparent bg-slate-100 text-slate-700",
                outline: "text-foreground border-slate-300",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    icon?: React.ReactNode
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props}>
            {icon && <span className="inline-flex">{icon}</span>}
            {children}
        </div>
    )
}

export { Badge, badgeVariants }
