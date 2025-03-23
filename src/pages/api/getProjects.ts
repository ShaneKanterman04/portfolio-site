import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const filePath = path.join(process.cwd(), "public", "projects.json");
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const projects = JSON.parse(fileContents);
      res.status(200).json(projects);
    } else {
      res.status(404).json({ message: "Projects file not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
