import React from 'react';
import styles from './VideoModal.module.css';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

// Convert various video URLs to embeddable format
const getEmbedUrl = (url: string | undefined): string | null => {
  if (!url) return null;

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : new URLSearchParams(new URL(url).search).get('v');

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Loom
  if (url.includes('loom.com')) {
    const loomId = url.split('/share/')[1] || url.split('/embed/')[1];
    if (loomId) {
      return `https://www.loom.com/embed/${loomId}`;
    }
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const vimeoId = url.split('vimeo.com/')[1];
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }

  // If already an embed URL or direct link, return as is
  if (url.includes('embed') || url.includes('.mp4') || url.includes('.mov')) {
    return url;
  }

  return null;
};

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.videoContainer}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Video Solution"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoIframe}
            />
          ) : (
            <div className={styles.errorMessage}>
              <p>Unable to load video</p>
              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.videoLink}
                >
                  Open video in new tab
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
