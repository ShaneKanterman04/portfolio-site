import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface ProjectCardProps {
  image: string[];
  title: string;
  skills: string[];
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  title,
  skills,
  description,
}) => {
  console.log("ProjectCard:", { image, title, skills, description });

  const images = image.map((img) => ({
    original: img,
    thumbnail: img,
  }));

  return (
    <div className="project-card" style={{ outline: "1px solid black" }}>
      <div className="project-card-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>

        <div className="project-skills-container">
          <h4 className="project-skills-title">Skills:</h4>
          <hr />
          
          <ul className="project-skills">
            {skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="gallery-container">
          <ImageGallery showThumbnails={false} showPlayButton={false} autoPlay={true} showNav={false} showFullscreenButton={true}  items={images} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
