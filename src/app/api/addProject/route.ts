import { NextRequest, NextResponse } from 'next/server';
import { getProjectsFromBlob, saveProjectsToBlob, invalidateProjectsCache } from '@/utils/blobStorage';

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const newProject = await request.json();
    
    // Process the image and skills fields to convert strings to arrays if needed
    if (typeof newProject.image === 'string' && newProject.image.trim() !== '') {
      newProject.image = newProject.image.includes(',') 
        ? newProject.image.split(',').map((url: string) => url.trim())
        : [newProject.image.trim()]; 
    }
    
    if (typeof newProject.skills === 'string' && newProject.skills.trim() !== '') {
      newProject.skills = newProject.skills.includes(',') 
        ? newProject.skills.split(',').map((skill: string) => skill.trim())
        : [newProject.skills.trim()];
    }
    
    // Get existing projects from blob storage
    const projects = await getProjectsFromBlob(true); // Force fresh load
    
    // Add the new project to the array
    projects.push(newProject);
    
    // Save the updated projects array back to blob storage
    const result = await saveProjectsToBlob(projects);
    
    // Invalidate cache to ensure fresh data on next fetch
    invalidateProjectsCache();
    
    return NextResponse.json({ 
      success: true,
      url: result.url
    });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json(
      { error: 'Failed to add project', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
