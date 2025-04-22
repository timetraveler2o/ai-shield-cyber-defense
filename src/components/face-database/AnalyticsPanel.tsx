
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart4 } from "lucide-react";
import { Person } from "./types";

interface AnalyticsPanelProps {
  people: Person[];
}

export function AnalyticsPanel({ people }: AnalyticsPanelProps) {
  return (
    <Card className="border-cyber-primary/20 bg-cyber-dark">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart4 className="h-5 w-5 text-cyber-primary" />
          Missing Persons Analytics
        </CardTitle>
        <CardDescription>
          Statistics and data analysis of missing individuals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-cyber-background/30 p-4">
            <h3 className="font-medium mb-1">Total Records</h3>
            <p className="text-3xl font-bold">{people.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Missing persons in database
            </p>
          </Card>
          <Card className="bg-cyber-background/30 p-4">
            <h3 className="font-medium mb-1">Location Hotspots</h3>
            <p className="text-3xl font-bold">
              {new Set(people.map((p) => p.lastSeen.split(", ")[0])).size}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Unique primary locations
            </p>
          </Card>
          <Card className="bg-cyber-background/30 p-4">
            <h3 className="font-medium mb-1">Average Age</h3>
            <p className="text-3xl font-bold">
              {people.length > 0
                ? Math.round(
                    people.reduce((sum, p) => sum + p.age, 0) / people.length
                  )
                : 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Of missing individuals
            </p>
          </Card>
        </div>

        <h3 className="font-medium mb-4">Location Distribution</h3>
        <div className="space-y-3">
          {Array.from(
            new Set(people.map((p) => p.lastSeen.split(", ")[0]))
          ).map((location) => {
            const count = people.filter((p) =>
              p.lastSeen.includes(location)
            ).length;
            const percentage = (count / people.length) * 100;
            return (
              <div key={location} className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{location}</span>
                  <span className="text-sm">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-cyber-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyber-primary"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
