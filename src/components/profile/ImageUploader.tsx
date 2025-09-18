import React from 'react';
type Props = { onSelect: (file: File) => void; };
export default function ImageUploader({ onSelect }: Props) {
  const [preview, setPreview] = React.useState<string | null>(null);
  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setPreview(URL.createObjectURL(f));
    onSelect(f);
  }
  return (
    <div className="grid gap-2">
      <input type="file" accept="image/*" onChange={handle} />
      {preview && <img src={preview} alt="preview" className="max-h-40 object-cover rounded" />}
    </div>
  );
}
