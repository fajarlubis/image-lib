import { ImageUploader } from './components/ImageUploader';

export default function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Image Upload Demo</h1>
      <ImageUploader multiple onComplete={(r) => console.log(r)} />
    </div>
  );
}
