"use client";

import { useState } from "react";

interface PodcastUploaderProps {
  onUploadSuccess?: () => void;
}

export function PodcastUploader({ onUploadSuccess }: PodcastUploaderProps) {
  const [title, setTitle] = useState("");
  const [podcast, setPodcast] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("0.01");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !podcast || !description || !category || !audioFile) {
      alert("Please fill in all fields and select an audio file");
      return;
    }

    setIsUploading(true);

    try {
      console.log('Uploading via API route...');

      // Create form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('podcast', podcast);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
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
        disabled={isUploading}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
          isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl"
        }`}
      >
        {isUploading ? "🚀 Uploading to Shelby..." : "📤 Upload Episode"}
      </button>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center">
        ✅ Uploading to Shelby decentralized storage
      </p>
    </form>
  );
}