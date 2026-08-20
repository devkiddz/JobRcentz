import { NextResponse } from 'next/server';
import { requireAuth } from '@/server/auth/requireAuth';
import cloudinary from '@/server/lib/cloudinary';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function uploadBuffer(buffer: Buffer, originalName: string) {
  return new Promise<{ secure_url: string; public_id: string; resource_type: string; bytes: number; format?: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'jobrcentz/messages', resource_type: 'auto', use_filename: true, unique_filename: true },
      (error, result) => {
        if (error || !result?.secure_url || !result.public_id) {
          reject(error ?? new Error('Cloudinary upload failed.'));
          return;
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          bytes: result.bytes,
          format: result.format
        });
      }
    );
    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file was provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Files must be 10 MB or smaller.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadBuffer(buffer, file.name);

    return NextResponse.json({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      fileName: file.name,
      mimeType: file.type || null,
      size: uploaded.bytes,
      resourceType: uploaded.resource_type
    });
  } catch (error) {
    console.error('message upload failed', error);
    return NextResponse.json({ error: 'Unable to upload the file.' }, { status: 500 });
  }
}
