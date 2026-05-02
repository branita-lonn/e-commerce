// file: lib/cloudinary-blur.ts
// purpose: Generate blurDataUrl for Cloudinary images

export async function generateBlurDataUrl(cloudinaryUrl: string): Promise<string | null> {
  if (!cloudinaryUrl.includes('res.cloudinary.com')) {
    return null; // Not a Cloudinary URL
  }

  // Insert e_blur:1000,q_1,f_auto into the transformation path
  // Cloudinary URLs look like: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/public_id.jpg
  // We want: https://res.cloudinary.com/<cloud_name>/image/upload/e_blur:1000,q_1,f_auto/v1234567890/public_id.jpg
  
  const uploadIndex = cloudinaryUrl.indexOf('/upload/');
  if (uploadIndex === -1) {
    return null;
  }

  const beforeUpload = cloudinaryUrl.substring(0, uploadIndex + 8);
  const afterUpload = cloudinaryUrl.substring(uploadIndex + 8);
  const blurUrl = `${beforeUpload}e_blur:1000,q_1,f_auto,w_100/${afterUpload}`;

  try {
    const response = await fetch(blurUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Failed to generate blurDataUrl:', error);
    return null;
  }
}
