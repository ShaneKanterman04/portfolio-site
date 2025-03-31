"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Define project type with standardized fields
interface Project {
  id: string;
  title: string;
  images: string[];
  skills: string[];
  description: string;
}

export default function Home() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Initialize with proper type and default empty array
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    title: "",
    skills: "",
    description: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadedImagePaths, setUploadedImagePaths] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
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
      const url = forceRefresh
        ? "/api/getProjects?refresh=true"
        : "/api/getProjects";
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      alert("Raw data from API: " + JSON.stringify(data, null, 2));
      setProjects(data.projects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setError("Failed to fetch projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewProjectChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const uploadImages = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return [];
    }

    setUploading(true);
    try {
      const formData = new FormData();

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }

      const response = await fetch("/api/uploadImages", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      setUploadedImagePaths(data.files);
      return data.files;
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleAddProject = async () => {
    try {
      // First upload any images
      const imagePaths = await uploadImages();

      // Prepare project data using uploaded image paths
      const projectData = {
        title: newProject.title,
        images: imagePaths,
        skills: newProject.skills.split(",").map((item) => item.trim()),
        description: newProject.description,
      };

      const response = await fetch("/api/addProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        alert("Project added successfully");
        fetchProjects();
        setNewProject({ title: "", skills: "", description: "" });
        setSelectedFiles(null);
        setUploadedImagePaths([]);
      } else {
        alert("Failed to add project");
      }
    } catch (error) {
      console.error("Failed to add project:", error);
      alert(
        "Failed to add project. Please check the console for more details."
      );
    }
  };

  const handleDeleteProject = async (index: number) => {
    try {
      setLoading(true);
      console.log(`Admin: Deleting project at index ${index}`);

      const response = await fetch("/api/deleteProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Admin: Delete successful", data);
        alert("Project deleted successfully");
        // Force refresh to get updated list
        await fetchProjects(true);
      } else {
        console.error("Admin: Delete failed", data);
        alert(`Failed to delete project: ${data.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Admin: Failed to delete project:", error);
      alert(
        "Failed to delete project. Please check the console for more details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInitProjects = async () => {
    try {
      const response = await fetch("/api/initProjects");
      const data = await response.json();
      alert(data.message || "Operation completed");
      fetchProjects(); // Refresh projects after init
    } catch (error) {
      console.error("Failed to initialize projects:", error);
      alert(
        "Failed to initialize projects. Please check the console for more details."
      );
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  // Function to render image thumbnails
  const renderImageThumbnails = (imagePaths: string[]) => {
    if (!imagePaths || imagePaths.length === 0) {
      return <span className="text-gray-500">No images</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {imagePaths.map((path, i) => (
          <div key={i} className="relative">
            <img
              src={path}
              alt={`Project image ${i + 1}`}
              className="w-12 h-12 object-cover rounded border border-gray-300"
            />
          </div>
        ))}
        {imagePaths.length > 3 && (
          <span className="text-xs text-gray-500 flex items-center ml-1">
            +{imagePaths.length - 3} more
          </span>
        )}
      </div>
    );
  };

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
          <button
            onClick={handleLogin}
            className="ml-2 p-2 bg-blue-500 text-white"
          >
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
                    <th className="border px-4 py-2">Images</th>
                    <th className="border px-4 py-2">Skills</th>
                    <th className="border px-4 py-2">Description</th>
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length > 0 &&
                    projects.map((project, index) => (
                      <tr key={project.id || index}>
                        <td className="border px-4 py-2">{project.title}</td>
                        <td className="border px-4 py-2">
                          {renderImageThumbnails(project.images)}
                        </td>
                        <td className="border px-4 py-2">
                          {Array.isArray(project.skills)
                            ? project.skills.join(", ")
                            : project.skills}
                        </td>
                        <td className="border px-4 py-2">
                          {project.description}
                        </td>
                        <td className="border px-4 py-2 action-button">
                          <button
                            onClick={() => handleDeleteProject(index)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
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
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="w-full p-1 border rounded"
                      />
                      {selectedFiles && selectedFiles.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          {selectedFiles.length} file(s) selected
                        </div>
                      )}
                      {uploadedImagePaths.length > 0 && (
                        <div className="mt-2">
                          <div className="text-sm text-green-600 mb-1">
                            {uploadedImagePaths.length} image(s) uploaded
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {uploadedImagePaths.slice(0, 3).map((path, i) => (
                              <img
                                key={i}
                                src={path}
                                alt={`Uploaded ${i + 1}`}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {uploading && (
                        <div className="mt-2 text-sm text-blue-600">
                          Uploading...
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        name="skills"
                        value={newProject.skills}
                        onChange={handleNewProjectChange}
                        placeholder="Skills (comma separated)"
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
                      <button
                        onClick={handleAddProject}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Add Project"}
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
