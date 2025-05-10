
import { ActivityLog } from "@/components/ActivityLog";
import { AIStatusPanel } from "@/components/AIStatusPanel";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { StatisticsChart } from "@/components/StatisticsChart";
import { StatusCard } from "@/components/StatusCard";
import { ImprovedThreatMap } from "@/components/ImprovedThreatMap";

const threatStats = [
  { name: "Phishing", value: 342, fill: "#0c5cab" },
  { name: "UPI Fraud", value: 189, fill: "#1a365d" },
  { name: "SIM Swap", value: 87, fill: "#c1272d" },
  { name: "Deepfake", value: 134, fill: "#0074e4" },
  { name: "VoIP Scam", value: 256, fill: "#f97316" },
  { name: "Ransomware", value: 95, fill: "#8E9196" },
];

const regionData = [
  { name: "Delhi", value: 284, fill: "#0c5cab" },
  { name: "Mumbai", value: 321, fill: "#1a365d" },
  { name: "Bangalore", value: 176, fill: "#c1272d" },
  { name: "Kolkata", value: 123, fill: "#0074e4" },
  { name: "Chennai", value: 189, fill: "#f97316" },
  { name: "Hyderabad", value: 215, fill: "#8E9196" },
];

export default function Index() {
  return (
    <div className="flex h-screen bg-cyber-background overflow-hidden fbi-seal-bg">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-background">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatusCard
              title="Total Threats Detected"
              value="1,248"
              trend={12}
              icon="normal"
              variant="normal"
            />
            <StatusCard
              title="High Severity Alerts"
              value="86"
              trend={32}
              icon="danger"
              variant="danger"
            />
            <StatusCard
              title="Threats Mitigated"
              value="926"
              trend={8}
              icon="success"
              variant="success"
            />
            <StatusCard
              title="Active Investigations"
              value="163"
              trend={-4}
              icon="warning"
              variant="warning"
            />
          </div>

          <ImprovedThreatMap />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <StatisticsChart title="Threats by Category" data={threatStats} />
            <StatisticsChart title="Regional Distribution" data={regionData} />
            <AIStatusPanel />
          </div>

          <div className="mt-4">
            <ActivityLog />
          </div>
        </main>
      </div>
    </div>
  );
}
