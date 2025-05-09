export interface Person {
  id: string;
  name: string;
  age: number;
  lastSeen: string;
  dateAdded: string;
  imageUrl: string;
  status?: 'missing' | 'found' | 'investigating';
  faceDescriptor?: number[]; 
  lastDetectedAt?: string;
  lastDetectedLocation?: string;
}

export interface DetectionMatch {
  personId: string;
  matchConfidence: number;
  timestamp: string;
  location: string;
  imageUrl: string;
  faceBox?: FaceBox;
  gender?: string;
  age?: number;
  expressions?: Record<string, number>;
}

export interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
  gender?: string;
  age?: number;
  expressions?: Record<string, number>;
}

// Define chat message interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  }[];
}

export interface VoiceState {
  isRecording: boolean;
  isProcessing: boolean;
  audioBlob?: Blob;
}

// Deepfake detection types
export interface DeepfakeAnalysisResult {
  analysisId?: string;
  score: number;
  isDeepfake: boolean;
  confidence: number;
  analysisTimestamp: string;
  imageUrl: string;
  detectedFaceCount?: number;
  metadata?: {
    generationMethod?: string;
    manipulationScore?: number;
    detectedArtifacts?: string[];
    faceInconsistencies?: number;
  };
}

// Upload error type
export interface UploadState {
  isUploading: boolean;
  progress: number | null;
  error: string | null;
}

// Officer profile type
export interface OfficerProfile {
  name: string;
  badgeId: string;
  department: string;
  location: string;
  email: string;
  phone: string;
  joinedDate: string;
  notificationsEnabled?: boolean;
  isTwoFactorAuthEnabled?: boolean;
}

// Local storage interface
export interface LocalStorageState {
  persons: Person[];
  detectionMatches: DetectionMatch[];
  deepfakeResults: DeepfakeAnalysisResult[];
  lastUpdated: string;
}
