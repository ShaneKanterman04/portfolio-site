"use client";

import React, { useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProjectCard from "./ProjectCard";

interface Project {
  image: string | string[];
  title: string;
  skills: string[];
  description: string;
}

interface ProjectCarouselProps {
  projects: Project[];
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects }) => {
  console.log('Projects data in carousel:', projects);
  console.log('Number of projects:', projects.length);
  
  // Log each project individually for debugging
  useEffect(() => {
    projects.forEach((project, index) => {
      console.log(`Project ${index}:`, project);
    });
  }, [projects]);

  return (
    <div className="carousel-wrapper">
      {projects.length === 0 ? (
        <div className="text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          No projects to display
        </div>
      ) : (
        <Carousel 
          className="carousel" 
          centerMode={true} 
          showThumbs={false} 
          infiniteLoop={true} 
          useKeyboardArrows={true}
          emulateTouch={true}
          showStatus={true}
          showIndicators={true}
        >
          {projects.map((project, index) => (
            <div key={index} className="carousel-slide">
              <ProjectCard 
                image={Array.isArray(project.image) ? project.image : [project.image]} 
                title={project.title} 
                skills={project.skills} 
                description={project.description} 
              />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ProjectCarousel;
