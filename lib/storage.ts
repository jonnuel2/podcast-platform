export interface Episode {
  id: string;
  title: string;
  description: string;
  price: number;
  audioFile: File | null;
  audioUrl: string;
  uploadDate: string;
  listens: number;
  earnings: number;
}

const STORAGE_KEY = 'shel_podvault_episodes';

export const storage = {
  // Get all episodes
  getEpisodes(): Episode[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading episodes from localStorage:', error);
      return [];
    }
  },

  // Save episodes
  saveEpisodes(episodes: Episode[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
    } catch (error) {
      console.error('Error saving episodes to localStorage:', error);
    }
  },

  // Add a new episode
  addEpisode(episode: Episode): void {
    const episodes = this.getEpisodes();
    episodes.unshift(episode); // Add to beginning
    this.saveEpisodes(episodes);
  },

  // Delete an episode
  deleteEpisode(id: string): void {
    const episodes = this.getEpisodes();
    const filtered = episodes.filter(ep => ep.id !== id);
    this.saveEpisodes(filtered);
  },

  // Update episode stats
  updateEpisodeStats(id: string, listens: number, earnings: number): void {
    const episodes = this.getEpisodes();
    const episode = episodes.find(ep => ep.id === id);
    if (episode) {
      episode.listens = listens;
      episode.earnings = earnings;
      this.saveEpisodes(episodes);
    }
  },

  // Clear all episodes
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
};