"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
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

export default function BrowsePodcasts() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // Get unique podcast names for categories
  const categories = ["All", ...Array.from(new Set(episodes.map(ep => ep.podcast)))];

  const filteredEpisodes = episodes.filter((episode) => {
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         episode.podcast.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         episode.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || episode.podcast === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group episodes by podcast
  const podcastGroups = filteredEpisodes.reduce((acc, episode) => {
    if (!acc[episode.podcast]) {
      acc[episode.podcast] = [];
    }
    acc[episode.podcast].push(episode);
    return acc;
  }, {} as Record<string, Episode[]>);

  const podcasts = Object.entries(podcastGroups).map(([name, eps]) => ({
    name,
    episodes: eps,
    episodeCount: eps.length,
    avgPrice: eps.reduce((sum, ep) => sum + ep.price, 0) / eps.length,
    totalListens: eps.reduce((sum, ep) => sum + ep.listens, 0),
    creator: eps[0].creator,
  }));

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
            Discover Podcasts
          </h1>
          <p className="text-xl text-gray-600">
            Explore decentralized content. Pay per listen. Support creators directly.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600">Loading podcasts...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Search & Filter */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search podcasts or creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-lg"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
              </div>

              {/* Category Filter */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <p className="text-gray-600 mb-6">
              Showing <span className="font-bold text-orange-600">{podcasts.length}</span> podcasts
            </p>

            {/* Podcast Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {podcasts.map((podcast, idx) => (
                <div
                  key={podcast.name}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-orange-500"
                >
                  {/* Cover Art */}
                  <div className={`h-48 bg-gradient-to-br ${colorOptions[idx % 4]} flex items-center justify-center`}>
                    <div className="text-white text-center">
                      <div className="text-6xl mb-2">🎙️</div>
                      <div className="text-2xl font-bold px-4">{podcast.name}</div>
                    </div>
                  </div>

                  {/* Podcast Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        {podcast.creator.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{podcast.creator}</p>
                        <p className="text-sm text-gray-500">{podcast.name}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center bg-orange-50 rounded-lg py-2">
                        <div className="text-sm text-gray-600">Episodes</div>
                        <div className="font-bold text-gray-800">{podcast.episodeCount}</div>
                      </div>
                      <div className="text-center bg-red-50 rounded-lg py-2">
                        <div className="text-sm text-gray-600">Listens</div>
                        <div className="font-bold text-gray-800">{podcast.totalListens}</div>
                      </div>
                      <div className="text-center bg-green-50 rounded-lg py-2">
                        <div className="text-sm text-gray-600">Avg Price</div>
                        <div className="font-bold text-gray-800">{podcast.avgPrice.toFixed(2)} APT</div>
                      </div>
                    </div>

                    {/* Episodes List */}
                    <div className="mb-4 space-y-2">
                      {podcast.episodes.slice(0, 3).map(ep => (
                        <div key={ep.id} className="text-sm text-gray-700 truncate">
                          • {ep.title}
                        </div>
                      ))}
                      {podcast.episodeCount > 3 && (
                        <div className="text-xs text-gray-500">
                          +{podcast.episodeCount - 3} more episodes
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/podcast/${encodeURIComponent(podcast.name)}`}
                      className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all text-center"
                    >
                      View Episodes →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {podcasts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No podcasts found</h3>
                <p className="text-gray-600 mb-4">Be the first to upload an episode!</p>
                <Link
                  href="/creator"
                  className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Upload Episode
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}