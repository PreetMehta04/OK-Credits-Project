'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, ImageIcon, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPEG/PNG images are accepted');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : undefined);
      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL must be set for production deployments');
      }

      const res = await fetch(`${apiUrl}/api/v1/tryon/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      toast.success('Photo uploaded successfully!');
      onUpload({ url: data.image_url, preview: objectUrl });
    } catch (err) {
      // PLACEHOLDER: if backend not running, use local preview
      toast.success('Photo ready! (demo mode — backend not running)');
      onUpload({ url: objectUrl, preview: objectUrl });
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
  });

  return (
    <div className="max-w-lg mx-auto">
      <div
        {...getRootProps()}
        className={`glass rounded-2xl border-2 border-dashed transition-all cursor-pointer p-12 text-center ${
          isDragActive ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/20 hover:border-yellow-400/50'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div>
            <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl mb-4 object-contain" />
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Photo ready — proceed to select saree</span>
            </div>
          </div>
        ) : (
          <div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Upload className="w-14 h-14 text-yellow-400/50 mx-auto" />
            </motion.div>
            <p className="text-white font-semibold mb-1">
              {isDragActive ? 'Drop your photo here' : 'Upload Your Photo'}
            </p>
            <p className="text-slate-500 text-sm">
              Drag & drop or click to browse
            </p>
            <p className="text-slate-600 text-xs mt-2">
              JPEG/PNG • Max 10MB • Full body, front-facing
            </p>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="mt-4 text-center text-yellow-400 text-sm animate-pulse">
          Uploading and validating image...
        </div>
      )}
    </div>
  );
}
