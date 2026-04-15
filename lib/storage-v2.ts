import { uploadToShelby, getShelbyUrl } from './shelby/client';

export interface Episode {
  id: string;
  title: string;
  description: string;
  price: number;
  audioFile: File | null;
  audioUrl: string;
  cid?: string; // Shelby Content ID (when using real storage)
  uploadDate: string;
  listens: number;
  earnings: number;
  storageType: 'localStorage' | 'shelby';
}

const STORAGE_KEY = 'shel_podvault_episodes_v2';

export const storageV2 = {
  // Upload episode with smart storage selection
  async uploadEpisode(
    title: string,
    description: string,
    price: number,
    audioFile: File
  ): Promise<Episode> {
    const useShelby = !!process.env.NEXT_PUBLIC_SHELBY_API_KEY;
    
    let audioUrl = '';
    let cid: string | undefined;
    let storageType: 'localStorage' | 'shelby' = 'localStorage';

    if (useShelby) {
      // Upload to Shelby (production mode)
      try {
        const result = await uploadToShelby(audioFile);
        audioUrl = result.url;
        cid = result.cid;
        storageType = 'shelby';
        console.log('✅ Uploaded to Shelby:', cid);
      } catch (error) {
        console.error('Shelby upload failed, falling back to localStorage');
        audioUrl = await fileToBase64(audioFile);
      }
    } else {
      // Use localStorage (demo mode)
      audioUrl = await fileToBase64(audioFile);
      console.log('📦 Saved to localStorage (demo mode)');
    }

    const episode: Episode = {
      id: Date.now().toString(),
      title,
      description,
      price,
      audioFile: null,
      audioUrl,
      cid,
      uploadDate: new Date().toISOString(),
      listens: 0,
      earnings: 0,
      storageType,
    };

    // Save metadata to localStorage
    const episodes = this.getEpisodes();
    episodes.unshift(episode);
    this.saveEpisodes(episodes);

    return episode;
  },

  // Get all episodes
  getEpisodes(): Episode[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading episodes:', error);
      return [];
    }
  },

  // Save episodes metadata
  saveEpisodes(episodes: Episode[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
    } catch (error) {
      console.error('Error saving episodes:', error);
    }
  },

  // Delete episode
  async deleteEpisode(id: string): Promise<void> {
    const episodes = this.getEpisodes();
    const episode = episodes.find(ep => ep.id === id);
    
    // If stored on Shelby, delete from there too
    if (episode?.cid && episode.storageType === 'shelby') {
      const { deleteFromShelby } = await import('./shelby/client');
      await deleteFromShelby(episode.cid);
    }
    
    const filtered = episodes.filter(ep => ep.id !== id);
    this.saveEpisodes(filtered);
  },

  // Get audio URL (handles both localStorage and Shelby)
  getAudioUrl(episode: Episode): string {
    if (episode.storageType === 'shelby' && episode.cid) {
      return getShelbyUrl(episode.cid);
    }
    return episode.audioUrl;
  }
};

// Helper: Convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}