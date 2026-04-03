'use client';

import { useRef } from 'react';
import { IMAGE_FILE_ACCEPT } from '@/lib/media';

export default function ImageUploadField({
  buttonLabel,
  caption,
  disabled = false,
  onSelect
}) {
  const inputRef = useRef(null);

  return (
    <div className="rounded-3xl border border-sky-100 bg-white/80 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{buttonLabel}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{caption}</p>
        </div>
        <button
          className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          Choose
        </button>
      </div>

      <input
        accept={IMAGE_FILE_ACCEPT}
        className="hidden"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];

          if (selectedFile) {
            onSelect?.(selectedFile);
          }

          event.target.value = '';
        }}
        ref={inputRef}
        type="file"
      />
    </div>
  );
}
