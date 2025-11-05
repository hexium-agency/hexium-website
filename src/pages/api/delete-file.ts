import { deleteFileFromS3 } from '@/utils/s3';
import type { APIRoute } from 'astro';
import { jsonResponse } from '@/utils/api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return jsonResponse(false, null, 'fileUrl is required');
    }

    await deleteFileFromS3(fileUrl);

    return jsonResponse(true, null, 'File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    return jsonResponse(false, null, 'Failed to delete file');
  }
};
