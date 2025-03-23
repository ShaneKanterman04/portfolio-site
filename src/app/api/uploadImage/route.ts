import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Generate a unique filename to prevent overwrites
    const uniqueFilename = `projects/${Date.now()}-${filename}`;
    
    // Read request body as blob
    const blob = await request.blob();
    
    // Upload to Vercel Blob (note: don't use request.body directly, it might be consumed)
    const result = await put(uniqueFilename, blob, {
      access: 'public',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
