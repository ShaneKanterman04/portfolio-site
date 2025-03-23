import { NextRequest, NextResponse } from 'next/server';
import { getProjectsFromBlob } from '@/utils/blobStorage';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get('refresh') === 'true';
    
    // Log fetching status
    console.log(`API: Fetching projects${forceRefresh ? ' (forced refresh)' : ''}`);
    
    // Use our utility function to get projects
    const projectsArray = await getProjectsFromBlob(forceRefresh);
    
    console.log('API: Number of projects:', projectsArray.length);
    
    // Return the data with CORS headers
    return new NextResponse(JSON.stringify(projectsArray), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('API: Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
