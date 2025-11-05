import { generatePresignedUrl } from '@/utils/s3';
import type { APIRoute } from 'astro';
import { jsonResponse } from '@/utils/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return jsonResponse(false, null, 'fileName and fileType are required');
    }

    // Generate a unique filename to avoid conflicts
    const uniqueFileName = `uploads/${Date.now()}-${fileName}`;

    const { presignedUrl, fileUrl } = await generatePresignedUrl(uniqueFileName, fileType);

    return jsonResponse(true, { presignedUrl, fileUrl });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return jsonResponse(false, null, 'Failed to generate upload URL');
  }
};
