import { NextRequest, NextResponse } from 'next/server';
import { saveProjectsToBlob, getProjectsFromBlob } from '@/utils/blobStorage';

// Sample initial projects
const initialProjects = [
  {
    "title": "Portfolio Website",
    "image": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "skills": ["React", "Next.js", "Tailwind CSS"],
    "description": "A personal portfolio website built with modern web technologies."
  }
];

export async function GET(request: NextRequest) {
  try {
    // Check if we already have projects
    const existingProjects = await getProjectsFromBlob();
    
    // Only initialize if no projects exist
    if (!existingProjects || existingProjects.length === 0) {
      const result = await saveProjectsToBlob(initialProjects);
      return NextResponse.json({ 
        success: true, 
        message: 'Projects initialized successfully',
        url: result.url
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Projects already exist, initialization skipped',
        count: existingProjects.length
      });
    }
  } catch (error) {
    console.error('Error initializing projects:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize projects',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
