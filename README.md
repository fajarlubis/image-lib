# Image Upload Library

This project provides a React component for uploading and processing images directly in the browser. Images can be optionally converted to WebP and resized into multiple versions such as `hd` (1920px), `desktop` (1440px), `tablet` (1024px), `mobile` (720px) and `thumb` (200px).

## Usage

```tsx
import { ImageUploader } from 'image-lib';

<ImageUploader
  multiple
  process
  includeOriginal={false}
  onComplete={(images) => console.log(images)}
/>;
```

Set `multiple` to allow selecting more than one image. When enabled you can pick
additional files at any time and they are appended to the list instead of
replacing the previous selection. Use `includeOriginal` if you need the original
file alongside processed versions.
Each resized image is returned with a name that includes the label and width (e.g. `mobile-720`).

The `onComplete` callback receives the processed image blobs so you can handle
the actual upload. Thumbnails are displayed with a small remove button and the
file picker stays on the left so you can add more images. If the container has a
fixed height the list becomes vertically scrollable.

Run `npm run dev` to start the demo application.
