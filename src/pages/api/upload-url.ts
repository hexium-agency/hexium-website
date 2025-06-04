import { generatePresignedUrl } from '@/utils/s3';
import type { APIRoute } from 'astro';

export const prerender = false;

function jsonResponse(success: boolean, data?: any, message?: string) {
  return new Response(JSON.stringify({ success, data, message }), {
    status: success ? 200 : 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

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
