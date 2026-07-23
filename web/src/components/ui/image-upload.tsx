'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
  className?: string
}

export function ImageUpload({ value, onChange, bucket = 'images', className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Upload failed')

      onChange(data.url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />

      {value ? (
        <div className="relative group w-full h-32 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()} className="rounded-lg text-xs">
              <Upload className="h-3 w-3 mr-1" /> Change
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onChange('')} className="rounded-lg text-xs">
              <X className="h-3 w-3 mr-1" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 hover:border-accent-red/40 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs">Click to upload image</span>
              <span className="text-[10px]">JPEG, PNG, WebP · Max 5MB</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
