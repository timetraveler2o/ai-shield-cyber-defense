
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const THREATS = [
  { lat: 30.7333, lng: 76.7794, type: "phishing", severity: "high", location: "Chandigarh", ip: "103.27.8.45" },
  { lat: 28.6139, lng: 77.2090, type: "ransomware", severity: "critical", location: "Delhi", ip: "117.248.109.86" },
  { lat: 19.0760, lng: 72.8777, type: "fraud", severity: "medium", location: "Mumbai", ip: "182.76.175.34" },
  { lat: 12.9716, lng: 77.5946, type: "social", severity: "low", location: "Bangalore", ip: "43.225.54.129" },
  { lat: 22.5726, lng: 88.3639, type: "phishing", severity: "high", location: "Kolkata", ip: "117.222.180.15" },
  { lat: 17.3850, lng: 78.4867, type: "voip", severity: "medium", location: "Hyderabad", ip: "103.175.242.54" },
  { lat: 13.0827, lng: 80.2707, type: "upi", severity: "high", location: "Chennai", ip: "183.82.156.229" },
  { lat: 23.0225, lng: 72.5714, type: "sim", severity: "medium", location: "Ahmedabad", ip: "45.118.187.92" },
  { lat: 26.9124, lng: 75.7873, type: "deepfake", severity: "critical", location: "Jaipur", ip: "223.196.172.40" },
  { lat: 25.5941, lng: 85.1376, type: "fraud", severity: "low", location: "Patna", ip: "122.176.34.193" },
  { lat: 18.5204, lng: 73.8567, type: "ransomware", severity: "high", location: "Pune", ip: "103.251.58.36" },
  { lat: 22.2587, lng: 71.1924, type: "phishing", severity: "medium", location: "Gujarat", ip: "182.73.143.186" },
  { lat: 20.2961, lng: 85.8245, type: "voip", severity: "high", location: "Bhubaneswar", ip: "103.76.212.34" },
  { lat: 26.8467, lng: 80.9462, type: "sim", severity: "medium", location: "Lucknow", ip: "122.161.178.93" },
  { lat: 17.6868, lng: 83.2185, type: "fraud", severity: "high", location: "Visakhapatnam", ip: "43.230.88.125" },
  { lat: 11.0168, lng: 76.9558, type: "deepfake", severity: "critical", location: "Coimbatore", ip: "117.221.225.78" },
  { lat: 31.6340, lng: 74.8723, type: "ransomware", severity: "medium", location: "Amritsar", ip: "182.78.150.76" },
  { lat: 30.9010, lng: 75.8573, type: "phishing", severity: "high", location: "Ludhiana", ip: "103.104.154.87" },
];

const severityColors = {
  low: "#0FA0CE",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ea384c",
};

// India map coordinates (approximate) for a more accurate outline
const INDIA_OUTLINE = [
  [77.8, 35.5], [79.8, 34.3], [81.3, 30.0], [80.2, 28.2], [88.4, 27.5], [97.3, 28.3],
  [97.4, 27.0], [99.1, 25.2], [97.5, 23.0], [94.0, 22.0], [92.0, 21.0], [88.0, 22.2],
  [80.0, 15.0], [76.0, 8.8], [74.0, 8.2], [73.0, 9.5], [72.0, 11.0], [70.0, 20.5],
  [69.0, 22.0], [68.0, 24.0], [67.0, 26.5], [72.0, 33.0], [74.0, 34.0], [77.8, 35.5]
];

export function ThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedThreat, setSelectedThreat] = useState<any | null>(null);
  const [pulseSize, setPulseSize] = useState<number[]>(THREATS.map(() => Math.random() * 5 + 5));
  const [pulseDirection, setPulseDirection] = useState<boolean[]>(THREATS.map(() => true));
  const animationFrameRef = useRef<number | null>(null);

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

    // Mouse click handler to show threat details
    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Check if click is on a threat point
      for (const threat of THREATS) {
        const pointX = ((threat.lng + 80) / 25) * width;
        const pointY = ((37 - threat.lat) / 30) * height;
        const distance = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
        
        if (distance < 15) {
          setSelectedThreat(threat);
          return;
        }
      }
      
      // If clicking outside, clear selection
      setSelectedThreat(null);
    };
    
    canvas.addEventListener("click", handleMouseClick);

    // Animation for pulse effect
    const updatePulseSize = () => {
      setPulseSize(prevSize => 
        prevSize.map((size, i) => {
          if (pulseDirection[i]) {
            if (size >= 15) {
              const newDirections = [...pulseDirection];
              newDirections[i] = false;
              setPulseDirection(newDirections);
              return 15;
            }
            return size + 0.2;
          } else {
            if (size <= 5) {
              const newDirections = [...pulseDirection];
              newDirections[i] = true;
              setPulseDirection(newDirections);
              return 5;
            }
            return size - 0.2;
          }
        })
      );
    };

    // Draw India map (more accurate)
    function drawMap() {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

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

      // Draw India outline more accurately
      ctx.beginPath();
      for (let i = 0; i < INDIA_OUTLINE.length; i++) {
        const [lng, lat] = INDIA_OUTLINE[i];
        const x = ((lng + 80) / 25) * width;
        const y = ((37 - lat) / 30) * height;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = "#1e2334";
      ctx.fill();
      ctx.strokeStyle = "#3d4356";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Highlight Chandigarh
      const chandigarhLng = 76.7794;
      const chandigarhLat = 30.7333;
      const chandigarhX = ((chandigarhLng + 80) / 25) * width;
      const chandigarhY = ((37 - chandigarhLat) / 30) * height;
      
      ctx.beginPath();
      ctx.arc(chandigarhX, chandigarhY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#8B5CF6";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Add a glowing effect to Chandigarh
      ctx.beginPath();
      ctx.arc(chandigarhX, chandigarhY, 12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(139, 92, 246, 0.3)";
      ctx.fill();
      
      // Draw threat points with animated pulse
      THREATS.forEach((threat, i) => {
        const x = ((threat.lng + 80) / 25) * width;
        const y = ((37 - threat.lat) / 30) * height;
        
        // Draw pulse effect with dynamic size
        ctx.beginPath();
        ctx.arc(x, y, pulseSize[i], 0, Math.PI * 2);
        ctx.fillStyle = `${severityColors[threat.severity as keyof typeof severityColors]}22`;
        ctx.fill();
        
        // Draw inner circle
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = severityColors[threat.severity as keyof typeof severityColors];
        ctx.fill();

        // If this is the selected threat, highlight it
        if (selectedThreat && selectedThreat.location === threat.location) {
          ctx.beginPath();
          ctx.arc(x, y, 18, 0, Math.PI * 2);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw a tooltip
          const tooltipWidth = 150;
          const tooltipHeight = 70;
          const tooltipX = x + 15;
          const tooltipY = y - tooltipHeight / 2;
          
          // Background
          ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
          ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
          ctx.strokeStyle = severityColors[threat.severity as keyof typeof severityColors];
          ctx.lineWidth = 2;
          ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
          
          // Text
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 12px sans-serif";
          ctx.fillText(threat.location, tooltipX + 10, tooltipY + 20);
          ctx.font = "11px sans-serif";
          ctx.fillText(`Type: ${threat.type}`, tooltipX + 10, tooltipY + 40);
          ctx.fillText(`IP: ${threat.ip}`, tooltipX + 10, tooltipY + 60);
        }
      });

      // Draw connections between threats
      ctx.strokeStyle = "#8B5CF633";
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < THREATS.length; i++) {
        for (let j = i + 1; j < THREATS.length; j++) {
          if (Math.random() > 0.7) continue; // Only draw some connections
          
          const x1 = ((THREATS[i].lng + 80) / 25) * width;
          const y1 = ((37 - THREATS[i].lat) / 30) * height;
          const x2 = ((THREATS[j].lng + 80) / 25) * width;
          const y2 = ((37 - THREATS[j].lat) / 30) * height;
          
          // Draw animated data packets moving along connections
          const packetPosition = (Date.now() % 3000) / 3000; // Cycle every 3 seconds
          const packetX = x1 + (x2 - x1) * packetPosition;
          const packetY = y1 + (y2 - y1) * packetPosition;
          
          // Draw the connection line
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          
          // Draw the moving packet
          ctx.beginPath();
          ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#8B5CF6";
          ctx.fill();
        }
      }

      // Add city labels for major cities
      ctx.font = "10px sans-serif";
      ctx.fillStyle = "#ffffff";
      
      const majorCities = THREATS.filter(t => ["Delhi", "Mumbai", "Chennai", "Kolkata", "Chandigarh"].includes(t.location));
      majorCities.forEach(city => {
        const x = ((city.lng + 80) / 25) * width;
        const y = ((37 - city.lat) / 30) * height;
        ctx.fillText(city.location, x + 8, y - 8);
      });
    }

    // Animation loop for pulse effect and data packet movement
    const animate = () => {
      updatePulseSize();
      drawMap();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      canvas.removeEventListener("click", handleMouseClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pulseDirection, pulseSize, selectedThreat]);

  return (
    <Card className="col-span-full border-cyber-primary/20 bg-cyber-dark">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">India Threat Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full relative">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full cursor-pointer"
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
            <div className="text-cyber-muted text-[10px] mt-1">Click on threat points for details</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
