"use client"

import React, { useState, useEffect } from "react";

// Define project type
interface Project {
  title: string;
  image: string[] | string;
  skills: string[] | string;
  description: string;
}

export default function Home() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Initialize with proper type
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    title: "",
    image: "",
    skills: "",
    description: ""
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchProjects();
    } else {
      alert("Incorrect password");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/getProjects");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      alert("Failed to fetch projects. Please check the console for more details.");
    }
  };

  const handleNewProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch("/api/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newProject)
      });

      if (response.ok) {
        alert("Project added successfully");
        fetchProjects();
        setNewProject({ title: "", image: "", skills: "", description: "" });
      } else {
        alert("Failed to add project");
      }
    } catch (error) {
      console.error("Failed to add project:", error);
      alert("Failed to add project. Please check the console for more details.");
    }
  };

  const handleDeleteProject = async (index: number) => {
    try {
      const response = await fetch("/api/deleteProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ index })
      });

      if (response.ok) {
        alert("Project deleted successfully");
        fetchProjects();
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project. Please check the console for more details.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {!isAuthenticated ? (
        <div>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            className="border p-2"
          />
          <button onClick={handleLogin} className="ml-2 p-2 bg-blue-500 text-white">
            Login
          </button>
        </div>
      ) : (
        <main className="w-full max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <div className="overflow-x-auto border rounded shadow">
            <table className="min-w-full bg-white border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Image URLs</th>
                  <th className="border px-4 py-2">Skills</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{project.title}</td>
                    <td className="border px-4 py-2">{Array.isArray(project.image) ? project.image.join(', ') : project.image}</td>
                    <td className="border px-4 py-2">{Array.isArray(project.skills) ? project.skills.join(', ') : project.skills}</td>
                    <td className="border px-4 py-2">{project.description}</td>
                    <td className="border px-4 py-2 action-button">
                      <button onClick={() => handleDeleteProject(index)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="title"
                      value={newProject.title}
                      onChange={handleNewProjectChange}
                      placeholder="New Title"
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="image"
                      value={newProject.image}
                      onChange={handleNewProjectChange}
                      placeholder="New Image URLs"
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="skills"
                      value={newProject.skills}
                      onChange={handleNewProjectChange}
                      placeholder="New Skills"
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <textarea
                      name="description"
                      value={newProject.description}
                      onChange={handleNewProjectChange}
                      placeholder="New Description"
                      className="w-full p-1 border rounded"
                      rows={3}
                    />
                  </td>
                  <td className="border px-4 py-2 action-button">
                    <button onClick={handleAddProject} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Add Project
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      )}
    </div>
  );
}
