import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../utils/logger";
import { withLogging } from "../../middleware/apiLogger";
import { getProjects, storeProjects } from "../../utils/blobStorage";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { index } = req.body;
      logger.info(`Attempting to delete project at index: ${index}`);
      
      // Get existing projects from Blob storage
      const { projects, success, exists, error } = await getProjects();
      
      if (!success) {
        logger.error("Failed to retrieve projects from Blob storage", { error });
        return res.status(500).json({ 
          message: "Failed to retrieve projects", 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
      
      if (!exists || projects.length === 0) {
        logger.warn("No projects found to delete");
        return res.status(404).json({ message: "No projects found" });
      }
      
      if (index >= 0 && index < projects.length) {
        const deletedProject = projects[index];
        logger.info(`Deleting project: ${deletedProject.title} at index ${index}`);
        
        projects.splice(index, 1);
        
        // Store updated projects back to Blob
        const storeResult = await storeProjects(projects);
        
        if (storeResult.success) {
          logger.info(`Project successfully deleted, ${projects.length} projects remaining`);
          res.status(200).json({ message: "Project deleted successfully" });
        } else {
          logger.error("Failed to store updated projects in Blob", { error: storeResult.error });
          res.status(500).json({ message: "Failed to update projects" });
        }
      } else {
        logger.warn(`Invalid project index: ${index}, projects length: ${projects.length}`);
        res.status(400).json({ message: "Invalid project index" });
      }
    } catch (error) {
      logger.error("Error in deleteProject handler", { error });
      res.status(500).json({ 
        message: "Server error", 
        error: (error as Error).message 
      });
    }
  } else {
    logger.warn(`Method not allowed: ${req.method}`);
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default withLogging(handler);
