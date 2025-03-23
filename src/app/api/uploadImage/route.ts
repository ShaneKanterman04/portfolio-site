import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const file = await request.blob();
    
    // Get the file name from the URL params or generate one
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename') || `image-${Date.now()}`;
    
    // Validate the file type (optional)
    const contentType = file.type;
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true, // Add random suffix to avoid name conflicts
    });
    
    // Return the result
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Set the maximum file size (optional)
export const config = {
  api: {
    bodyParser: false,
  },
};
