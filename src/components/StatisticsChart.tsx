
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip } from "recharts";

interface StatisticsChartProps {
  title: string;
  data: Array<{ name: string; value: number; fill?: string }>;
  dataKey?: string;
}

export function StatisticsChart({ title, data, dataKey = "value" }: StatisticsChartProps) {
  return (
    <Card className="border-cyber-primary/20 bg-cyber-dark">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="#8E9196"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#8E9196"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1F2C",
                  borderColor: "#8B5CF6",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
                cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
              />
              <Bar
                dataKey={dataKey}
                fill={({ fill }) => fill || "#8B5CF6"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
