"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PodcastUploader } from "@/components/PodcastUploader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { supabase } from "@/lib/supabase";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

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

export default function CreatorPage() {
  const { account } = useWallet();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  // Fetch episodes from Supabase
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

  const handlePlay = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  const handleClose = () => {
    setCurrentEpisode(null);
  };

  const handleDelete = async (id: string, episodeCreator: string) => {
    // Check if user owns this episode
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    if (String(account.address).toLowerCase() !== episodeCreator.toLowerCase()) {
      alert("You can only delete your own episodes!");
      return;
    }

    if (!confirm("Are you sure you want to delete this episode?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('episodes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setEpisodes(episodes.filter(ep => ep.id !== id));
      alert('Episode deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting episode:', error);
      alert(`Failed to delete episode: ${error.message}`);
    }
  };

  const handleUploadSuccess = () => {
    // Refresh episodes after successful upload
    fetchEpisodes();
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
          <PodcastUploader onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Episodes Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            🎙️ All Episodes
          </h2>
          
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Loading episodes...
            </div>
          ) : episodes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No episodes yet. Upload your first episode above!
            </div>
          ) : (
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
                      <p className="text-sm text-gray-600 mb-2">
                        Podcast: {episode.podcast}
                      </p>
                      <p className="text-gray-600 text-sm mb-4">{episode.description}</p>
                      <div className="flex gap-6 text-sm text-gray-500">
                        <span>💰 {episode.price} APT</span>
                        <span>👂 {episode.listens} listens</span>
                        <span>📅 {new Date(episode.created_at).toLocaleDateString()}</span>
                        <span className="text-blue-600">
                          👤 {episode.creator.substring(0, 6)}...{episode.creator.substring(episode.creator.length - 4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handlePlay(episode)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      ▶️ Play
                    </button>
                    {account && episode.creator.toLowerCase() === String(account.address).toLowerCase() && (
                      <button
                        onClick={() => handleDelete(episode.id, episode.creator)}
                        className="bg-red-100 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-200 transition-all"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Audio Player */}
      {currentEpisode && (
        <AudioPlayer episode={currentEpisode} onClose={handleClose} />
      )}
    </div>
  );
}