import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { logger } from "../../utils/logger";
import { withLogging } from "../../middleware/apiLogger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const filePath = path.join(process.cwd(), "public", "projects.json");
    logger.debug(`Looking for projects file at: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
      try {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const projects = JSON.parse(fileContents);
        logger.info(`Successfully retrieved ${projects.length} projects`);
        res.status(200).json(projects);
      } catch (error) {
        logger.error("Error parsing projects file", { error });
        res.status(500).json({ message: "Error reading projects data", error: (error as Error).message });
      }
    } else {
      logger.warn(`Projects file not found at path: ${filePath}`);
      res.status(404).json({ message: "Projects file not found" });
    }
  } else {
    logger.warn(`Method not allowed: ${req.method}`);
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default withLogging(handler);
