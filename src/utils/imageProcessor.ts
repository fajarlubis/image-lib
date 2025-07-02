import { ImagePool } from '@squoosh/lib';

const imagePool = new ImagePool();

export async function compressImage(
  file: File,
  sizes: { width: number; name: string }[]
) {
  const buffer = await file.arrayBuffer();
  const image = imagePool.ingestImage(buffer);

  const results: { name: string; blob: Blob }[] = [];

  for (const size of sizes) {
    await image.preprocess({ resize: { width: size.width } });
    await image.encode({ webp: {} });

    const webp = await image.encodedWith.webp;
    results.push({
      name: size.name,
      blob: new Blob([webp.binary], { type: 'image/webp' }),
    });
  }

  return results;
}
