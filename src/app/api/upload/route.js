import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('logo');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Set the base file path
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    const originalName = file.name;
    let filePath = path.join(uploadsDir, originalName);
    let fileName = originalName;

    // Check if the file already exists and append an index if it does
    let index = 1;
    while (fs.existsSync(filePath)) {
      const nameWithoutExt = path.parse(originalName).name;
      const ext = path.extname(originalName);
      fileName = `${nameWithoutExt}-${index}${ext}`;
      filePath = path.join(uploadsDir, fileName);
      index++;
    }

    await writeFile(filePath, buffer);

    return new Response(JSON.stringify({
      message: 'Upload file success',
      file: fileName,
      path: `public/uploads/${fileName}`
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({
      message: 'Upload file failed',
      error: error.message,
    }), { status: 400 });
  }
}
