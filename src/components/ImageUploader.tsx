import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import { processFiles } from '../utils/imageProcessor';
import type { SizeOption, ProcessedImage } from '../utils/imageProcessor';
import './ImageUploader.css';

export type UploadStatus = 'progress' | 'success' | 'failed';

export interface ImageUploaderProps {
  multiple?: boolean;
  process?: boolean;
  includeOriginal?: boolean;
  sizes?: SizeOption[];
  className?: string;
  style?: React.CSSProperties;
  onComplete?: (results: ProcessedImage[][]) => void;
  onRetry?: (index: number, files: ProcessedImage[]) => void;
  statuses?: UploadStatus[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  multiple,
  process = true,
  includeOriginal = false,
  sizes = [
    { width: 200, name: 'thumb' },
    { width: 720, name: 'mobile' },
    { width: 1024, name: 'tablet' },
    { width: 1440, name: 'desktop' },
    { width: 1920, name: 'hd' },
  ],
  className,
  style,
  onComplete,
  onRetry,
  statuses = [],
}) => {
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<string[]>([]);
  const resultsRef = useRef<ProcessedImage[][]>([]);
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
    const updated = multiple ? [...resultsRef.current, ...results] : results;
    resultsRef.current = updated;
    onComplete?.(results);
    setProgress(0);
    e.target.value = '';
  };

  const handleCancel = () => {
    controller.current?.abort();
    setProgress(0);
  };

  const handleRetry = (index: number) => {
    const files = resultsRef.current[index];
    onRetry?.(index, files);
  };

  const handleRemove = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    resultsRef.current = resultsRef.current.filter((_, i) => i !== index);
    onComplete?.(resultsRef.current);
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
            {statuses[i] && (
              <div className={classNames('status-overlay', statuses[i])}>
                <span className="label-text">
                  {statuses[i] === 'progress'
                    ? 'Uploading...'
                    : statuses[i] === 'success'
                    ? 'Uploaded'
                    : 'Failed'}
                </span>
                {statuses[i] === 'failed' && (
                  <button
                    className="retry-btn"
                    onClick={() => handleRetry(i)}
                  >
                    Retry
                  </button>
                )}
              </div>
            )}
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
