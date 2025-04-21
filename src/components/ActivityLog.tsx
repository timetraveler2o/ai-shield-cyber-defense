
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Mail, MessageSquare, Shield, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "phishing" | "fraud" | "social" | "ransomware" | "deepfake" | "voip" | "upi" | "sim";
  message: string;
  time: string;
  severity: "low" | "medium" | "high" | "critical";
}

const iconMap = {
  phishing: Mail,
  fraud: AlertTriangle,
  social: MessageSquare,
  ransomware: Shield,
  deepfake: Shield,
  voip: Smartphone,
  upi: AlertTriangle,
  sim: Smartphone,
};

const severityColors = {
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20", 
  critical: "bg-cyber-warning/10 text-cyber-warning border-cyber-warning/20",
};

const activityData: ActivityItem[] = [
  {
    id: "1",
    type: "phishing",
    message: "Detected suspicious email targeting multiple government employees",
    time: "2 minutes ago",
    severity: "high",
  },
  {
    id: "2",
    type: "fraud", 
    message: "Unusual pattern of UPI transactions detected from foreign IP",
    time: "15 minutes ago",
    severity: "critical",
  },
  {
    id: "3",
    type: "social",
    message: "Multiple fake accounts created targeting officials identified",
    time: "34 minutes ago", 
    severity: "medium",
  },
  {
    id: "4", 
    type: "voip",
    message: "Spoofed VoIP call patterns detected claiming to be from bank",
    time: "1 hour ago",
    severity: "high", 
  },
  {
    id: "5",
    type: "deepfake",
    message: "AI-generated video with political official detected on social media",
    time: "2 hours ago",
    severity: "critical",
  },
  {
    id: "6",
    type: "sim",
    message: "Potential SIM swap attempt detected in Delhi region",
    time: "3 hours ago", 
    severity: "high",
  },
];

export function ActivityLog() {
  return (
    <Card className="border-cyber-primary/20 bg-cyber-dark">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          {activityData.map((item) => {
            const IconComponent = iconMap[item.type];
            return (
              <div
                key={item.id}
                className="p-3 border rounded-md flex gap-3 items-start bg-cyber-dark/50 border-cyber-primary/20 hover:bg-cyber-primary/5 transition-colors cursor-pointer"
              >
                <div className={cn("p-2 rounded-full", severityColors[item.severity])}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.message}</p>
                  <div className="flex items-center gap-1 mt-1 text-cyber-muted text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
                <div className={cn(
                  "text-xs px-2 py-1 rounded-full capitalize",
                  severityColors[item.severity]
                )}>
                  {item.severity}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
