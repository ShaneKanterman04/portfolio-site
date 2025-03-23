import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveProjectsToBlob, invalidateProjectsCache } from '@/utils/blobStorage';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: NextRequest) {
  try {
    // Read initial data from local file
    const dataFilePath = path.join(process.cwd(), 'data', 'projects.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ 
        error: 'Sample data file not found' 
      }, { status: 404 });
    }
    
    // Read and parse the file
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const initialProjects = JSON.parse(fileContents);
    
    // Save to blob storage
    await saveProjectsToBlob(initialProjects);
    
    // Clear cache to ensure fresh data on next fetch
    invalidateProjectsCache();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Projects initialized successfully',
      count: initialProjects.length
    });
  } catch (error) {
    console.error('Error initializing projects:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize projects', 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
