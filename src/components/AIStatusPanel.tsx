
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export function AIStatusPanel() {
  const [progress, setProgress] = useState(65);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newValue = prev + (Math.random() * 2 - 1);
        return Math.min(Math.max(newValue, 60), 80); // Keep between 60-80%
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const aiModels = [
    { name: "Email Phishing Detector", status: "active", accuracy: "97.8%" },
    { name: "Transaction Fraud Analyzer", status: "active", accuracy: "99.2%" },
    { name: "Social Media Monitor", status: "active", accuracy: "92.1%" },
    { name: "Deepfake Detection Engine", status: "active", accuracy: "95.6%" }
  ];

  return (
    <Card className="border-cyber-primary/20 bg-cyber-dark">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyber-primary" />
            AI System Status
          </CardTitle>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cyber-muted">System Load</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" indicatorClassName="bg-cyber-accent" />
          </div>
          
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-cyber-primary" />
              <span className="text-sm font-medium">Active AI Models</span>
            </div>
            <div className="space-y-2 mt-1">
              {aiModels.map((model) => (
                <div key={model.name} className="flex items-center justify-between text-sm bg-cyber-primary/5 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full absolute animate-ping opacity-75" />
                    </div>
                    <span>{model.name}</span>
                  </div>
                  <span className="text-xs text-cyber-accent">{model.accuracy}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-cyber-muted pt-2">
            <div className="flex items-center justify-between">
              <span>Last model update</span>
              <span>Today, 08:32 AM</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Training iterations</span>
              <span>1,432,856</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
