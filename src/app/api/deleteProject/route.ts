import { NextRequest, NextResponse } from 'next/server';
import { getProjectsFromBlob, saveProjectsToBlob } from '@/utils/blobStorage';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the index to delete
    const { index } = await request.json();
    console.log(`API: Delete request for project at index ${index}`);
    
    // Validate index is a number
    if (typeof index !== 'number') {
      console.error('API: Invalid index type:', typeof index);
      return NextResponse.json(
        { error: 'Index must be a number' }, 
        { status: 400 }
      );
    }
    
    // Get existing projects from blob storage
    const projects = await getProjectsFromBlob(true); // Force fresh load
    console.log(`API: Fetched ${projects.length} projects before deletion`);
    
    // Check if the index is valid
    if (index < 0 || index >= projects.length) {
      console.error(`API: Invalid project index ${index} for array of length ${projects.length}`);
      return NextResponse.json(
        { error: 'Invalid project index' }, 
        { status: 400 }
      );
    }
    
    // Remove the project at the specified index
    const removedProject = projects.splice(index, 1);
    console.log(`API: Removed project at index ${index}:`, removedProject);
    console.log(`API: Projects array now has ${projects.length} items`);
    
    // Save the updated projects array back to blob storage
    await saveProjectsToBlob(projects);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('API: Error deleting project:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete project', 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
