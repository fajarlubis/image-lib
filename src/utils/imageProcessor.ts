import { ImagePool } from '@squoosh/lib';

const imagePool = new ImagePool();

export interface SizeOption {
  width: number;
  name: string;
}

export interface ProcessedImage {
  name: string;
  blob: Blob;
}

export interface ProcessOptions {
  sizes?: SizeOption[];
  process?: boolean;
  signal?: AbortSignal;
  onProgress?: (percentage: number) => void;
}

async function compressImage(file: File, sizes: SizeOption[]): Promise<ProcessedImage[]> {
  const buffer = await file.arrayBuffer();
  const image = imagePool.ingestImage(buffer);

  const results: ProcessedImage[] = [];

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

export async function processFiles(files: File[], options: ProcessOptions): Promise<ProcessedImage[][]> {
  const { process = true, sizes = [], onProgress, signal } = options;
  const results: ProcessedImage[][] = [];
  const total = files.length;
  let done = 0;

  for (const file of files) {
    if (signal?.aborted) break;
    const processed = process && sizes.length
      ? await compressImage(file, sizes)
      : [{ name: file.name, blob: file }];

    results.push(processed);
    done += 1;
    onProgress?.(Math.round((done / total) * 100));
  }

  return results;
}

