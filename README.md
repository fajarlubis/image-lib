# Image Upload Library

This project provides a React component for uploading and processing images in the browser. Images can be optionally converted to WebP using WebAssembly via `@squoosh/lib` and resized into multiple versions (e.g. desktop, mobile and thumbnail).

## Usage

```tsx
import { ImageUploader } from 'image-lib';

<ImageUploader
  multiple
  process
  onComplete={(images) => console.log(images)}
/>;
```

The `onComplete` callback receives the processed image blobs so you can handle the actual upload.

Run `npm run dev` to start the demo application.
