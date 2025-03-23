"use client"

import ProjectCarousel from "@/components/ProjectCarousel";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/projects.json")
      .then((response) => response.json())
      .then((data) => setProjects(data));
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
          <div className="w-200">
          <ProjectCarousel key={projects.length} projects={projects} />   
          </div>
            
        </div>
      </main>
    </div>
  );
}
