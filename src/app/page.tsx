"use client"

import ProjectCarousel from "@/components/ProjectCarousel";
import React, { useEffect, useState, useRef } from "react";

// Define a type for projects
type Project = {
  title: string;
  images: string[]; // Changed from image to images to match the backend model
  skills: string[];
  description: string;
  [key: string]: unknown; // Allow for additional properties
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate fetches in development mode with React strict mode
    if (fetchedRef.current) return;
    
    console.log('Home: Fetching data from API route');
    
    // Use our own API route instead of direct Blob storage access
    const apiUrl = `/api/getProjects`;
    
    fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Home: Raw data from API:', data);
        
        // Only show the alert once during development
        if (!fetchedRef.current && process.env.NODE_ENV === 'development') {
          fetchedRef.current = true;
        }
        
        // Use data directly without filtering
        const projectsArray = Array.isArray(data) ? data : 
                          (data.projects && Array.isArray(data.projects)) ? data.projects : [];
        
        console.log('Home: Projects array:', projectsArray);
        console.log('Home: Number of projects:', projectsArray.length);
        
        // Make sure each project has an images array
        const normalizedProjects = projectsArray.map((project: Project) => ({
          ...project,
          images: Array.isArray(project.images) ? project.images : 
                  (typeof project.images === 'string' ? [project.images] : [])
        }));
        
        console.log('Home: Normalized projects:', normalizedProjects);
        setProjects(normalizedProjects);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <main>
        <div className="min-h-screen flex flex-col items-center justify-center p-20">
          <h1
            className="text-4xl text-center mb-4"
            style={{ fontFamily: "var(--font-main)" }}
          >
            Shane Kanterman -- Software Developer
          </h1>
          <p
            className="text-center mb-8"
            style={{ fontFamily: "var(--font-main)" }}
          >
            I am a full stack developer with a passion for creating and
            maintaining applications both on and off the web. I have experience with a variety of
            technologies, including C++, C#, React, React Native, Node.js, and Python. I am always
            looking to learn new things and improve my skills.
          </p>       
          <div className="w-full max-w-4xl">
          {error ? (
            <p className="text-red-500">Error loading projects: {error}</p>
          ) : projects.length === 0 ? (
            <p>Loading projects...</p>
          ) : (
            <ProjectCarousel key={projects.length} projects={projects} />
          )}
          </div>
        </div>
      </main>
    </div>
  );
}
