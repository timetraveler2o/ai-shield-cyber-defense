
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
