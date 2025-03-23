import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../utils/logger";
import { withLogging } from "../../middleware/apiLogger";
import { getProjects, storeProjects, initializeProjectsBlob, Project } from "../../utils/blobStorage";
import { put } from "@vercel/blob";

interface ProjectInput {
  title: string;
  description: string;
  skills: string[] | string;
  image: string | string[] | File | Blob;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const newProject = req.body as ProjectInput;
      logger.info("Adding new project", { title: newProject.title });
      
      if (!newProject.title || !newProject.description) {
        logger.warn("Missing required fields in project data", { 
          providedFields: Object.keys(newProject) 
        });
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Ensure the projects blob exists
      await initializeProjectsBlob();
      
      // Get existing projects
      const { projects, success, error } = await getProjects();
      
      if (!success) {
        logger.error("Failed to retrieve projects from Blob storage", { error });
        return res.status(500).json({ 
          message: "Failed to retrieve existing projects", 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
      
      // Handle image upload if it's a File/Blob
      let imageUrls: string[] = [];
      if (typeof newProject.image === 'string') {
        // If image is already a URL or comma-separated URLs
        imageUrls = newProject.image.split(",").map((url: string) => url.trim());
      } else if (Array.isArray(newProject.image)) {
        // If it's already an array of URLs
        imageUrls = newProject.image;
      } else if (newProject.image instanceof File || newProject.image instanceof Blob) {
        // Upload the image to Vercel Blob
        const filename = `project-images/${Date.now()}-${newProject.title.replace(/\s+/g, '-').toLowerCase()}`;
        const { url } = await put(filename, newProject.image, { access: 'public' });
        imageUrls = [url];
        logger.info(`Uploaded project image to: ${url}`);
      }
      
      const formattedProject: Project = {
        image: imageUrls,
        title: newProject.title,
        skills: Array.isArray(newProject.skills) ? newProject.skills : newProject.skills.split(",").map((s: string) => s.trim()),
        description: newProject.description
      };
      
      logger.debug("Formatted project data", { project: formattedProject });
      projects.push(formattedProject);

      // Store updated projects
      const storeResult = await storeProjects(projects);
      
      if (storeResult.success) {
        logger.info(`Project added successfully, total projects: ${projects.length}`);
        res.status(200).json({ message: "Project added successfully" });
      } else {
        logger.error("Failed to store updated projects in Blob", { error: storeResult.error });
        res.status(500).json({ message: "Failed to add project" });
      }
    } catch (error) {
      logger.error("Error in addProject handler", { error });
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
