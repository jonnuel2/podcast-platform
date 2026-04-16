"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { AudioPlayer } from "@/components/AudioPlayer";
import Link from "next/link";

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

export default function PodcastDetailPage() {
  const params = useParams();
  const podcastName = decodeURIComponent(params.slug as string);
  
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    fetchEpisodes();
  }, [podcastName]);

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('podcast', podcastName)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
        <Navbar />
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading episodes...</p>
        </div>
      </div>
    );
  }

  const podcast = episodes[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/browse"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold mb-6"
        >
          ← Back to Browse
        </Link>

        {/* Podcast Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Podcast Cover */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <div className="text-6xl">🎙️</div>
            </div>

            {/* Podcast Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {podcastName}
              </h1>
              <p className="text-gray-600 mb-4">by {podcast?.creator}</p>
              
              <div className="flex gap-6">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{episodes.length}</div>
                  <div className="text-sm text-gray-600">Episodes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {episodes.reduce((sum, ep) => sum + ep.listens, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Listens</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {(episodes.reduce((sum, ep) => sum + ep.price, 0) / episodes.length).toFixed(2)} APT
                  </div>
                  <div className="text-sm text-gray-600">Avg Price</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <h2 className="text-2xl font-bold mb-6">All Episodes</h2>
        
        <div className="space-y-4">
          {episodes.map((episode, idx) => (
            <div
              key={episode.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-6">
                {/* Episode Number */}
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-white text-2xl font-bold">{idx + 1}</div>
                </div>

                {/* Episode Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {episode.title}
                  </h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">
                    {episode.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>💰 {episode.price} APT</span>
                    <span>👂 {episode.listens} listens</span>
                    <span>📅 {new Date(episode.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Play Button */}
                <button
                  onClick={() => handlePlay(episode)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2"
                >
                  ▶️ Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Audio Player */}
      {currentEpisode && (
        <AudioPlayer
          episode={currentEpisode}
          onClose={() => setCurrentEpisode(null)}
        />
      )}
    </div>
  );
}