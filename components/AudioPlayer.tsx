"use client";

import { useEffect, useRef, useState } from "react";

interface Episode {
  id: string | number;
  title: string;
  audioUrl: string;
}

export function AudioPlayer({
  episode,
  onClose,
}: {
  episode: Episode;
  onClose: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Load and play audio when episode changes
  useEffect(() => {
    if (audioRef.current && episode.audioUrl) {
      // Proxy the Shelby URL through our API to handle CORS
      const proxyUrl = `/api/proxy-audio?url=${encodeURIComponent(episode.audioUrl)}`;
      audioRef.current.src = proxyUrl;
      audioRef.current.load();
      
      // Auto-play after loading
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
          console.error('Playback error:', error);
          // Silently fail - the audio might still load
      });
    }
  }, [episode.audioUrl]);

  // Update time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-2xl z-50">
      <audio ref={audioRef} />

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top row: Title and Close */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-xs text-orange-100 mb-1">🎙️ Now Playing</div>
            <div className="font-bold text-lg">{episode.title}</div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-200 text-2xl font-bold px-3"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-orange-300 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, white 0%, white ${
                (currentTime / duration) * 100
              }%, rgba(255,255,255,0.3) ${
                (currentTime / duration) * 100
              }%, rgba(255,255,255,0.3) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-orange-100 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Left: Skip buttons + Play/Pause */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => skip(-10)}
              className="bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-all"
            >
              ⏪
            </button>
            <button
              onClick={togglePlay}
              className="bg-white text-orange-600 rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold hover:scale-110 transition-all shadow-lg"
            >
              {isPlaying ? "⏸" : "▶️"}
            </button>
            <button
              onClick={() => skip(10)}
              className="bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-all"
            >
              ⏩
            </button>
          </div>

          {/* Right: Volume */}
          <div className="flex items-center gap-2">
            <span className="text-sm">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-orange-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}