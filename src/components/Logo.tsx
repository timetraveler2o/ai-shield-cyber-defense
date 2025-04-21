
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Shield className="h-8 w-8 text-cyber-primary" />
        <div className="absolute inset-0 cyber-glow opacity-50 blur-sm rounded-full" />
      </div>
      {showText && (
        <span className="font-bold text-xl tracking-tight cyber-highlight">
          AI Shield
        </span>
      )}
    </div>
  );
}
