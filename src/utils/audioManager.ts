import { Howl } from 'howler';
import type { EmotionType } from '../components/ChooseEmotionStep';

/**
 * Audio sources for each emotion
 * Using royalty-free music URLs from reliable sources
 */
const emotionAudioSources: Record<EmotionType, string> = {
  heartfelt: 'https://cdn.pixabay.com/audio/2022/03/22/audio_1e80a61dcd.mp3', // Soft emotional piano
  funny: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c5229f2b.mp3', // Upbeat playful tune
  elegant: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3', // Classical elegant music
  cinematic: 'https://cdn.pixabay.com/audio/2022/08/04/audio_e3f8bbe7e9.mp3', // Epic cinematic score
  traditional: 'https://cdn.pixabay.com/audio/2022/11/22/audio_24a21bd63c.mp3', // Traditional instrumental
};

/**
 * Audio manager for handling background music in videos
 */
export class AudioManager {
  private howl: Howl | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStreamDestination: MediaStreamAudioDestinationNode | null = null;

  /**
   * Preload audio for an emotion
   */
  async preloadAudio(emotion: EmotionType): Promise<void> {
    return new Promise((resolve, reject) => {
      const src = emotionAudioSources[emotion];

      this.howl = new Howl({
        src: [src],
        volume: 0.5,
        loop: false,
        preload: true,
        onload: () => resolve(),
        onloaderror: (id, error) => {
          console.error('Audio load error:', error);
          reject(error);
        },
      });
    });
  }

  /**
   * Play audio and return MediaStream for video recording
   */
  async playAndGetStream(emotion: EmotionType, duration: number): Promise<MediaStream | null> {
    try {
      if (!this.howl) {
        await this.preloadAudio(emotion);
      }

      if (!this.howl) {
        throw new Error('Failed to load audio');
      }

      // Create audio context
      this.audioContext = new AudioContext();
      this.mediaStreamDestination = this.audioContext.createMediaStreamDestination();

      // Play the audio
      this.howl.play();

      // Get the audio element
      const audioElement = (this.howl as any)._sounds[0]._node;

      if (audioElement) {
        const source = this.audioContext.createMediaElementSource(audioElement);
        source.connect(this.mediaStreamDestination);
        source.connect(this.audioContext.destination);
      }

      // Stop after duration
      setTimeout(() => {
        this.stop();
      }, duration * 1000);

      return this.mediaStreamDestination.stream;
    } catch (error) {
      console.error('Error playing audio:', error);
      return null;
    }
  }

  /**
   * Stop audio playback
   */
  stop(): void {
    if (this.howl) {
      this.howl.stop();
      this.howl.unload();
      this.howl = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.mediaStreamDestination = null;
  }

  /**
   * Get audio duration
   */
  getDuration(): number {
    return this.howl?.duration() || 0;
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    if (this.howl) {
      this.howl.volume(volume);
    }
  }
}

/**
 * Create a combined media stream from video and audio
 */
export function combineAudioVideo(
  videoStream: MediaStream,
  audioStream: MediaStream
): MediaStream {
  const combinedStream = new MediaStream();

  // Add video tracks
  videoStream.getVideoTracks().forEach(track => {
    combinedStream.addTrack(track);
  });

  // Add audio tracks
  audioStream.getAudioTracks().forEach(track => {
    combinedStream.addTrack(track);
  });

  return combinedStream;
}

/**
 * Get audio source URL for an emotion
 */
export function getAudioSourceForEmotion(emotion: EmotionType): string {
  return emotionAudioSources[emotion];
}

/**
 * Check if audio is supported in browser
 */
export function isAudioSupported(): boolean {
  return !!(window.AudioContext || (window as any).webkitAudioContext);
}
