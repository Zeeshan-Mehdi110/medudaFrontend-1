import { Area } from 'react-easy-crop/types';

export default async function getCroppedImg(imageSrc: string, crop: Area, aspect: number): Promise<string> {
  const image = new Image();
  image.src = imageSrc;

  await new Promise<void>((resolve) => {
    image.onload = () => resolve();
  });

  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  }

  return canvas.toDataURL('image/jpeg', 1.0);
}
