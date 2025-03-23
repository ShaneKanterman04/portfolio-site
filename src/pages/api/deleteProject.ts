import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { index } = req.body;
    const filePath = path.join(process.cwd(), "public", "projects.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const projects = JSON.parse(fileContents);

    if (index >= 0 && index < projects.length) {
      projects.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));
      res.status(200).json({ message: "Project deleted successfully" });
    } else {
      res.status(400).json({ message: "Invalid project index" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
