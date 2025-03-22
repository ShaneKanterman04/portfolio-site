import React from "react";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

interface ProjectCardProps {
  image: string;
  title: string;
  skills: string[];
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, title, skills, description }) => {
  console.log("ProjectCard:", { image, title, skills, description });

  const images = [
    {
      original: image,
      thumbnail: image,
    },
    // Add more images as needed
  ];

  return (
    <div className="project-card" style={{ outline: '1px solid black' }}>
      <div className="project-card-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        <ul className="project-skills">
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
        <div className="gallery-container">
          <ImageGallery showThumbnails={false} items={images} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
