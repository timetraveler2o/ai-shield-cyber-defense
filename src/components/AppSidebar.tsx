
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { 
  ShieldAlert, FileText, Fingerprint, Smartphone, 
  AlertTriangle, Bot, Phone, Binary, Settings, HelpCircle, Info
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      icon: <ShieldAlert className="h-5 w-5" />,
      path: "/",
    },
    {
      name: "Phishing Detection",
      icon: <AlertTriangle className="h-5 w-5" />,
      path: "/phishing",
    },
    {
      name: "Fraud Detection",
      icon: <Binary className="h-5 w-5" />,
      path: "/fraud",
    },
    {
      name: "Deepfake Detection",
      icon: <Fingerprint className="h-5 w-5" />,
      path: "/deepfake-detection",
    },
    {
      name: "Ransomware Simulation",
      icon: <Bot className="h-5 w-5" />,
      path: "/ransomware",
    },
    {
      name: "VoIP Analysis",
      icon: <Phone className="h-5 w-5" />,
      path: "/voip",
    },
    {
      name: "Legal Assistant",
      icon: <FileText className="h-5 w-5" />,
      path: "/legal-assistant",
    },
    {
      name: "Crime Report",
      icon: <Smartphone className="h-5 w-5" />,
      path: "/crime-report",
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/settings",
    },
    {
      name: "Support",
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/support",
    },
    {
      name: "About",
      icon: <Info className="h-5 w-5" />,
      path: "/about",
    },
  ];

  return (
    <div
      className={cn(
        "bg-cyber-dark/60 backdrop-blur-sm border-r border-cyber-primary/20 h-screen",
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300 flex flex-col"
      )}
    >
      <div className={cn("border-b border-cyber-primary/20 h-16 flex items-center px-4 justify-between", collapsed && "justify-center")}>
        <Logo size={collapsed ? 40 : 140} />
        <Button
          variant="ghost"
          size="icon"
          className="text-cyber-muted hover:text-white hover:bg-cyber-primary/20"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
      <div className="flex-1 py-4 overflow-y-auto scrollbar-none">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path} delayDuration={collapsed ? 100 : 1000}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-cyber-primary/10 text-cyber-primary"
                        : "text-cyber-muted hover:bg-cyber-primary/5 hover:text-white",
                      collapsed && "justify-center"
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!collapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{item.name}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-cyber-primary/20">
        <Tooltip delayDuration={collapsed ? 100 : 1000}>
          <TooltipTrigger asChild>
            <Link
              to="/profile"
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors text-cyber-muted hover:bg-cyber-primary/5 hover:text-white",
                collapsed && "justify-center"
              )}
            >
              <div className="h-8 w-8 rounded-full bg-cyber-primary/20 flex items-center justify-center text-white">
                RKS
              </div>
              {!collapsed && (
                <div className="ml-3 text-left">
                  <div className="font-medium">Officer Profile</div>
                  <div className="text-xs text-cyber-muted">View or edit profile</div>
                </div>
              )}
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              <div>Officer Profile</div>
              <div className="text-xs">View or edit profile</div>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
