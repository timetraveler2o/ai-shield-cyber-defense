
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: number;
}

export function Logo({ className, showText = true, size }: LogoProps) {
  const logoSize = size || 32;
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <img 
          src="/lovable-uploads/acde5342-ae27-44d7-a0be-056e23898187.png" 
          alt="CyberSuraksha Kavach Logo" 
          width={logoSize} 
          height={logoSize}
          className="object-contain"
        />
        <div className="absolute inset-0 cyber-glow opacity-50 blur-sm rounded-full" />
      </div>
      {showText && (
        <span className="font-bold text-xl tracking-tight cyber-highlight">
          CyberSuraksha Kavach
        </span>
      )}
    </div>
  );
}
