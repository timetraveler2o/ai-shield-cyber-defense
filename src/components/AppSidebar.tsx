
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  AlertTriangle,
  Mail,
  Database,
  Users,
  MessageSquare,
  FileSearch,
  Smartphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Logo } from "./Logo";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Phishing Detection",
    icon: Mail,
    path: "/phishing",
  },
  {
    title: "Fraud Detection",
    icon: AlertTriangle,
    path: "/fraud",
  },
  {
    title: "Social Monitoring",
    icon: MessageSquare,
    path: "/social",
  },
  {
    title: "Ransomware Simulation",
    icon: FileSearch,
    path: "/ransomware",
  },
  {
    title: "Deepfake Detection",
    icon: Users,
    path: "/deepfake",
  },
  {
    title: "VoIP Analysis",
    icon: Smartphone,
    path: "/voip",
  },
  {
    title: "UPI Monitoring",
    icon: Database,
    path: "/upi",
  },
  {
    title: "SIM Fraud Detection",
    icon: ShieldCheck,
    path: "/sim-fraud",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div
      className={cn(
        "h-screen bg-cyber-dark border-r border-cyber-primary/20 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 border-b border-cyber-primary/20 flex items-center justify-between">
        <Logo showText={!collapsed} className={cn(collapsed && "justify-center")} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-cyber-muted hover:text-white hover:bg-cyber-primary/10"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-3 text-sm rounded-md transition-colors",
                currentPath === item.path
                  ? "bg-cyber-primary/20 text-white"
                  : "text-cyber-muted hover:bg-cyber-primary/10 hover:text-white",
                collapsed && "justify-center"
              )}
            >
              <item.icon
                className={cn(
                  "flex-shrink-0",
                  collapsed ? "h-6 w-6" : "h-5 w-5 mr-3"
                )}
              />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-cyber-primary/20">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <div className="w-2 h-2 bg-green-500 rounded-full relative">
            <div className="w-2 h-2 bg-green-500 rounded-full absolute animate-ping" />
          </div>
          {!collapsed && <span className="text-xs text-cyber-muted">System Online</span>}
        </div>
      </div>
    </div>
  );
}
