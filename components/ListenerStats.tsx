"use client";

import { useState } from "react";

interface Listener {
  id: string;
  walletAddress: string;
  episodeTitle: string;
  listenedAt: string;
  amountPaid: string;
  totalListens: number;
}

export function ListenerStats() {
  // Fake data for demo - will be replaced with real blockchain data later
  const [listeners] = useState<Listener[]>([
    {
      id: "1",
      walletAddress: "0x742d35...8a9f",
      episodeTitle: "Episode 1: Introduction to Shelby",
      listenedAt: "2026-04-12 14:30",
      amountPaid: "0.01",
      totalListens: 5
    },
    {
      id: "2",
      walletAddress: "0x8f3c21...4b2e",
      episodeTitle: "Episode 2: Building on Aptos",
      listenedAt: "2026-04-12 13:15",
      amountPaid: "0.02",
      totalListens: 3
    },
    {
      id: "3",
      walletAddress: "0x742d35...8a9f",
      episodeTitle: "Episode 2: Building on Aptos",
      listenedAt: "2026-04-11 16:45",
      amountPaid: "0.02",
      totalListens: 5
    },
    {
      id: "4",
      walletAddress: "0xa1b2c3...d4e5",
      episodeTitle: "Episode 1: Introduction to Shelby",
      listenedAt: "2026-04-11 10:20",
      amountPaid: "0.01",
      totalListens: 1
    }
  ]);

  // Get unique listeners with their total stats
  const uniqueListeners = Array.from(
    listeners.reduce((map, listener) => {
      const existing = map.get(listener.walletAddress);
      if (existing) {
        existing.totalListens += 1;
        existing.totalSpent = (parseFloat(existing.totalSpent) + parseFloat(listener.amountPaid)).toFixed(2);
      } else {
        map.set(listener.walletAddress, {
          walletAddress: listener.walletAddress,
          totalListens: 1,
          totalSpent: listener.amountPaid,
          lastListened: listener.listenedAt
        });
      }
      return map;
    }, new Map()).values()
  );

  // Sort by total spent (top fans)
  const topFans = [...uniqueListeners].sort((a, b) => parseFloat(b.totalSpent) - parseFloat(a.totalSpent));

  if (listeners.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No listeners yet.</p>
        <p className="text-sm mt-2">Share your episodes to get your first listener!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Fans Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">🌟 Top Fans</h3>
        <div className="space-y-2">
          {topFans.slice(0, 3).map((fan, index) => (
            <div key={fan.walletAddress} className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
                <div>
                  <p className="font-mono text-sm font-semibold">{fan.walletAddress}</p>
                  <p className="text-xs text-gray-500">{fan.totalListens} listens</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{fan.totalSpent} APT</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-semibold text-lg mb-3">📊 Recent Activity</h3>
        <div className="space-y-3">
          {listeners.map((listener) => (
            <div
              key={listener.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-semibold">
                      {listener.walletAddress}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {listener.totalListens} total listens
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Listened to: <span className="font-medium">{listener.episodeTitle}</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>🕐 {listener.listenedAt}</span>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-green-600">
                    +{listener.amountPaid} APT
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{uniqueListeners.length}</p>
            <p className="text-sm text-gray-600">Unique Listeners</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{listeners.length}</p>
            <p className="text-sm text-gray-600">Total Listens</p>
          </div>
        </div>
      </div>
    </div>
  );
}