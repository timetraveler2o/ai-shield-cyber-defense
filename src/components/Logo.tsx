
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: number;
}

export function Logo({ className, showText = true, size }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Shield 
          className="text-cyber-primary" 
          width={size || 32} 
          height={size || 32} 
        />
        <div className="absolute inset-0 cyber-glow opacity-50 blur-sm rounded-full" />
      </div>
      {showText && (
        <span className="font-bold text-xl tracking-tight cyber-highlight">
          AI Security Shield
        </span>
      )}
    </div>
  );
}
