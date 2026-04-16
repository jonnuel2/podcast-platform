"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";
import { supabase } from "@/lib/supabase";

interface Episode {
  id: string;
  title: string;
  podcast: string;
  creator: string;
  description: string;
  price: number;
  audio_url: string;
  cid: string;
  size: number;
  listens: number;
  earnings: number;
  created_at: string;
}

export default function ListenerDashboard() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Episode | null>(null);

  // Fetch uploaded episodes from Supabase
  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalEpisodes = episodes.length;
  const totalListens = episodes.reduce((sum, ep) => sum + ep.listens, 0);
  const totalEarnings = episodes.reduce((sum, ep) => sum + ep.earnings, 0);

  const colorOptions = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-pink-500 to-rose-600'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            My Library
          </h1>
          <p className="text-xl text-gray-600">
            Your uploaded episodes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                📚
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800">{totalEpisodes}</div>
                <div className="text-sm text-gray-600">Episodes Uploaded</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                👂
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800">{totalListens}</div>
                <div className="text-sm text-gray-600">Total Listens</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800">{totalEarnings.toFixed(3)} APT</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading your library...</p>
          </div>
        )}

        {/* Episodes List */}
        {!loading && episodes.length > 0 && (
          <div className="space-y-4">
            {episodes.map((episode, idx) => (
              <div
                key={episode.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="flex">
                  {/* Cover Art */}
                  <div className={`w-32 h-32 bg-gradient-to-br ${colorOptions[idx % 4]} flex items-center justify-center flex-shrink-0`}>
                    <div className="text-4xl">🎙️</div>
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {episode.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {episode.podcast} • {episode.creator}
                        </p>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {episode.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>💰 {episode.price} APT</span>
                          <span>👂 {episode.listens} listens</span>
                          <span>📅 {new Date(episode.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setCurrentlyPlaying(episode)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                      >
                        ▶ Play
                      </button>
                      <Link
                        href={`/podcast/${encodeURIComponent(episode.podcast)}`}
                        className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                      >
                        View Podcast
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && episodes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Your library is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Start uploading episodes to build your library
            </p>
            
            <Link
              href="/creator"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Upload Episode
            </Link>
          </div>
        )}
      </main>

      {/* Audio Player */}
      {currentlyPlaying && (
        <AudioPlayer
          episode={currentlyPlaying}
          onClose={() => setCurrentlyPlaying(null)}
        />
      )}
    </div>
  );
}