
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "h-16 border-b border-cyber-primary/20 bg-cyber-dark/60 backdrop-blur-sm flex items-center justify-between px-6",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-white hidden md:block">
          Cybercrime Detection & Prevention Center
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-muted h-4 w-4" />
          <Input
            placeholder="Search threats..."
            className="pl-10 w-64 bg-cyber-background/40 border-cyber-primary/20 text-white placeholder:text-cyber-muted"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-cyber-muted" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-cyber-warning text-white">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
              <span className="font-semibold">High Risk Alert</span>
              <span className="text-sm text-muted-foreground">Potential phishing campaign detected targeting government emails</span>
              <span className="text-xs text-muted-foreground mt-1">10 minutes ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
              <span className="font-semibold">UPI Fraud Pattern</span>
              <span className="text-sm text-muted-foreground">Multiple similar transactions detected from known fraud source</span>
              <span className="text-xs text-muted-foreground mt-1">43 minutes ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
              <span className="font-semibold">Social Media Alert</span>
              <span className="text-sm text-muted-foreground">Trending hashtag associated with potential scam detected</span>
              <span className="text-xs text-muted-foreground mt-1">2 hours ago</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="h-8 w-8 rounded-full bg-cyber-primary/20 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
