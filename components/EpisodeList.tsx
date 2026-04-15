"use client";

import { useState, useEffect } from "react";

interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  uploadDate: string;
  listens: number;
  earnings: number;
}

export function EpisodeList({ onPlay }: { onPlay: (episode: Episode) => void }) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  // Load episodes from localStorage
  useEffect(() => {
    const loadEpisodes = () => {
      const stored = localStorage.getItem('episodes');
      if (stored) {
        const parsed = JSON.parse(stored);
        setEpisodes(parsed);
      }
    };

    loadEpisodes();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this episode?")) {
      const updated = episodes.filter(ep => ep.id !== id);
      setEpisodes(updated);
      localStorage.setItem('episodes', JSON.stringify(updated));
    }
  };

  if (episodes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No episodes yet. Upload your first episode above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {episodes.map((episode) => (
        <div
          key={episode.id}
          className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {episode.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{episode.description}</p>
              <div className="flex gap-6 text-sm text-gray-500">
                <span>👂 {episode.listens} listens</span>
                <span>💰 {episode.earnings.toFixed(3)} APT earned</span>
                <span>📅 {new Date(episode.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onPlay(episode)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              ▶️ Play
            </button>
            <button
              onClick={() => handleDelete(episode.id)}
              className="bg-red-100 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-200 transition-all"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}