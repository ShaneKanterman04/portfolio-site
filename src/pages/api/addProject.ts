import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const newProject = req.body;
    const filePath = path.join(process.cwd(), "public", "projects.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const projects = JSON.parse(fileContents);

    projects.push({
      image: newProject.image.split(","),
      title: newProject.title,
      skills: newProject.skills.split(","),
      description: newProject.description
    });

    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2));

    res.status(200).json({ message: "Project added successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
