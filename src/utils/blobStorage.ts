import { put } from '@vercel/blob';

// Use environment variables for Blob storage configuration
const blobBaseUrl = process.env.NEXT_PUBLIC_BLOB_BASE_URL || "";
const projectsPath = process.env.NEXT_PUBLIC_PROJECTS_PATH || "";
const blobUrl = blobBaseUrl + projectsPath;

// Validate environment variables
if (!blobBaseUrl || !projectsPath) {
  console.warn('Blob storage environment variables are not properly configured');
}

// Cache for projects data to reduce redundant fetches
let projectsCache: Record<string, unknown>[] | null = null;

/**
 * Fetch projects from the Vercel Blob storage
 * @param forceRefresh Force a refresh from storage instead of using cache
 * @returns Array of projects
 */
export async function getProjectsFromBlob(forceRefresh = false): Promise<Record<string, unknown>[]> {
  // Return cached data if available and not forcing refresh
  if (projectsCache && !forceRefresh) {
    return projectsCache;
  }

  try {
    console.log('Fetching projects from blob storage:', blobUrl);
    
    // Add cache busting if forcing refresh
    const fetchUrl = forceRefresh ? `${blobUrl}?t=${Date.now()}` : blobUrl;
    
    const response = await fetch(fetchUrl, {
      cache: forceRefresh ? 'no-store' : 'default',
      headers: {
        'Cache-Control': forceRefresh ? 'no-cache' : 'default'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status}`);
    }

    const data = await response.json();
    
    // Process the data to ensure it's an array
    const projectsArray = Array.isArray(data) ? data : 
                        (data.projects && Array.isArray(data.projects)) ? data.projects : [];
    
    // Update cache
    projectsCache = projectsArray;
    
    return projectsArray;
  } catch (error) {
    console.error('Error fetching projects from blob:', error);
    throw error;
  }
}

/**
 * Save projects to the Vercel Blob storage
 * @param projects Array of projects to save
 * @returns Result of the blob upload
 */
export async function saveProjectsToBlob(projects: Record<string, unknown>[]) {
  try {
    console.log('Saving projects to blob storage');
    
    // Create JSON content from projects
    const jsonContent = JSON.stringify(projects, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    
    // Upload to Vercel Blob with the same filename to overwrite
    const filename = projectsPath.substring(1); // Remove leading slash
    const result = await put(filename, blob, {
      access: 'public',
      addRandomSuffix: false, // Don't add random suffix to keep the same URL
    });
    
    // Update the cache with the new data
    projectsCache = projects;
    
    return result;
  } catch (error) {
    console.error('Error saving projects to blob:', error);
    throw error;
  }
}

/**
 * Clear the projects cache
 */
export function invalidateProjectsCache() {
  projectsCache = null;
}
