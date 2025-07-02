import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import { processFiles } from '../utils/imageProcessor';
import type { SizeOption, ProcessedImage } from '../utils/imageProcessor';
import './ImageUploader.css';

export interface ImageUploaderProps {
  multiple?: boolean;
  process?: boolean;
  includeOriginal?: boolean;
  sizes?: SizeOption[];
  className?: string;
  style?: React.CSSProperties;
  onComplete?: (results: ProcessedImage[][]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  multiple,
  process = true,
  includeOriginal = false,
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
  const [, setResultsState] = useState<ProcessedImage[][]>([]);
  const controller = useRef<AbortController | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setPreviews((prev) =>
      multiple ? [...prev, ...files.map((f) => URL.createObjectURL(f))] : files.map((f) => URL.createObjectURL(f))
    );
    controller.current = new AbortController();

    const results = await processFiles(files, {
      process,
      includeOriginal,
      sizes,
      signal: controller.current.signal,
      onProgress: setProgress,
    });
    setResultsState((prev) => {
      const updated = multiple ? [...prev, ...results] : results;
      onComplete?.(updated);
      return updated;
    });
    setProgress(0);
    e.target.value = '';
  };

  const handleCancel = () => {
    controller.current?.abort();
    setProgress(0);
  };

  const handleRemove = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setResultsState((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onComplete?.(updated);
      return updated;
    });
  };

  return (
    <div className={classNames('image-uploader', className)} style={style}>
      <div className="preview-list">
        {(multiple || previews.length === 0) && (
          <label className="upload-btn">
            <span className="upload-icon">+</span>
            <span>Choose Files</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              multiple={multiple}
            />
          </label>
        )}
        {previews.map((src, i) => (
          <div key={src} className="preview-container">
            <img src={src} className="preview" />
            <button className="remove-btn" onClick={() => handleRemove(i)}>
              ×
            </button>
          </div>
        ))}
      </div>
      {progress > 0 && progress < 100 && (
        <div className="upload-status">
          <div className="progress">{progress}%</div>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
