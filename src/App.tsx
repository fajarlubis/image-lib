import { ImageUploader } from './components/ImageUploader';
import type { ProcessedImage } from './utils/imageProcessor';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzUxNDk0ODc3IiwiaWF0IjoiMTc1MTQ1MTY3NyIsIm1lbnVzIjpbeyJpZCI6MTcsIm5hbWUiOiJEYXNoYm9hcmQiLCJjb2RlIjoiZGFzaGJvYXJkIiwidXJsIjoiLyIsInBhcmVudF9pZCI6MH0seyJpZCI6MTgsIm5hbWUiOiJNYXJrZXRpbmcgXHUwMDI2IFBSIiwiY29kZSI6Im1hcmtldGluZy1hbmQtcHIiLCJ1cmwiOiIvIiwicGFyZW50X2lkIjowfSx7ImlkIjo4LCJuYW1lIjoiQXJ0aWNsZSIsImNvZGUiOiJhcnRpY2xlIiwidXJsIjoiL2FkbWluL2FydGljbGVzIiwicGFyZW50X2lkIjoxOH0seyJpZCI6MjAsIm5hbWUiOiJCYW5uZXIiLCJjb2RlIjoiYmFubmVyIiwidXJsIjoiL2FkbWluL2Jhbm5lcnMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyMSwibmFtZSI6IlBvcC11cCIsImNvZGUiOiJwb3B1cCIsInVybCI6Ii9hZG1pbi9wb3B1cHMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyMiwibmFtZSI6IkFjdGl2aXR5IiwiY29kZSI6ImFjdGl2aXR5IiwidXJsIjoiL2FkbWluL2FjdGl2aXRpZXMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyMywibmFtZSI6IlRlc3RpbW9ueSIsImNvZGUiOiJ0ZXN0aW1vbnkiLCJ1cmwiOiIvYWRtaW4vdGVzdGltb25pZXMiLCJwYXJlbnRfaWQiOjE4fSx7ImlkIjoyNCwibmFtZSI6IlByb21vdGlvbiIsImNvZGUiOiJwcm9tb3Rpb24iLCJ1cmwiOiIvYWRtaW4vcHJvbW90aW9ucyIsInBhcmVudF9pZCI6MTh9LHsiaWQiOjE5LCJuYW1lIjoiVXNlciBNYW5hZ2VtZW50IiwiY29kZSI6InVzZXItbWFuYWdlbWVudCIsInVybCI6Ii8iLCJwYXJlbnRfaWQiOjB9XSwibmFtZSI6IlN1cGVyIEFkbWluIiwidXVpZCI6ImJlOTU0YzhiLTA4ZjQtNDExNy1iNmI0LWIyYTY0ZmEwYWEwMCJ9.HbY_EI2AxyStMN0dOElznaN400JsKZLzF-QXdhuA_9M';

export default function App() {
  const handleComplete = async (results: ProcessedImage[][]) => {
    const form = new FormData();

    results.forEach((files, idx) => {
      files.forEach(({ name, blob }) => {
        form.append(`images[${idx}][${name}]`, blob);
      });
      form.append(`metadata[${idx}]`, JSON.stringify({ index: idx }));
    });

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
      const text = await res.text();
      console.log('Status:', res.status);
      console.log('Body:', text);
    } catch (err) {
      console.error('Request failed:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Image Upload Demo</h1>
      <ImageUploader multiple onComplete={handleComplete} />
    </div>
  );
}
