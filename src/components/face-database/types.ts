
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
  score: number;  // Higher score = more likely to be deepfake
  isDeepfake: boolean;
  confidence: number;  // How confident the system is in its assessment
  analysisTimestamp: string;
  imageUrl: string;
  detectedFaceCount?: number;
  metadata?: {
    generationMethod?: string;
    manipulationScore?: number;
    detectedArtifacts?: string[];
    faceInconsistencies?: number;
    neuralInconsistencies?: number;
    frequencyAnomalies?: boolean;
    textureAnalysisScore?: number;
  };
  faceData?: FaceAnalysisData[];
  legalReferences?: LegalReference[];
}

// Legal reference type for reports
export interface LegalReference {
  law: string;
  section: string;
  description: string;
  applicability: 'high' | 'medium' | 'low';
  penalties?: string;
}

// New interface for enhanced face analysis
export interface FaceAnalysisData {
  faceId: string;
  boundingBox: FaceBox;
  authenticity: {
    score: number;
    confidence: number;
  };
  demographics?: {
    age?: number;
    gender?: string;
    emotions?: Record<string, number>;
  };
  inconsistencies?: {
    eyes: number;
    nose: number;
    mouth: number;
    overall: number;
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

// Legal assistant types
export interface LegalAct {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  year: number;
  relatedCases: string[];
  sections?: LegalSection[];
  isNewAct?: boolean;
}

export interface LegalSection {
  id: string;
  number: string;
  title: string;
  content: string;
  penalties?: string;
  amendments?: {
    date: string;
    description: string;
  }[];
}

// AI response type for legal assistant
export interface AIResponse {
  content: string;
  relevantLaws?: string[];
  confidenceScore?: number;
  sources?: string[];
  status: 'complete' | 'error' | 'loading';
}
