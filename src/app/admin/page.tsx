"use client"

import React, { useState, useEffect } from "react";
import Link from 'next/link';

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
      setIsAuthenticated(true);
      fetchProjects();
      } else {
      alert(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = forceRefresh ? "/api/getProjects?refresh=true" : "/api/getProjects";
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError("Failed to fetch projects. Please try again.");
    } finally {
      setLoading(false);
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
      setLoading(true);
      console.log(`Admin: Deleting project at index ${index}`);
      
      const response = await fetch("/api/deleteProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ index })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Admin: Delete successful', data);
        alert("Project deleted successfully");
        // Force refresh to get updated list
        await fetchProjects(true);
      } else {
        console.error('Admin: Delete failed', data);
        alert(`Failed to delete project: ${data.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Admin: Failed to delete project:", error);
      alert("Failed to delete project. Please check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  const handleInitProjects = async () => {
    try {
      const response = await fetch("/api/initProjects");
      const data = await response.json();
      alert(data.message || 'Operation completed');
      fetchProjects(); // Refresh projects after init
    } catch (error) {
      console.error("Failed to initialize projects:", error);
      alert("Failed to initialize projects. Please check the console for more details.");
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="space-x-2">
              <button 
                onClick={() => fetchProjects(true)}
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                disabled={loading}
              >
                Refresh
              </button>
              <button 
                onClick={handleInitProjects}
                className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                disabled={loading}
              >
                Init Sample Data
              </button>
              <Link href="/admin/upload" className="p-2 bg-green-500 text-white rounded hover:bg-green-600 inline-block">
                Upload Images
              </Link>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  fetchProjects();
                }}
                className="text-sm underline"
              >
                Try again
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-4">
              <p>Loading projects...</p>
            </div>
          ) : (
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
          )}
        </main>
      )}
    </div>
  );
}
