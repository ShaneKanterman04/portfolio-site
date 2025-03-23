import { put, list, del, get } from "@vercel/blob";
import { logger } from "./logger";

// Default projects blob name
const defaultProjectsBlobName = process.env.PROJECTS_BLOB_NAME || 'projects.json';

/**
 * Store projects data in Vercel Blob
 */
export async function storeProjects(projects: any[], blobName: string = defaultProjectsBlobName) {
  try {
    const { url } = await put(blobName, JSON.stringify(projects, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });
    
    logger.info(`Successfully stored projects in Blob: ${url}`);
    return { url, success: true };
  } catch (error) {
    logger.error("Failed to store projects in Blob", { error });
    return { error, success: false };
  }
}

/**
 * Get projects data from Vercel Blob
 */
export async function getProjects(blobName: string = defaultProjectsBlobName) {
  try {
    const blob = await get(blobName);
    
    if (!blob) {
      logger.warn(`Blob not found: ${blobName}`);
      return { projects: [], success: false, exists: false };
    }
    
    const content = await blob.text();
    const projects = JSON.parse(content);
    
    logger.info(`Successfully retrieved ${projects.length} projects from Blob`);
    return { projects, success: true, exists: true };
  } catch (error) {
    logger.error("Failed to retrieve projects from Blob", { error });
    
    // If the blob doesn't exist yet, return an empty array
    if ((error as Error).message.includes('not found')) {
      return { projects: [], success: true, exists: false };
    }
    
    return { projects: [], success: false, error, exists: false };
  }
}

/**
 * Initialize projects blob with empty array if it doesn't exist
 */
export async function initializeProjectsBlob(blobName: string = defaultProjectsBlobName) {
  const { exists } = await getProjects(blobName);
  
  if (!exists) {
    logger.info(`Initializing projects blob: ${blobName}`);
    return await storeProjects([], blobName);
  }
  
  return { success: true };
}
