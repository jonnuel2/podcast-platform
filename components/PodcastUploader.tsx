"use client";

import { useState } from "react";

export function PodcastUploader() {
  const [title, setTitle] = useState("");
  const [podcast, setPodcast] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.01");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !podcast || !description || !audioFile) {
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

      // Save episode to localStorage
      const episodes = JSON.parse(localStorage.getItem('episodes') || '[]');
      episodes.push(result.episode);
      localStorage.setItem('episodes', JSON.stringify(episodes));

      // Show success
      alert(
        `✅ Episode "${title}" uploaded to Shelby!\n\n` +
        `CID: ${result.episode.cid}\n` +
        `Size: ${(audioFile.size / 1024 / 1024).toFixed(2)}MB`
      );

      // Reset form
      setTitle("");
      setPodcast("");
      setDescription("");
      setPrice("0.01");
      setAudioFile(null);

      // Refresh page to show new episode
      window.location.reload();

    } catch (error: any) {
      console.error("Upload error:", error);
      alert(`❌ Upload failed!\n\n${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Podcast Name / Category */}
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