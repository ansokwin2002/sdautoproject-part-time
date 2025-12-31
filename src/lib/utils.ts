import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to extract YouTube video ID
function getYouTubeVideoId(url: string): string | null {
  let videoId = null;
  try {
    const urlObject = new URL(url);
    if (urlObject.hostname === 'www.youtube.com' || urlObject.hostname === 'youtube.com') {
      const urlParams = new URLSearchParams(urlObject.search);
      videoId = urlParams.get('v');
    } else if (urlObject.hostname === 'youtu.be') {
      videoId = urlObject.pathname.substring(1);
    }
  } catch (error) {
    // Invalid URL
  }
  return videoId;
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1`;
  }
  return url;
}

export function getYouTubeThumbnail(url: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'sddefault' | 'maxresdefault' = 'hqdefault'): string | null {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  }
  return null;
}
