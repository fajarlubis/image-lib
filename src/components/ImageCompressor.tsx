import React, { useState } from 'react';
import { compressImage } from '../utils/imageProcessor';

interface ImageCompressorProps {
  sizes?: { width: number; name: string }[];
  uploadUrl: string;
  className?: string;
  style?: React.CSSProperties;
  onSuccess?: (responses: Response[]) => void;
  onError?: (error: unknown) => void;
}

export const ImageCompressor: React.FC<ImageCompressorProps> = ({
  sizes = [
    { width: 1200, name: 'desktop' },
    { width: 720, name: 'mobile' },
    { width: 200, name: 'thumb' },
  ],
  uploadUrl,
  className,
  style,
  onSuccess,
  onError,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const compressed = await compressImage(file, sizes);

      const responses: Response[] = [];
      for (const item of compressed) {
        const form = new FormData();
        form.append('image', item.blob, `${item.name}.webp`);

        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: form,
        });
        responses.push(res);
      }

      onSuccess?.(responses);
    } catch (err) {
      onError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className} style={style}>
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && <img src={preview} alt="Preview" style={{ maxWidth: '100%', marginTop: 10 }} />}
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};
