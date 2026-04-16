"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { supabase } from "@/lib/supabase";

interface PodcastUploaderProps {
  onUploadSuccess?: () => void;
}

export function PodcastUploader({ onUploadSuccess }: PodcastUploaderProps) {
  const { account } = useWallet();
  const [title, setTitle] = useState("");
  const [podcast, setPodcast] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("0.01");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !podcast || !description || !category || !audioFile) {
      alert("Please fill in all fields and select an audio file");
      return;
    }

    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsUploading(true);

    try {
      let thumbnailUrl = null;

      // Upload thumbnail to Supabase Storage if provided
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, thumbnailFile);

        if (uploadError) {
          console.error('Thumbnail upload error:', uploadError);
          throw new Error('Failed to upload thumbnail');
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(fileName);

        thumbnailUrl = urlData.publicUrl;
        console.log('✅ Thumbnail uploaded:', thumbnailUrl);
      }

      console.log('Uploading via API route...');

      // Create form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('podcast', podcast);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('creator', String(account.address));
      if (thumbnailUrl) {
        formData.append('thumbnail_url', thumbnailUrl);
      }
      formData.append('file', audioFile);

      // Upload via API route (server-side)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      console.log('✅ Upload successful!', result);

      // Show success
      alert(
        `✅ Episode "${title}" uploaded successfully!\n\n` +
        `CID: ${result.cid}\n` +
        `Size: ${(audioFile.size / 1024 / 1024).toFixed(2)}MB`
      );

      // Reset form
      setTitle("");
      setPodcast("");
      setDescription("");
      setCategory("");
      setPrice("0.01");
      setAudioFile(null);
      setThumbnailFile(null);

      // Trigger callback to refresh episode list
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`❌ Upload failed!\n\n${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Wallet Connection Warning */}
      {!account && (
        <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-4">
          <p className="text-orange-700 font-semibold">
            ⚠️ Please connect your wallet to upload episodes
          </p>
        </div>
      )}

      {/* Podcast Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Podcast Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={podcast}
          onChange={(e) => setPodcast(e.target.value)}
          placeholder="e.g., Tech Talks Daily, The Crypto Corner"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
          required
        />
      </div>

      {/* Episode Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Episode Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Episode 1: Getting Started with Shelby"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your episode..."
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none resize-none"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
          required
        >
          <option value="">Select a category...</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Health & Fitness">Health & Fitness</option>
          <option value="Arts & Entertainment">Arts & Entertainment</option>
          <option value="Education">Education</option>
          <option value="News & Politics">News & Politics</option>
          <option value="Comedy">Comedy</option>
          <option value="Sports">Sports</option>
          <option value="Science">Science</option>
          <option value="Music">Music</option>
          <option value="True Crime">True Crime</option>
          <option value="Society & Culture">Society & Culture</option>
        </select>
      </div>

      {/* Thumbnail Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail Image <span className="text-gray-500">(Optional)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:font-semibold hover:file:bg-orange-600 cursor-pointer"
        />
        {thumbnailFile && (
          <div className="mt-2 flex items-center gap-4">
            <img 
              src={URL.createObjectURL(thumbnailFile)} 
              alt="Thumbnail preview" 
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <p className="text-sm text-green-600">
                ✓ Selected: {thumbnailFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(thumbnailFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price per Listen (APT)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.001"
          min="0.001"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
        />
      </div>

      {/* Audio File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Audio File <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white file:font-semibold hover:file:bg-orange-600 cursor-pointer"
          required
        />
        {audioFile && (
          <div className="mt-2">
            <p className="text-sm text-green-600">
              ✓ Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ For best results on Vercel Free plan, keep files under 4MB for now.
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isUploading || !account}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
          isUploading || !account
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl"
        }`}
      >
        {isUploading ? "🚀 Uploading..." : "📤 Upload Episode"}
      </button>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center">
        ✅ Uploading to Shelby decentralized storage
      </p>
    </form>
  );
}