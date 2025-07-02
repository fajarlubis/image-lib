// Simple in-browser image processing utilities using Canvas APIs.

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
  includeOriginal?: boolean;
  signal?: AbortSignal;
  onProgress?: (percentage: number) => void;
}
    
async function compressImage(file: File, sizes: SizeOption[]): Promise<ProcessedImage[]> {
  const img = await createImageBitmap(file);
  const aspect = img.width / img.height;
  const results: ProcessedImage[] = [];

  for (const size of sizes) {
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = Math.round(size.width / aspect);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), 'image/webp')
    );
    results.push({ name: `${size.name}-${size.width}`, blob });
  }

  img.close();
  return results;
}

export async function processFiles(files: File[], options: ProcessOptions): Promise<ProcessedImage[][]> {
  const { process = true, sizes = [], includeOriginal = false, onProgress, signal } = options;
  const results: ProcessedImage[][] = [];
  const total = files.length;
  let done = 0;

  for (const file of files) {
    if (signal?.aborted) break;
    const processed: ProcessedImage[] = [];
    if (process && sizes.length) {
      processed.push(...(await compressImage(file, sizes)));
    }
    if (!process || includeOriginal || processed.length === 0) {
      processed.push({ name: file.name, blob: file });
    }

    results.push(processed);
    done += 1;
    onProgress?.(Math.round((done / total) * 100));
  }

  return results;
}

