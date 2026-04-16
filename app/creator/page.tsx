"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PodcastUploader } from "@/components/PodcastUploader";
import { EpisodeList } from "@/components/EpisodeList";
import { AudioPlayer } from "@/components/AudioPlayer";

interface Episode {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  uploadDate: string;
  listens: number;
  earnings: number;
}

export default function CreatorPage() {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  const handlePlay = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  const handleClose = () => {
    setCurrentEpisode(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            📤 Upload New Episode
          </h1>
          <p className="text-gray-600">
            Share your content with the world. Set your own price, earn 100% of revenue.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <PodcastUploader />
        </div>

        {/* Episodes Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            🎙️ Your Episodes
          </h2>
          <EpisodeList onPlay={handlePlay} />
        </div>
      </main>

      {/* Audio Player */}
      {currentEpisode && (
        <AudioPlayer episode={currentEpisode} onClose={handleClose} />
      )}
    </div>
  );
}