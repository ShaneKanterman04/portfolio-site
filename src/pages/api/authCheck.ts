import { NextApiRequest, NextApiResponse } from "next";
import { logger } from "../../utils/logger";
import { withLogging } from "../../middleware/apiLogger";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { password } = req.body;
      
      // Log authentication attempt (mask the password)
      logger.info("Authentication attempt", {
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        hasPassword: !!password
      });
      
      if (!password) {
        logger.warn("Authentication attempt missing password");
        return res.status(400).json({ authenticated: false, message: "Password is required" });
      }
      
      // Check against environment variable
      const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
      
      if (!correctPassword) {
        logger.error("Admin password not set in environment variables");
        return res.status(500).json({ authenticated: false, message: "Server configuration error" });
      }
      
      const authenticated = password === correctPassword;
      
      logger.info(`Authentication ${authenticated ? 'successful' : 'failed'}`, {
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      });
      
      res.status(200).json({ authenticated });
    } catch (error) {
      logger.error("Error during authentication check", { error });
      res.status(500).json({ authenticated: false, message: "Server error" });
    }
  } else {
    logger.warn(`Method not allowed: ${req.method}`);
    res.status(405).json({ message: "Method not allowed" });
  }
}

export default withLogging(handler);
