"use client";

import React from "react";
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
  console.log("ProjectCarousel:", { projects });
  return (
    <div className="carousel-wrapper">
      <Carousel className="carousel" centerMode={true} showThumbs={false} infiniteLoop useKeyboardArrows>
        {projects.map((project, index) => (
          <div key={index}>
            <ProjectCard 
              image={Array.isArray(project.image) ? project.image : [project.image]} 
              title={project.title} 
              skills={project.skills} 
              description={project.description} 
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ProjectCarousel;
