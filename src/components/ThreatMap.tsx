
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const THREATS = [
  { lat: 40.7128, lng: -74.006, type: "phishing", severity: "high" },
  { lat: 34.0522, lng: -118.2437, type: "ransomware", severity: "critical" },
  { lat: 51.5074, lng: -0.1278, type: "fraud", severity: "medium" },
  { lat: 48.8566, lng: 2.3522, type: "social", severity: "low" },
  { lat: 35.6762, lng: 139.6503, type: "phishing", severity: "high" },
  { lat: 22.3193, lng: 114.1694, type: "voip", severity: "medium" },
  { lat: 19.0760, lng: 72.8777, type: "upi", severity: "high" },
  { lat: 28.6139, lng: 77.2090, type: "sim", severity: "medium" },
  { lat: 39.9042, lng: 116.4074, type: "deepfake", severity: "critical" },
  { lat: -33.8688, lng: 151.2093, type: "fraud", severity: "low" },
  { lat: 55.7558, lng: 37.6173, type: "ransomware", severity: "high" },
  { lat: -22.9068, lng: -43.1729, type: "phishing", severity: "medium" },
];

const severityColors = {
  low: "#0FA0CE",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ea384c",
};

export function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      drawMap();
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    // Draw the world map (simplified)
    function drawMap() {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background
      ctx.fillStyle = "#121621";
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle = "#2a3044";
      ctx.lineWidth = 0.5;
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Vertical grid lines
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw simplified continents (just for visual effect)
      ctx.fillStyle = "#1e2334";
      
      // Draw threat points
      THREATS.forEach((threat) => {
        const x = ((threat.lng + 180) / 360) * width;
        const y = ((90 - threat.lat) / 180) * height;
        
        // Draw pulse effect
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = `${severityColors[threat.severity as keyof typeof severityColors]}22`;
        ctx.fill();
        
        // Draw inner circle
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = severityColors[threat.severity as keyof typeof severityColors];
        ctx.fill();
      });

      // Draw connections between threats
      ctx.strokeStyle = "#8B5CF633";
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < THREATS.length; i++) {
        for (let j = i + 1; j < THREATS.length; j++) {
          if (Math.random() > 0.7) continue; // Only draw some connections
          
          const x1 = ((THREATS[i].lng + 180) / 360) * width;
          const y1 = ((90 - THREATS[i].lat) / 180) * height;
          const x2 = ((THREATS[j].lng + 180) / 360) * width;
          const y2 = ((90 - THREATS[j].lat) / 180) * height;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }

    // Animation loop for pulse effect
    let animationFrame: number;
    const animate = () => {
      drawMap();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <Card className="col-span-full border-cyber-primary/20 bg-cyber-dark">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Global Threat Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full relative">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
          />
          <div className="absolute bottom-3 right-3 bg-black/50 p-2 rounded flex gap-3 text-xs">
            {Object.entries(severityColors).map(([severity, color]) => (
              <div key={severity} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                <span className="capitalize">{severity}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
