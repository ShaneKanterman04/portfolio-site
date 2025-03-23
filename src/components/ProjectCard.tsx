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
  console.log("ProjectCard render:", { image, title, skills, description });

  // Ensure image is an array with valid entries
  const validImages = Array.isArray(image) 
    ? image.filter(img => img && typeof img === 'string') 
    : [];
    
  // Create gallery images array
  const images = validImages.map((img) => ({
    original: img,
    thumbnail: img,
  }));

  const getSkillsArray = (skills: string | string[] | Record<string, string> | null | undefined) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') return skills.split(',').map(s => s.trim());
    if (typeof skills === 'object') return Object.values(skills);
    return [];
  };

  const skillsArray = getSkillsArray(skills);

  return (
    <div className="project-card" style={{ outline: "1px solid black" }}>
      <div className="project-card-content">
        <h3 className="project-title">{title || 'Untitled Project'}</h3>
        <p className="project-description">{description || 'No description available'}</p>

        <div className="project-skills-container">
          <h4 className="project-skills-title">Skills:</h4>
          <hr />
          
          <div className="flex flex-wrap gap-2 mt-2">
            {skillsArray.map((skill, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="gallery-container">
          {images.length > 0 ? (
            <ImageGallery 
              showThumbnails={false} 
              showPlayButton={false} 
              autoPlay={true} 
              showNav={false} 
              showFullscreenButton={true} 
              items={images} 
            />
          ) : (
            <div className="p-8 text-center bg-gray-100 rounded-md flex flex-col items-center justify-center min-h-[200px]">
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p className="text-gray-600 font-medium">No images available for this project</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
