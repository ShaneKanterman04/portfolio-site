import { NextRequest, NextResponse } from 'next/server';
import { getProjectsFromBlob } from '@/utils/blobStorage';

export async function GET(request: NextRequest) {
  try {
    // Check if we should force refresh the cache
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';
    
    // Fetch projects from storage (with potential caching)
    const projects = await getProjectsFromBlob(forceRefresh);
    
    // Add cache control headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
    
    // Return the projects as JSON
    return NextResponse.json(projects, { headers });
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return a more descriptive error
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error instanceof Error ? error.message : String(error) }, 
      { status: 500 }
    );
  }
}
