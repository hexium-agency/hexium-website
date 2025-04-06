import { ObjectCannedACL, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const AWS_REGION = import.meta.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = import.meta.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = import.meta.env.AWS_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME = import.meta.env.S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Get the S3 URL for a file
 * @param key The S3 object key
 * @returns The full S3 URL
 */
function getS3Url(key: string): string {
  return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Upload a file to S3
 * @param file The file to upload
 * @param fileName The name of the file
 * @returns The URL of the uploaded file
 */
async function uploadFileToS3(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const fileType = file.type;
  const key = `uploads/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: fileType,
    ACL: 'public-read' as ObjectCannedACL,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return getS3Url(key);
}

/**
 * Generate a presigned URL for uploading a file to S3
 * @param fileName The name of the file
 * @param fileType The MIME type of the file
 * @returns The presigned URL and the file URL
 */
export async function generatePresignedUrl(
  fileName: string,
  fileType: string
): Promise<{ presignedUrl: string; fileUrl: string }> {
  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET_NAME) {
    throw new Error('Missing required AWS environment variables.');
  }

  const key = `${Date.now()}-${fileName}`;

  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    ACL: 'public-read' as ObjectCannedACL,
  };

  const command = new PutObjectCommand(params);
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  const fileUrl = getS3Url(key);

  return { presignedUrl, fileUrl };
}

/**
 * Upload multiple files to S3
 * @param files Array of files to upload
 * @returns Array of URLs of the uploaded files
 */
export async function uploadMultipleFilesToS3(files: File[]): Promise<string[]> {
  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !S3_BUCKET_NAME) {
    throw new Error('Missing required AWS environment variables.');
  }

  const uploadPromises = files.map((file) => uploadFileToS3(file));
  return Promise.all(uploadPromises);
}
