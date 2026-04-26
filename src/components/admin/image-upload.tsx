"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (url: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);
      }

      onChange([...value, ...newUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#e9e9e9] group bg-white shadow-sm transition-all hover:shadow-md">
            <img draggable={false} src={url} alt="Product" className="w-full h-full object-cover" />
            <button
              onClick={() => onRemove(url)}
              className="absolute top-1 right-1 p-1 bg-white/90 text-[#ef4444] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-[#e9e9e9] flex flex-col items-center justify-center gap-1 text-[#9eaab7] hover:border-[#f7bf33] hover:text-[#f7bf33] transition-all bg-white hover:bg-[#faf9f7] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Upload size={20} />
              <span className="text-[10px] font-medium uppercase tracking-wider text-center px-1">Ajouter</span>
            </>
          )}
        </button>
      </div>
      
      <input
        type="file"
        multiple
        className="hidden"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleUpload}
      />
      
      <p className="text-[11px] text-[#9eaab7]">
        Extensions autorisées: JPG, PNG, WEBP. Plusieurs photos permises.
      </p>
    </div>
  );
}
