import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin } from "lucide-react";

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
];

const severityColors = {
  low: "#0FA0CE",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ea384c",
};

// More accurate outline of India with optimized coordinates
const INDIA_OUTLINE = [
  [77.8, 35.5], [79.8, 34.3], [81.3, 30.0], [80.2, 28.2], [88.4, 27.5], [97.3, 28.3],
  [97.4, 27.0], [99.1, 25.2], [97.5, 23.0], [94.0, 22.0], [92.0, 21.0], [88.0, 22.2],
  [80.0, 15.0], [76.0, 8.8], [74.0, 8.2], [73.0, 9.5], [72.0, 11.0], [70.0, 20.5],
  [69.0, 22.0], [68.0, 24.0], [67.0, 26.5], [72.0, 33.0], [74.0, 34.0], [77.8, 35.5]
];

export function ImprovedThreatMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedThreat, setSelectedThreat] = useState<any | null>(null);
  const [pulseSize, setPulseSize] = useState<number[]>(THREATS.map(() => Math.random() * 5 + 5));
  const [pulseDirection, setPulseDirection] = useState<boolean[]>(THREATS.map(() => true));
  const animationFrameRef = useRef<number | null>(null);
  const [mapAnimationProgress, setMapAnimationProgress] = useState(0);

  useEffect(() => {
    // Animation for map drawing
    const mapAnimationInterval = setInterval(() => {
      setMapAnimationProgress(prev => {
        if (prev >= 1) {
          clearInterval(mapAnimationInterval);
          return 1;
        }
        return prev + 0.01;
      });
    }, 20);

    return () => {
      clearInterval(mapAnimationInterval);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      drawMap();
    };

    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    // Mouse click handler to show threat details
    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if click is on a threat point
      for (const threat of THREATS) {
        const pointX = ((threat.lng - 68) / 32) * canvas.offsetWidth;
        const pointY = ((37 - threat.lat) / 30) * canvas.offsetHeight;
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

    // Draw map with animated effects
    function drawMap() {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#0d1117");
      gradient.addColorStop(1, "#161b22");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines with better styling
      ctx.strokeStyle = "#2a3044";
      ctx.lineWidth = 0.3;
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Vertical grid lines
      for (let x = 0; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw India outline with animation effect
      if (mapAnimationProgress > 0) {
        const pointsToShow = Math.floor(INDIA_OUTLINE.length * mapAnimationProgress);
        const visibleOutline = INDIA_OUTLINE.slice(0, pointsToShow);
        
        ctx.beginPath();
        for (let i = 0; i < visibleOutline.length; i++) {
          const [lng, lat] = visibleOutline[i];
          const x = ((lng - 68) / 32) * width;
          const y = ((37 - lat) / 30) * height;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Apply gradient fill for India
        const indiaGradient = ctx.createLinearGradient(width/2, 0, width/2, height);
        indiaGradient.addColorStop(0, "rgba(30, 35, 52, 0.9)");
        indiaGradient.addColorStop(1, "rgba(40, 45, 72, 0.9)");
        ctx.fillStyle = indiaGradient;
        ctx.fill();
        
        // Apply border effect
        ctx.strokeStyle = "#3d4356";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Add a glow effect
        ctx.shadowColor = "#8B5CF6";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = "#8B5CF655";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      
      // Draw capital cities with enhanced styling
      const capitalCities = [
        { name: "New Delhi", lng: 77.2090, lat: 28.6139, isCapital: true },
        { name: "Mumbai", lng: 72.8777, lat: 19.0760, isCapital: false },
        { name: "Chandigarh", lng: 76.7794, lat: 30.7333, isCapital: false },
      ];
      
      capitalCities.forEach(city => {
        const x = ((city.lng - 68) / 32) * width;
        const y = ((37 - city.lat) / 30) * height;
        
        if (city.isCapital) {
          // Capital city with special styling
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#8B5CF6";
          ctx.fill();
          
          // Add glow effect
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(139, 92, 246, 0.3)";
          ctx.fill();
          
          // Add city label with shadow
          ctx.font = "bold 12px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.fillText(city.name, x, y - 15);
        } else {
          // Other major cities
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#8B5CF680";
          ctx.fill();
          
          // Add city label
          ctx.font = "10px sans-serif";
          ctx.fillStyle = "#ffffffcc";
          ctx.textAlign = "center";
          ctx.fillText(city.name, x, y - 10);
        }
      });
      
      // Draw threat points with animated pulse effect
      THREATS.forEach((threat, i) => {
        const x = ((threat.lng - 68) / 32) * width;
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
          // Enhanced selection effect
          ctx.beginPath();
          ctx.arc(x, y, 18, 0, Math.PI * 2);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw a modern tooltip
          const tooltipWidth = 200;
          const tooltipHeight = 100;
          const tooltipX = x + 15;
          const tooltipY = y - tooltipHeight / 2;
          
          // Tooltip background with gradient
          const tooltipGradient = ctx.createLinearGradient(tooltipX, tooltipY, tooltipX, tooltipY + tooltipHeight);
          tooltipGradient.addColorStop(0, "rgba(30, 35, 52, 0.95)");
          tooltipGradient.addColorStop(1, "rgba(20, 25, 42, 0.95)");
          ctx.fillStyle = tooltipGradient;
          ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
          
          // Tooltip border
          ctx.strokeStyle = severityColors[threat.severity as keyof typeof severityColors];
          ctx.lineWidth = 2;
          ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
          
          // Tooltip header
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 14px sans-serif";
          ctx.fillText(threat.location, tooltipX + 10, tooltipY + 20);
          
          // Tooltip content
          ctx.font = "12px sans-serif";
          ctx.fillText(`Type: ${threat.type}`, tooltipX + 10, tooltipY + 45);
          ctx.fillText(`IP: ${threat.ip}`, tooltipX + 10, tooltipY + 65);
          ctx.fillText(`Severity: ${threat.severity}`, tooltipX + 10, tooltipY + 85);
        }
      });

      // Draw connections between threats
      ctx.strokeStyle = "#8B5CF633";
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < THREATS.length; i++) {
        for (let j = i + 1; j < THREATS.length; j++) {
          if (Math.random() > 0.7) continue; // Only draw some connections
          
          const x1 = ((THREATS[i].lng - 68) / 32) * width;
          const y1 = ((37 - THREATS[i].lat) / 30) * height;
          const x2 = ((THREATS[j].lng - 68) / 32) * width;
          const y2 = ((37 - THREATS[j].lat) / 30) * height;
          
          // Draw data packets moving along connections
          const packetPosition = (Date.now() % 3000) / 3000; // Cycle every 3 seconds
          const packetX = x1 + (x2 - x1) * packetPosition;
          const packetY = y1 + (y2 - y1) * packetPosition;
          
          // Draw curved connection line
          ctx.beginPath();
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2 - 15;
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(midX, midY, x2, y2);
          ctx.stroke();
          
          // Draw animated packet
          const t = (Date.now() % 3000) / 3000; // Normalized time for path position
          // Calculate position along the quadratic curve
          const curveX = (1-t)*(1-t)*x1 + 2*(1-t)*t*midX + t*t*x2;
          const curveY = (1-t)*(1-t)*y1 + 2*(1-t)*t*midY + t*t*y2;
          
          ctx.beginPath();
          ctx.arc(curveX, curveY, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#8B5CF6";
          ctx.fill();
        }
      }
    }

    // Animation loop
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
  }, [pulseDirection, pulseSize, selectedThreat, mapAnimationProgress]);

  return (
    <Card className="col-span-full border-cyber-primary/20 bg-cyber-dark">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-cyber-primary" />
          India Cyber Threat Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full relative">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full cursor-pointer"
          />
          <div className="absolute bottom-3 right-3 bg-black/70 p-2 rounded-lg shadow-lg flex gap-3 text-xs backdrop-blur-sm">
            {Object.entries(severityColors).map(([severity, color]) => (
              <div key={severity} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                <span className="capitalize">{severity}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-3 left-3 bg-black/70 p-2 rounded-lg shadow-lg text-xs backdrop-blur-sm">
            <div className="text-white font-semibold">Chandigarh Police Cybercrime Cell</div>
            <div className="text-cyber-muted text-[10px] mt-1 flex items-center">
              <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
              Click on threat points for details
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
