import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';
import path from 'path';
import fs from 'fs';
import { getProjectsFromBlob } from '@/utils/blobStorage';

export async function GET() {
  try {
    // Get projects from blob
    const blobProjects = await getProjectsFromBlob();
    
    // Try to get local projects
    let localProjects = [];
    try {
      const dataFilePath = path.join(process.cwd(), 'data', 'projects.json');
      if (fs.existsSync(dataFilePath)) {
        const fileContents = fs.readFileSync(dataFilePath, 'utf8');
        localProjects = JSON.parse(fileContents);
      }
    } catch (e) {
      console.error('Error reading local projects:', e);
    }
    
    // List all blobs to debug what's available
    const { blobs } = await list();
    
    return NextResponse.json({
      success: true,
      blobProjects: {
        count: blobProjects.length,
        data: blobProjects
      },
      localProjects: {
        count: localProjects.length,
        data: localProjects
      },
      blobs: blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      })),
      environment: {
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        blobName: process.env.PROJECTS_BLOB_NAME,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      error: 'Failed to debug',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}
