# Portfolio Site

## Image Configuration

This project uses Next.js Image component with Vercel Blob Storage. The storage domain has been configured in `next.config.js`:

```js
// In next.config.js
images: {
  domains: [
    'sp81igolvtunzwsc.public.blob.vercel-storage.com'
  ],
},
```

## Environment Variables

This project uses the following environment variables from `.env.local`:

```
ADMIN_PASS=admin
BLOB_READ_WRITE_TOKEN=your_blob_token
BLOB_STORE_BASE_URL=https://sp81igolvtunzwsc.public.blob.vercel-storage.com
PROJECTS_BLOB_KEY=projects-tkvDlttRU3x0uJAwDvs7QsLsjFmcmV.json
PROJECTS_BLOB_URL=https://sp81igolvtunzwsc.public.blob.vercel-storage.com/projects-tkvDlttRU3x0uJAwDvs7QsLsjFmcmV.json
```

For production, copy these values to your Vercel project settings under Environment Variables.