import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const s3 = new S3Client({ region: 'auto' });

export async function uploadFile(fileBuffer: Buffer, filename: string) {
  const key = `${randomUUID()}-${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: fileBuffer
  });
  return getSignedUrl(s3, command, { expiresIn: 3600 });
}
