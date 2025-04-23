
import { useRef, useEffect, useState } from "react";
import { FaceBox } from "./types";

interface FaceDetectionPreviewProps {
  mediaUrl: string;
  detectedFaces: FaceBox[];
  isVideo?: boolean;
  onVideoLoaded?: (video: HTMLVideoElement) => void;
}

export function FaceDetectionPreview({ 
  mediaUrl, 
  detectedFaces,
  isVideo = false,
  onVideoLoaded
}: FaceDetectionPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle media loaded to set container dimensions
  const handleMediaLoaded = () => {
    if (!mediaRef.current || !containerRef.current) return;
    
    let naturalWidth, naturalHeight;
    
    if (isVideo) {
      const videoElement = mediaRef.current as HTMLVideoElement;
      naturalWidth = videoElement.videoWidth;
      naturalHeight = videoElement.videoHeight;
      
      if (onVideoLoaded) {
        onVideoLoaded(videoElement);
      }
    } else {
      const imageElement = mediaRef.current as HTMLImageElement;
      naturalWidth = imageElement.naturalWidth;
      naturalHeight = imageElement.naturalHeight;
    }
    
    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    
    // Scale to fit container width while maintaining aspect ratio
    const scale = containerWidth / naturalWidth;
    const scaledHeight = naturalHeight * scale;
    
    setDimensions({
      width: containerWidth,
      height: scaledHeight
    });
  };

  // Toggle video playback
  const togglePlayback = () => {
    if (!mediaRef.current || !isVideo) return;
    
    const videoElement = mediaRef.current as HTMLVideoElement;
    
    if (videoElement.paused) {
      videoElement.play();
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  // Draw face boxes on canvas
  useEffect(() => {
    if (!canvasRef.current || !mediaRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scale factor between natural dimensions and displayed dimensions
    let scaleX, scaleY;
    
    if (isVideo) {
      const videoElement = mediaRef.current as HTMLVideoElement;
      scaleX = dimensions.width / videoElement.videoWidth;
      scaleY = dimensions.height / videoElement.videoHeight;
    } else {
      const imageElement = mediaRef.current as HTMLImageElement;
      scaleX = dimensions.width / imageElement.naturalWidth;
      scaleY = dimensions.height / imageElement.naturalHeight;
    }
    
    // Draw boxes for each detected face
    for (const face of detectedFaces) {
      // Scale coordinates to match displayed size
      const x = face.x * scaleX;
      const y = face.y * scaleY;
      const width = face.width * scaleX;
      const height = face.height * scaleY;
      
      // Determine box color based on gender
      let boxColor = '#00ff00'; // default green
      if (face.gender === 'male') {
        boxColor = '#2196F3'; // blue for male
      } else if (face.gender === 'female') {
        boxColor = '#E91E63'; // pink for female
      }
      
      // Draw rectangle with gender-specific color
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Add demographic information
      if (face.gender || face.age) {
        // Create background for text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y + height, width, 20);
        
        // Add gender and age text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        const label = `${face.gender || '?'}, ~${face.age || '?'}`;
        ctx.fillText(label, x + width / 2, y + height + 14);
        
        // Add potential warning text for suspicious expressions
        if (face.expressions) {
          const expressions = face.expressions;
          const angryScore = expressions.angry || 0;
          const fearfulScore = expressions.fearful || 0;
          
          if (angryScore > 0.5 || fearfulScore > 0.5) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
            ctx.fillRect(x, y - 20, width, 20);
            
            ctx.fillStyle = '#ffffff';
            ctx.fillText('⚠️ Suspicious', x + width / 2, y - 7);
          }
        }
      }
    }
  }, [detectedFaces, dimensions, isVideo]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mediaRef.current) {
        handleMediaLoaded();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-hidden border border-cyber-primary/20 rounded-md"
    >
      {isVideo ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={mediaUrl}
          className="w-full"
          style={{ height: dimensions.height > 0 ? `${dimensions.height}px` : 'auto' }}
          controls={false}
          muted
          playsInline
          onLoadedData={handleMediaLoaded}
        />
      ) : (
        <img
          ref={mediaRef as React.RefObject<HTMLImageElement>}
          src={mediaUrl}
          alt="Detection preview"
          className="w-full"
          style={{ height: dimensions.height > 0 ? `${dimensions.height}px` : 'auto' }}
          onLoad={handleMediaLoaded}
        />
      )}
      
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
        width={dimensions.width}
        height={dimensions.height}
      />
      
      {isVideo && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <button
            onClick={togglePlayback}
            className="bg-cyber-primary/80 text-white px-3 py-1 rounded-full text-sm"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      )}
    </div>
  );
}
