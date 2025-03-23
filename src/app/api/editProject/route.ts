import { NextRequest, NextResponse } from 'next/server';
import { getProjectsFromBlob, saveProjectsToBlob } from '@/utils/blobStorage';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the project index and updated data
    const { index, project } = await request.json();
    
    // Validate index is a number
    if (typeof index !== 'number') {
      return NextResponse.json(
        { error: 'Index must be a number' }, 
        { status: 400 }
      );
    }
    
    // Process the image and skills fields to convert strings to arrays if needed
    if (typeof project.image === 'string' && project.image.trim() !== '') {
      project.image = project.image.includes(',') 
        ? project.image.split(',').map((url: string) => url.trim())
        : [project.image.trim()]; 
    }
    
    if (typeof project.skills === 'string' && project.skills.trim() !== '') {
      project.skills = project.skills.includes(',') 
        ? project.skills.split(',').map((skill: string) => skill.trim())
        : [project.skills.trim()];
    }
    
    // Get existing projects from blob storage
    const projects = await getProjectsFromBlob(true); // Force fresh load
    
    // Check if the index is valid
    if (index < 0 || index >= projects.length) {
      return NextResponse.json(
        { error: 'Invalid project index' }, 
        { status: 400 }
      );
    }
    
    // Update the project at the specified index
    projects[index] = project;
    
    // Save the updated projects array back to blob storage
    const result = await saveProjectsToBlob(projects);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project updated successfully',
      url: result.url
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
