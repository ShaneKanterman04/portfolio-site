import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../utils/logger";
import { withLogging } from "../../middleware/apiLogger";
import { getProjects } from "../../utils/blobStorage";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    logger.debug(`Retrieving projects from Blob storage`);
    
    try {
      const { projects, success, error, exists } = await getProjects();
      
      if (!success) {
        logger.error("Error retrieving projects from Blob storage", { error });
        return res.status(500).json({ 
          message: "Error reading projects data", 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
      
      if (!exists) {
        logger.warn("Projects blob not found, returning empty array");
      } else {
        logger.info(`Successfully retrieved ${projects.length} projects`);
      }
      
      res.status(200).json(projects);
    } catch (error) {
      logger.error("Unexpected error in getProjects API", { error });
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
