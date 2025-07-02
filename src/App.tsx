import { ImageUploader } from './components/ImageUploader';
import type { UploadStatus } from './components/ImageUploader';
import type { ProcessedImage } from './utils/imageProcessor';
import { useState } from 'react';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzUxNDk0ODc3IiwiaWF0IjoiMTc1MTQ1MTY3NyIsIm1lbnVzIjpbeyJpZCI6MTcsIm5hbWUiOiJEYXNoYm9hcmQiLCJjb2RlIjoiZGFzaGJvYXJkIiwidXJsIjoiLyIsInBhcmVudF9pZCI6MH0seyJpZCI6MTgsIm5hbWUiOiJNYXJrZXRpbmcgXHUwMDI2IFBSIiwiY29kZSI6Im1hcmtldGluZy1hbmQtcHIiLCJ1cmwiOiIvIiwicGFyZW50X2lkIjowfSx7ImlkIjo4LCJuYW1lIjoiQXJ0aWNsZSIsImNvZGUiOiJhcnRpY2xlIiwidXJsIjoiL2FkbWluL2FydGljbGVzIiwicGFyZW50X2lkIjoxOH0seyJpZCI6MjAsIm5hbWUiOiJCYW5uZXIiLCJjb2RlIjoiYmFubmVyIiwidXJsIjoiL2FkbWluL2Jhbm5lcnMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyMSwibmFtZSI6IlBvcC11cCIsImNvZGUiOiJwb3B1cCIsInVybCI6Ii9hZG1pbi9wb3B1cHMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyMiwibmFtZSI6IkFjdGl2aXR5IiwiY29kZSI6ImFjdGl2aXR5IiwidXJsIjoiL2FkbWluL2FjdGl2aXRpZXMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyMywibmFtZSI6IlRlc3RpbW9ueSIsImNvZGUiOiJ0ZXN0aW1vbnkiLCJ1cmwiOiIvYWRtaW4vdGVzdGltb25pZXMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyNCwibmFtZSI6IlByb21vdGlvbiIsImNvZGUiOiJwcm9tb3Rpb24iLCJ1cmwiOiIvYWRtaW4vcHJvbW90aW9ucyIsInBhcmVudF9pZCI6MTh9LHsiaWQiOjE5LCJuYW1lIjoiVXNlciBNYW5hZ2VtZW50IiwiY29kZSI6InVzZXItbWFuYWdlbWVudCIsInVybCI6Ii8iLCJwYXJlbnRfaWQiOjB9XSwibmFtZSI6IlN1cGVyIEFkbWluIiwidXVpZCI6ImJlOTU0YzhiLTA4ZjQtNDExNy1iNmI0LWIyYTY0ZmEwYWEwMCJ9.HbY_EI2AxyStMN0dOElznaN400JsKZLzF-QXdhuA_9M';

export default function App() {
  const [statuses, setStatuses] = useState<UploadStatus[]>([]);

  const handleComplete = async (results: ProcessedImage[][]) => {
    setStatuses(Array(results.length).fill('progress'));

    for (const [idx, files] of results.entries()) {
      const form = new FormData();
      files.forEach(({ name, blob }) => {
        form.append(`images[0][${name}]`, blob);
      });
      form.append('metadata[0]', JSON.stringify({ index: idx }));

      try {
        const res = await fetch(
          'http://localhost:8800/cms/admin/fileupload/batch',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'x-country': 'Indonesia',
              'x-token': token,
            },
            body: form,
          }
        );
        if (!res.ok) throw new Error(`Upload ${idx} failed`);
        setStatuses((prev) => prev.map((s, i) => (i === idx ? 'success' : s)));
      } catch {
        setStatuses((prev) => prev.map((s, i) => (i === idx ? 'failed' : s)));
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Image Upload Demo</h1>
      <ImageUploader multiple onComplete={handleComplete} statuses={statuses} />
    </div>
  );
}
