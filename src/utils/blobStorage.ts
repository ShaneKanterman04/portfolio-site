import { put, list } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const PROJECTS_BLOB_KEY = process.env.PROJECTS_BLOB_NAME || 'projects-data.json';

// Cache for storing fetched projects
let projectsCache: any[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// Helper to get projects from blob storage with caching
export async function getProjectsFromBlob(forceRefresh = false) {
  try {
    const currentTime = Date.now();
    
    // Return cached data if available and not expired
    if (!forceRefresh && projectsCache && currentTime - lastFetchTime < CACHE_TTL) {
      return projectsCache;
    }
    
    // Try to find the projects file from blob storage using list
    const { blobs } = await list({ prefix: PROJECTS_BLOB_KEY });
    
    // If the projects file doesn't exist in blob storage
    if (blobs.length === 0) {
      // Try to load from local file as fallback
      return getProjectsFromLocal();
    }
    
    // Get the most recent blob URL (should only be one with this key)
    const blobUrl = blobs[0].url;
    
    // Fetch the content from the blob URL
    const response = await fetch(blobUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blob data: ${response.statusText}`);
    }
    
    // Parse and return the projects data
    const text = await response.text();
    const projects = JSON.parse(text);
    
    // Update cache
    projectsCache = projects;
    lastFetchTime = currentTime;
    
    return projects;
  } catch (error) {
    console.error('Error getting projects from blob:', error);
    
    // If blob storage fails, fall back to local file
    return getProjectsFromLocal();
  }
}

// Helper to get projects from local file as fallback
function getProjectsFromLocal() {
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'projects.json');
    
    if (fs.existsSync(dataFilePath)) {
      const fileContents = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(fileContents);
    }
    
    return [];
  } catch (error) {
    console.error('Error getting projects from local file:', error);
    return [];
  }
}

// Helper to save projects to blob storage
export async function saveProjectsToBlob(projects: any[]) {
  try {
    const projectsJson = JSON.stringify(projects, null, 2);
    
    // Create a proper blob with the right content type
    const projectsBlob = new Blob([projectsJson], {
      type: 'application/json',
    });
    
    // Upload to Vercel Blob with the same key
    const result = await put(PROJECTS_BLOB_KEY, projectsBlob, {
      access: 'public',
    });
    
    // Update cache after successful save
    projectsCache = projects;
    lastFetchTime = Date.now();
    
    // Also save to local file as backup
    saveProjectsToLocal(projects);
    
    return result;
  } catch (error) {
    console.error('Error saving projects to blob:', error);
    
    // If blob storage fails, still try to save locally
    saveProjectsToLocal(projects);
    
    throw error;
  }
}

// Helper to save projects to local file as backup
function saveProjectsToLocal(projects: any[]) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const dataFilePath = path.join(dataDir, 'projects.json');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write projects to file
    fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error saving projects to local file:', error);
  }
}

// Function to invalidate cache and force reload
export function invalidateProjectsCache() {
  projectsCache = null;
  lastFetchTime = 0;
}
