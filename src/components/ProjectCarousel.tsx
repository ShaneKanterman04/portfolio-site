"use client";

import React, { useState } from "react";
import Image from "next/image";

// Define project type
interface Project {
  id?: string;
  title: string;
  images: string[];
  skills: string[];
  description: string;
}

interface ProjectCarouselProps {
  projects: Project[];
  imageHeight?: number; // New prop to control image height
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ 
  projects, 
  imageHeight = 400 // Default height of 400px (larger than the original h-64 which is 256px)
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  // For debugging
  console.log("Projects in carousel:", projects);
  
  // Guard against empty projects
  if (!projects || projects.length === 0) {
    return <div className="text-center p-4">No projects found</div>;
  }

  const currentProject = projects[currentIndex];
  
  // Ensure we have valid images array and handle edge cases
  const images = Array.isArray(currentProject.images) ? 
    currentProject.images : 
    (typeof currentProject.images === 'string' ? 
      [currentProject.images] : []);

  // Ensure imageIndex is valid
  const safeImageIndex = images.length > 0 ? Math.min(imageIndex, images.length - 1) : 0;
  
  // Current image to display
  const currentImage = images.length > 0 ? images[safeImageIndex] : null;

  const nextProject = () => {
    setImageIndex(0);
    setCurrentIndex((currentIndex + 1) % projects.length);
  };

  const prevProject = () => {
    setImageIndex(0);
    setCurrentIndex((currentIndex - 1 + projects.length) % projects.length);
  };

  const nextImage = () => {
    if (images.length > 1) {
      setImageIndex((safeImageIndex + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setImageIndex((safeImageIndex - 1 + images.length) % images.length);
    }
  };

  // Check if we're at the first or last project
  const isFirstProject = currentIndex === 0;
  const isLastProject = currentIndex === projects.length - 1;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
      {/* Project navigation */}
      <div className="flex justify-between bg-gray-700 p-2">
        <button
          onClick={prevProject}
          disabled={isFirstProject}
          className={`px-4 py-2 rounded ${
            isFirstProject 
              ? "bg-gray-500 text-gray-300 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-label="Previous Project"
        >
          Previous Project
        </button>
        <span className="px-4 py-2 text-white">
          Project {currentIndex + 1} of {projects.length}
        </span>
        <button
          onClick={nextProject}
          disabled={isLastProject}
          className={`px-4 py-2 rounded ${
            isLastProject 
              ? "bg-gray-500 text-gray-300 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-label="Next Project"
        >
          Next Project
        </button>
      </div>

      {/* Project content */}
      <div className="p-4 bg-gray-800 text-white">
        <h2 className="text-2xl font-bold mb-2">{currentProject.title}</h2>
        
        {/* Image carousel - using style to set custom height */}
        <div className="relative w-full bg-gray-900 mb-4 rounded overflow-hidden" style={{ height: `${imageHeight}px` }}>
          {currentImage ? (
            <div className="relative w-full h-full">
              <img
                src={currentImage}
                alt={`${currentProject.title} screenshot`}
                className="object-contain w-full h-full"
              />
              
              {/* Image navigation arrows (only show if multiple images) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
                    aria-label="Next image"
                  >
                    →
                  </button>
                  <div className="absolute bottom-2 left-0 right-0 text-center text-white text-xs bg-black bg-opacity-40 py-1">
                    Image {safeImageIndex + 1} of {images.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No image available</p>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="mb-4">
          <h3 className="font-bold mb-1">Skills:</h3>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(currentProject.skills) && currentProject.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-700 px-2 py-1 text-sm rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-bold mb-1">Description:</h3>
          <p className="text-gray-300">{currentProject.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCarousel;
