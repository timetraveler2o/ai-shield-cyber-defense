
import { Link } from "react-router-dom";
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
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface HeaderProps {
  className?: string;
}

// Type for notification
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function Header({ className }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize notifications
  useEffect(() => {
    const initialNotifications = [
      {
        id: 1,
        title: "High Risk Alert",
        message: "Potential phishing campaign detected targeting government emails",
        time: "10 minutes ago",
        read: false
      },
      {
        id: 2,
        title: "UPI Fraud Pattern",
        message: "Multiple similar transactions detected from known fraud source",
        time: "43 minutes ago",
        read: false
      },
      {
        id: 3,
        title: "Social Media Alert",
        message: "Trending hashtag associated with potential scam detected",
        time: "2 hours ago",
        read: false
      }
    ];
    
    setNotifications(initialNotifications);
    
    // Set up periodic notifications
    const notificationInterval = setInterval(() => {
      const newNotificationTypes = [
        {
          title: "Security Alert",
          messages: [
            "Suspicious login attempt detected from IP: 103.54.xx.xx",
            "Potential data breach attempt blocked",
            "Firewall blocked 5 unauthorized access attempts"
          ]
        },
        {
          title: "Case Update",
          messages: [
            "New evidence uploaded for Case #CP-5823",
            "Witness statement added to ongoing investigation",
            "Digital forensics report ready for review"
          ]
        },
        {
          title: "Legal Update",
          messages: [
            "New cybersecurity law amendment published",
            "IT Act Section 66 reference updated in guidelines",
            "Supreme Court ruling on digital evidence admissibility"
          ]
        }
      ];
      
      // Select random notification type and message
      const typeIndex = Math.floor(Math.random() * newNotificationTypes.length);
      const messageIndex = Math.floor(Math.random() * newNotificationTypes[typeIndex].messages.length);
      
      const newNotification = {
        id: Date.now(),
        title: newNotificationTypes[typeIndex].title,
        message: newNotificationTypes[typeIndex].messages[messageIndex],
        time: "Just now",
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show toast for new notification
      toast.info(`New notification: ${newNotification.title}`, {
        description: newNotification.message
      });
      
    }, 60000); // Every minute
    
    return () => clearInterval(notificationInterval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
    }
  };

  return (
    <header
      className={cn(
        "h-16 border-b border-cyber-primary/20 bg-cyber-dark/60 backdrop-blur-sm flex items-center justify-between px-6",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-white hidden md:block">
          Chandigarh Police Cyber Crime Monitoring Center
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-muted h-4 w-4" />
          <Input
            placeholder="Search laws, cases, threats..."
            className="pl-10 w-64 bg-cyber-background/40 border-cyber-primary/20 text-white placeholder:text-cyber-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-cyber-muted" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-cyber-warning text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[70vh] overflow-y-auto">
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-4 px-2 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={cn(
                    "flex flex-col items-start cursor-pointer p-3",
                    !notification.read && "bg-cyber-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <span className="font-semibold">{notification.title}</span>
                  <span className="text-sm text-muted-foreground">{notification.message}</span>
                  <span className="text-xs text-muted-foreground mt-1">{notification.time}</span>
                </DropdownMenuItem>
              ))
            )}
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
            <DropdownMenuItem asChild>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
