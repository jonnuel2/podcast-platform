"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AudioPlayer } from "@/components/AudioPlayer";

interface Episode {
  id: string | number;
  title: string;
  podcast: string;
  creator: string;
  duration: string;
  price: number;
  listened: boolean;
  progress: number;
  audioUrl: string;
  coverColor: string;
}

export default function ListenerDashboard() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Episode | null>(null);
  const [activeTab, setActiveTab] = useState<"library" | "history">("library");

  // Mock library data
  const library: Episode[] = [
    {
      id: 1,
      title: "Episode 45: The Future of AI",
      podcast: "Tech Talks Daily",
      creator: "Sarah Johnson",
      duration: "45:32",
      price: 0.02,
      listened: false,
      progress: 0,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      coverColor: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "Episode 33: DeFi Deep Dive",
      podcast: "The Crypto Corner",
      creator: "Mike Chen",
      duration: "52:18",
      price: 0.03,
      listened: true,
      progress: 100,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      coverColor: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "Episode 79: Ancient Rome",
      podcast: "History Uncovered",
      creator: "Dr. Emily Roberts",
      duration: "38:45",
      price: 0.01,
      listened: false,
      progress: 35,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      coverColor: "from-orange-500 to-red-600"
    }
  ];

  const history: Episode[] = [
    {
      id: 4,
      title: "Episode 121: Stand-up Comedy Tips",
      podcast: "Comedy Central Pod",
      creator: "Jamie Lee",
      duration: "28:15",
      price: 0.025,
      listened: true,
      progress: 100,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      coverColor: "from-yellow-500 to-orange-600"
    },
    {
      id: 5,
      title: "Episode 204: Breaking News Analysis",
      podcast: "News Hour Analysis",
      creator: "Robert Thompson",
      duration: "41:22",
      price: 0.02,
      listened: true,
      progress: 100,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      coverColor: "from-indigo-500 to-blue-600"
    }
  ];

  const displayedEpisodes = activeTab === "library" ? library : history;

  // Calculate stats
  const totalSpent = [...library, ...history]
    .filter(ep => ep.listened)
    .reduce((sum, ep) => sum + ep.price, 0);
  
  const totalListened = [...library, ...history].filter(ep => ep.listened).length;

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
            Your saved episodes and listening history
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
                <div className="text-3xl font-black text-gray-800">{library.length}</div>
                <div className="text-sm text-gray-600">In Library</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                ✅
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800">{totalListened}</div>
                <div className="text-sm text-gray-600">Episodes Listened</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <div className="text-3xl font-black text-gray-800">{totalSpent.toFixed(3)} APT</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "library"
                ? "text-orange-600 border-b-4 border-orange-600 -mb-0.5"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📚 My Library ({library.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "history"
                ? "text-orange-600 border-b-4 border-orange-600 -mb-0.5"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🕒 History ({history.length})
          </button>
        </div>

        {/* Episodes List */}
        <div className="space-y-4">
          {displayedEpisodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="flex">
                {/* Cover Art */}
                <div className={`w-32 h-32 bg-gradient-to-br ${episode.coverColor} flex items-center justify-center flex-shrink-0`}>
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
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>⏱️ {episode.duration}</span>
                        <span>💰 {episode.price} APT</span>
                        {episode.listened && <span className="text-green-600 font-semibold">✅ Listened</span>}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar (if in progress) */}
                  {episode.progress > 0 && episode.progress < 100 && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                          style={{ width: `${episode.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">{episode.progress}% complete</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentlyPlaying(episode)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                    >
                      {episode.progress > 0 && episode.progress < 100 ? "▶ Continue" : "▶ Play"}
                    </button>
                    {activeTab === "library" && (
                      <button className="bg-red-100 text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-200 transition-all">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {displayedEpisodes.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">
              {activeTab === "library" ? "📚" : "🕒"}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {activeTab === "library" ? "Your library is empty" : "No listening history yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "library" 
                ? "Start browsing podcasts to build your library"
                : "Listen to episodes to see them here"}
            </p>
            
             <Link
              href="/browse"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Browse Podcasts
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