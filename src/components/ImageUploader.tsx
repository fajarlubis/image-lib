import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import { processFiles } from '../utils/imageProcessor';
import type { SizeOption, ProcessedImage } from '../utils/imageProcessor';
import './ImageUploader.css';

export interface ImageUploaderProps {
  multiple?: boolean;
  process?: boolean;
  sizes?: SizeOption[];
  className?: string;
  style?: React.CSSProperties;
  onComplete?: (results: ProcessedImage[][]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  multiple,
  process = true,
  sizes = [
    { width: 1200, name: 'desktop' },
    { width: 720, name: 'mobile' },
    { width: 200, name: 'thumb' },
  ],
  className,
  style,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const controller = useRef<AbortController | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setPreviews(files.map((f) => URL.createObjectURL(f)));
    controller.current = new AbortController();

    const results = await processFiles(files, {
      process,
      sizes,
      signal: controller.current.signal,
      onProgress: setProgress,
    });

    onComplete?.(results);
  };

  const handleCancel = () => {
    controller.current?.abort();
    setProgress(0);
  };

  return (
    <div className={classNames('image-uploader', className)} style={style}>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        multiple={multiple}
      />
      {progress > 0 && progress < 100 && (
        <div className="progress">{progress}%</div>
      )}
      {progress > 0 && progress < 100 && (
        <button onClick={handleCancel}>Cancel</button>
      )}
      <div className="preview-list">
        {previews.map((src) => (
          <img key={src} src={src} className="preview" />
        ))}
      </div>
    </div>
  );
};
