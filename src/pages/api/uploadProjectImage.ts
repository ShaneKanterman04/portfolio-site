import { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";
import { logger } from "../../utils/logger";
import { withLogging } from "../../middleware/apiLogger";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    logger.warn(`Method not allowed: ${req.method}`);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { file, filename } = req.body;
    
    if (!file || !filename) {
      logger.warn("Missing required fields for image upload");
      return res.status(400).json({ message: "Missing file or filename" });
    }

    // Convert base64 to buffer if needed
    let fileBuffer;
    if (typeof file === 'string' && file.startsWith('data:')) {
      const base64Data = file.split(',')[1];
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else {
      fileBuffer = file;
    }

    const safeName = `project-images/${Date.now()}-${filename.replace(/[^a-zA-Z0-9-_.]/g, '-')}`;
    logger.info(`Uploading project image: ${safeName}`);

    const { url } = await put(safeName, fileBuffer, {
      access: 'public',
    });

    logger.info(`Successfully uploaded image to: ${url}`);
    res.status(200).json({ url });
  } catch (error) {
    logger.error("Error uploading project image", { error });
    res.status(500).json({ 
      message: "Failed to upload image", 
      error: (error as Error).message 
    });
  }
}

export default withLogging(handler);
