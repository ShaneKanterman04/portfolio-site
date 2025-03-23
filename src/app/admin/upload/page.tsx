'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function ProjectImageUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Project Images</h1>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setIsUploading(true);

            try {
              if (!inputFileRef.current?.files) {
                throw new Error('No file selected');
              }

              const file = inputFileRef.current.files[0];

              const response = await fetch(
                `/api/uploadImage?filename=${file.name}`,
                {
                  method: 'POST',
                  body: file,
                },
              );

              if (!response.ok) {
                throw new Error('Upload failed');
              }

              const newBlob = (await response.json()) as PutBlobResult;
              setBlob(newBlob);
            } catch (error) {
              console.error('Error uploading image:', error);
              alert('Failed to upload image. Please try again.');
            } finally {
              setIsUploading(false);
            }
          }}
          className="space-y-4"
        >
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
            <input 
              name="file" 
              ref={inputFileRef} 
              type="file" 
              accept="image/*"
              required
              className="w-full" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>

        {blob && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Image uploaded successfully!</p>
            <div className="mb-4">
              <img 
                src={blob.url} 
                alt="Uploaded preview" 
                className="max-h-40 mx-auto rounded-md shadow-sm" 
              />
            </div>
            <div className="text-sm break-all bg-white p-2 rounded border">
              <span className="font-semibold">URL:</span> 
              <a href={blob.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                {blob.url}
              </a>
            </div>
            <div className="mt-4">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(blob.url);
                  alert('URL copied to clipboard!');
                }}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded mr-2"
              >
                Copy URL
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/admin" className="text-blue-500 hover:underline">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
