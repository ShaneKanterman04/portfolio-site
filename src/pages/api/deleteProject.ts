import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { logger } from "../../utils/logger";
import { withLogging } from "../../middleware/apiLogger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { index } = req.body;
      logger.info(`Attempting to delete project at index: ${index}`);
      
      const filePath = path.join(process.cwd(), "public", "projects.json");
      logger.debug(`Reading projects file at: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        logger.error(`Projects file not found at: ${filePath}`);
        return res.status(404).json({ message: "Projects file not found" });
      }
      
      const fileContents = fs.readFileSync(filePath, "utf8");
      const projects = JSON.parse(fileContents);

      if (index >= 0 && index < projects.length) {
        const deletedProject = projects[index];
        logger.info(`Deleting project: ${deletedProject.title} at index ${index}`);
        
        projects.splice(index, 1);
        
        try {
          fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
          logger.info(`Project successfully deleted, ${projects.length} projects remaining`);
          res.status(200).json({ message: "Project deleted successfully" });
        } catch (writeError) {
          logger.error("Failed to write updated projects file", { error: writeError });
          res.status(500).json({ message: "Failed to update projects file" });
        }
      } else {
        logger.warn(`Invalid project index: ${index}, projects length: ${projects.length}`);
        res.status(400).json({ message: "Invalid project index" });
      }
    } catch (error) {
      logger.error("Error in deleteProject handler", { error });
      res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
  } else {
    logger.warn(`Method not allowed: ${req.method}`);
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default withLogging(handler);
