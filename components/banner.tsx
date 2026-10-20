import { AlertTriangle, CheckCircleIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


const bannerVariants = cva(
    "rounded-xl border px-4 py-3 text-sm font-medium flex items-center w-full shadow-sm",
    {
        variants: {
            variant: {
                warning: "bg-amber-50 border-amber-200 text-amber-900",
                success: "bg-emerald-50 border-emerald-200 text-emerald-900"
            }
        },
        defaultVariants: {
            variant: "warning",
        }
    }
)

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string
}

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon
}


export const Banner = ({
    label,
    variant,
}: BannerProps) => {
    const Icon = iconMap[variant || "warning"]
    return (
        <div className={cn(bannerVariants({ variant }))}>
            <Icon className="h-4 w-4 mr-2" />
            {label}
        </div>
    )
}
