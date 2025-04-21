
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const statusVariants = cva("flex items-center gap-2 p-4 rounded-md", {
  variants: {
    variant: {
      default: "bg-cyber-dark text-white",
      normal: "bg-cyber-primary/10 text-white border border-cyber-primary/30",
      warning: "bg-yellow-900/20 text-yellow-200 border border-yellow-600/30",
      danger: "bg-cyber-warning/10 text-cyber-warning border border-cyber-warning/30",
      success: "bg-green-900/20 text-green-200 border border-green-600/30",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconMap = {
  normal: Info,
  warning: AlertTriangle,
  danger: XCircle,
  success: CheckCircle,
  default: Info,
};

export interface StatusCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  title: string;
  value: string;
  trend?: number;
  icon?: keyof typeof iconMap;
}

export function StatusCard({
  className,
  variant,
  title,
  value,
  trend,
  icon = "default",
  ...props
}: StatusCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || iconMap.default;

  return (
    <div
      className={cn(statusVariants({ variant }), "cyber-card", className)}
      {...props}
    >
      <div className="p-3 bg-black/20 rounded-md">
        <IconComponent className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm opacity-80">{title}</h3>
        <div className="flex items-end gap-2">
          <p className="text-xl font-semibold">{value}</p>
          {trend !== undefined && (
            <span
              className={cn(
                "text-xs",
                trend > 0 ? "text-green-400" : "text-cyber-warning"
              )}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
