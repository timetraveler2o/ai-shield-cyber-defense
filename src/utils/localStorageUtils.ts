
import { Person, DetectionMatch, DeepfakeAnalysisResult, OfficerProfile } from "@/components/face-database/types";

// Add officer profile to local storage state
export interface LocalStorageState {
  persons: Person[];
  detectionMatches: DetectionMatch[];
  deepfakeResults: DeepfakeAnalysisResult[];
  lastUpdated: string;
  officerProfile?: OfficerProfile;
}

// Initialize local storage with empty collections
export const initLocalStorage = () => {
  const existingData = localStorage.getItem('cybercrimeMonitoring');
  if (!existingData) {
    const initialState: LocalStorageState = {
      persons: [],
      detectionMatches: [],
      deepfakeResults: [],
      lastUpdated: new Date().toISOString(),
      officerProfile: {
        name: "Officer",
        badgeId: "CP2345",
        department: "Digital Forensics",
        location: "Chandigarh HQ",
        email: "officer@cybercell.gov.in",
        phone: "+91 987X XXX345",
        joinedDate: "August 2023"
      }
    };
    localStorage.setItem('cybercrimeMonitoring', JSON.stringify(initialState));
  }
};

// Get the officer profile from local storage
export const getOfficerProfile = (): OfficerProfile => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    if (parsedData.officerProfile) {
      return parsedData.officerProfile;
    }
  }
  
  // Default profile if not found
  return {
    name: "Officer",
    badgeId: "CP2345",
    department: "Digital Forensics",
    location: "Chandigarh HQ",
    email: "officer@cybercell.gov.in",
    phone: "+91 987X XXX345",
    joinedDate: "August 2023"
  };
};

// Save the officer profile to local storage
export const saveOfficerProfile = (profile: OfficerProfile) => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    parsedData.officerProfile = profile;
    parsedData.lastUpdated = new Date().toISOString();
    localStorage.setItem('cybercrimeMonitoring', JSON.stringify(parsedData));
  }
};

// Get all persons from local storage
export const getPersons = (): Person[] => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    return parsedData.persons || [];
  }
  return [];
};

// Save a new person to local storage
export const savePerson = (person: Person) => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    parsedData.persons = [...(parsedData.persons || []), person];
    parsedData.lastUpdated = new Date().toISOString();
    localStorage.setItem('cybercrimeMonitoring', JSON.stringify(parsedData));
  } else {
    // If no existing data, initialize local storage
    const initialState: LocalStorageState = {
      persons: [person],
      detectionMatches: [],
      deepfakeResults: [],
      lastUpdated: new Date().toISOString(),
      officerProfile: {
        name: "Officer",
        badgeId: "CP2345",
        department: "Digital Forensics",
        location: "Chandigarh HQ",
        email: "officer@cybercell.gov.in",
        phone: "+91 987X XXX345",
        joinedDate: "August 2023"
      }
    };
    localStorage.setItem('cybercrimeMonitoring', JSON.stringify(initialState));
  }
};

// Update an existing person in local storage
export const updatePerson = (updatedPerson: Person) => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    parsedData.persons = parsedData.persons?.map(person =>
      person.id === updatedPerson.id ? updatedPerson : person
    ) || [updatedPerson];
    parsedData.lastUpdated = new Date().toISOString();
    localStorage.setItem('cybercrimeMonitoring', JSON.stringify(parsedData));
  }
};

// Delete a person from local storage
export const deletePerson = (personId: string) => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    parsedData.persons = parsedData.persons?.filter(person => person.id !== personId) || [];
    parsedData.lastUpdated = new Date().toISOString();
    localStorage.setItem('cybercrimeMonitoring', JSON.stringify(parsedData));
  }
};

// Get all detection matches from local storage
export const getDetectionMatches = (): DetectionMatch[] => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    return parsedData.detectionMatches || [];
  }
  return [];
};

// Save a new detection match to local storage
export const saveDetectionMatch = (match: DetectionMatch) => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    parsedData.detectionMatches = [...(parsedData.detectionMatches || []), match];
    parsedData.lastUpdated = new Date().toISOString();
    localStorage.setItem('cybercrimeMonitoring', JSON.stringify(parsedData));
  }
};

// Save a detection match to local storage (alias function to maintain compatibility)
export const saveDetectionMatchToLocalStorage = saveDetectionMatch;

// Get all deepfake analysis results from local storage
export const getDeepfakeResults = (): DeepfakeAnalysisResult[] => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    return parsedData.deepfakeResults || [];
  }
  return [];
};

// Save a new deepfake analysis result to local storage
export const saveDeepfakeResult = (result: DeepfakeAnalysisResult) => {
  const data = localStorage.getItem('cybercrimeMonitoring');
  if (data) {
    const parsedData: LocalStorageState = JSON.parse(data);
    parsedData.deepfakeResults = [...(parsedData.deepfakeResults || []), result];
    parsedData.lastUpdated = new Date().toISOString();
    localStorage.setItem('cybercrimeMonitoring', JSON.stringify(parsedData));
  }
};

// Save a deepfake result to local storage (alias function to maintain compatibility)
export const saveDeepfakeResultToLocalStorage = saveDeepfakeResult;
