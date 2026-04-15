"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";

export default function BrowsePodcasts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Mock podcast data
  const podcasts = [
    {
      id: 1,
      title: "Tech Talks Daily",
      creator: "Sarah Johnson",
      category: "Technology",
      episodes: 45,
      price: 0.02,
      listeners: 1250,
      coverColor: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "The Crypto Corner",
      creator: "Mike Chen",
      category: "Finance",
      episodes: 32,
      price: 0.03,
      listeners: 890,
      coverColor: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "History Uncovered",
      creator: "Dr. Emily Roberts",
      category: "Education",
      episodes: 78,
      price: 0.01,
      listeners: 2100,
      coverColor: "from-orange-500 to-red-600"
    },
    {
      id: 4,
      title: "Mindful Living",
      creator: "Alex Martinez",
      category: "Health",
      episodes: 56,
      price: 0.015,
      listeners: 1650,
      coverColor: "from-pink-500 to-rose-600"
    },
    {
      id: 5,
      title: "Comedy Central Pod",
      creator: "Jamie Lee",
      category: "Comedy",
      episodes: 120,
      price: 0.025,
      listeners: 3200,
      coverColor: "from-yellow-500 to-orange-600"
    },
    {
      id: 6,
      title: "News Hour Analysis",
      creator: "Robert Thompson",
      category: "News",
      episodes: 203,
      price: 0.02,
      listeners: 5400,
      coverColor: "from-indigo-500 to-blue-600"
    }
  ];

  const categories = ["All", "Technology", "Finance", "Education", "Health", "Comedy", "News"];

  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         podcast.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || podcast.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          Showing <span className="font-bold text-orange-600">{filteredPodcasts.length}</span> podcasts
        </p>

        {/* Podcast Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-orange-500"
            >
              {/* Cover Art */}
              <div className={`h-48 bg-gradient-to-br ${podcast.coverColor} flex items-center justify-center`}>
                <div className="text-white text-center">
                  <div className="text-6xl mb-2">🎙️</div>
                  <div className="text-2xl font-bold px-4">{podcast.title}</div>
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
                    <p className="text-sm text-gray-500">{podcast.category}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center bg-orange-50 rounded-lg py-2">
                    <div className="text-sm text-gray-600">Episodes</div>
                    <div className="font-bold text-gray-800">{podcast.episodes}</div>
                  </div>
                  <div className="text-center bg-red-50 rounded-lg py-2">
                    <div className="text-sm text-gray-600">Listeners</div>
                    <div className="font-bold text-gray-800">{podcast.listeners}</div>
                  </div>
                  <div className="text-center bg-green-50 rounded-lg py-2">
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="font-bold text-gray-800">{podcast.price} APT</div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all">
                  View Episodes →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPodcasts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No podcasts found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
}