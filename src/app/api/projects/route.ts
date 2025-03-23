import { NextRequest, NextResponse } from 'next/server';
import { getProjectsFromBlob } from '@/utils/blobStorage';

export async function GET(request: NextRequest) {
  try {
    // Check if client is requesting a fresh load from storage
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get('refresh') === 'true';
    
    // Fetch projects from blob storage
    const projects = await getProjectsFromBlob(refresh);
    
    // Return the projects as JSON
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch projects', 
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}

const getSkillsArray = (skills: string | string[] | null | undefined) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  if (typeof skills === 'string') return skills.split(',').map(s => s.trim());
  return []; // Default return for type safety
};
