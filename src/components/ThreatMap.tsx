
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const THREATS = [
  { lat: 30.7333, lng: 76.7794, type: "phishing", severity: "high", location: "Chandigarh" },
  { lat: 28.6139, lng: 77.2090, type: "ransomware", severity: "critical", location: "Delhi" },
  { lat: 19.0760, lng: 72.8777, type: "fraud", severity: "medium", location: "Mumbai" },
  { lat: 12.9716, lng: 77.5946, type: "social", severity: "low", location: "Bangalore" },
  { lat: 22.5726, lng: 88.3639, type: "phishing", severity: "high", location: "Kolkata" },
  { lat: 17.3850, lng: 78.4867, type: "voip", severity: "medium", location: "Hyderabad" },
  { lat: 13.0827, lng: 80.2707, type: "upi", severity: "high", location: "Chennai" },
  { lat: 23.0225, lng: 72.5714, type: "sim", severity: "medium", location: "Ahmedabad" },
  { lat: 26.9124, lng: 75.7873, type: "deepfake", severity: "critical", location: "Jaipur" },
  { lat: 25.5941, lng: 85.1376, type: "fraud", severity: "low", location: "Patna" },
  { lat: 18.5204, lng: 73.8567, type: "ransomware", severity: "high", location: "Pune" },
  { lat: 22.2587, lng: 71.1924, type: "phishing", severity: "medium", location: "Gujarat" },
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

    // Draw India map (simplified)
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

      // Draw simplified India outline (just for visual effect)
      ctx.fillStyle = "#1e2334";
      
      // Draw India's simplified outline
      const indiaPath = new Path2D();
      // This is a very simplified path for India
      const centerLat = 22; // Rough center of India
      const centerLng = 78; // Rough center of India
      const scale = 3.5; // Scale to make India visible
      
      // This is very rough, you'd want a proper GeoJSON for production
      ctx.beginPath();
      ctx.fillStyle = "#1e2334";
      const indiaX = ((centerLng + 180) / 360) * width;
      const indiaY = ((90 - centerLat) / 180) * height;
      ctx.ellipse(indiaX, indiaY, width/6, height/8, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Highlight Chandigarh
      const chandigarhLng = 76.7794;
      const chandigarhLat = 30.7333;
      const chandigarhX = ((chandigarhLng + 180) / 360) * width;
      const chandigarhY = ((90 - chandigarhLat) / 180) * height;
      
      ctx.beginPath();
      ctx.arc(chandigarhX, chandigarhY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#8B5CF6";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();
      
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
        <CardTitle className="text-lg font-semibold">India Threat Map</CardTitle>
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
          <div className="absolute top-3 left-3 bg-black/50 p-2 rounded text-xs">
            <div className="text-white">Chandigarh Police Cybercrime Cell</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
