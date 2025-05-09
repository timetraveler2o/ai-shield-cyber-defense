
import { LocalStorageState, Person, DetectionMatch, DeepfakeAnalysisResult } from "@/components/face-database/types";

const STORAGE_KEY = 'cyber_investigation_data';

// Initialize local storage with default values
export const initLocalStorage = (): void => {
  const initialState: LocalStorageState = {
    persons: [],
    detectionMatches: [],
    deepfakeResults: [],
    lastUpdated: new Date().toISOString(),
  };

  // Only initialize if not already present
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  }
};

// Get all data from local storage
export const getLocalStorageData = (): LocalStorageState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      initLocalStorage();
      return getLocalStorageData();
    }
    return JSON.parse(data) as LocalStorageState;
  } catch (error) {
    console.error('Error getting data from local storage:', error);
    initLocalStorage();
    return getLocalStorageData();
  }
};

// Save all data to local storage
export const saveLocalStorageData = (data: LocalStorageState): void => {
  try {
    // Update lastUpdated timestamp
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving data to local storage:', error);
  }
};

// Person-related functions
export const savePersonToLocalStorage = (person: Person): void => {
  try {
    const data = getLocalStorageData();
    
    // Check if person already exists, update if it does
    const index = data.persons.findIndex(p => p.id === person.id);
    if (index !== -1) {
      data.persons[index] = person;
    } else {
      data.persons.push(person);
    }
    
    saveLocalStorageData(data);
  } catch (error) {
    console.error('Error saving person to local storage:', error);
  }
};

export const getAllPersonsFromLocalStorage = (): Person[] => {
  try {
    const data = getLocalStorageData();
    return data.persons;
  } catch (error) {
    console.error('Error getting persons from local storage:', error);
    return [];
  }
};

export const removePersonFromLocalStorage = (personId: string): void => {
  try {
    const data = getLocalStorageData();
    data.persons = data.persons.filter(person => person.id !== personId);
    saveLocalStorageData(data);
  } catch (error) {
    console.error('Error removing person from local storage:', error);
  }
};

// DetectionMatch-related functions
export const saveDetectionMatchToLocalStorage = (match: DetectionMatch): void => {
  try {
    const data = getLocalStorageData();
    data.detectionMatches.push(match);
    saveLocalStorageData(data);
  } catch (error) {
    console.error('Error saving detection match to local storage:', error);
  }
};

export const getAllDetectionMatchesFromLocalStorage = (): DetectionMatch[] => {
  try {
    const data = getLocalStorageData();
    return data.detectionMatches;
  } catch (error) {
    console.error('Error getting detection matches from local storage:', error);
    return [];
  }
};

// DeepfakeResult-related functions
export const saveDeepfakeResultToLocalStorage = (result: DeepfakeAnalysisResult): void => {
  try {
    const data = getLocalStorageData();
    data.deepfakeResults.push(result);
    saveLocalStorageData(data);
  } catch (error) {
    console.error('Error saving deepfake result to local storage:', error);
  }
};

export const getAllDeepfakeResultsFromLocalStorage = (): DeepfakeAnalysisResult[] => {
  try {
    const data = getLocalStorageData();
    return data.deepfakeResults;
  } catch (error) {
    console.error('Error getting deepfake results from local storage:', error);
    return [];
  }
};

// Clear all data from local storage
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    initLocalStorage();
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
};
