import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { logger } from "../../utils/logger";
import { withLogging } from "../../middleware/apiLogger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const newProject = req.body;
      logger.info("Adding new project", { title: newProject.title });
      
      if (!newProject.title || !newProject.description) {
        logger.warn("Missing required fields in project data", { 
          providedFields: Object.keys(newProject) 
        });
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const filePath = path.join(process.cwd(), "public", "projects.json");
      logger.debug(`Reading projects file at: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        logger.error(`Projects file not found at: ${filePath}`);
        return res.status(404).json({ message: "Projects file not found" });
      }
      
      const fileContents = fs.readFileSync(filePath, "utf8");
      let projects = [];
      
      try {
        projects = JSON.parse(fileContents);
      } catch (parseError) {
        logger.error("Failed to parse projects file", { error: parseError });
        return res.status(500).json({ message: "Invalid projects file format" });
      }
      
      const formattedProject = {
        image: Array.isArray(newProject.image) ? newProject.image : newProject.image.split(","),
        title: newProject.title,
        skills: Array.isArray(newProject.skills) ? newProject.skills : newProject.skills.split(","),
        description: newProject.description
      };
      
      logger.debug("Formatted project data", { project: formattedProject });
      projects.push(formattedProject);

      try {
        fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
        logger.info(`Project added successfully, total projects: ${projects.length}`);
        res.status(200).json({ message: "Project added successfully" });
      } catch (writeError) {
        logger.error("Failed to write updated projects file", { error: writeError });
        res.status(500).json({ message: "Failed to update projects file" });
      }
    } catch (error) {
      logger.error("Error in addProject handler", { error });
      res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
  } else {
    logger.warn(`Method not allowed: ${req.method}`);
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default withLogging(handler);
