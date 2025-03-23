import { NextRequest, NextResponse } from 'next/server';
import { getProjectsFromBlob, saveProjectsToBlob, invalidateProjectsCache } from '@/utils/blobStorage';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the index to delete
    const { index } = await request.json();
    
    // Validate index is a number
    if (typeof index !== 'number') {
      return NextResponse.json({ error: 'Index must be a number' }, { status: 400 });
    }
    
    // Get existing projects from blob storage
    const projects = await getProjectsFromBlob(true); // Force fresh load
    
    // Check if the index is valid
    if (index < 0 || index >= projects.length) {
      return NextResponse.json({ error: 'Invalid project index' }, { status: 400 });
    }
    
    // Remove the project at the specified index
    projects.splice(index, 1);
    
    // Save the updated projects array back to blob storage
    const result = await saveProjectsToBlob(projects);
    
    return NextResponse.json({ 
      success: true,
      url: result.url
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
