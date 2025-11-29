import React, { useState, useRef } from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const videoRef = useRef(null);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`;
    }
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isEmbed = embedUrl?.includes('youtube.com/embed') || embedUrl?.includes('vimeo.com');

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
      
      if (!hasCompleted && video.currentTime / video.duration >= 0.9) {
        setHasCompleted(true);
        onComplete && onComplete();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!videoUrl) {
    return (
      <div className="video-placeholder">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM9 8l7 4-7 4V8z"/>
        </svg>
        <p>No video available for this lesson</p>
      </div>
    );
  }

  // YouTube/Vimeo Embed
  if (isEmbed) {
    return (
      <div className="video-player-container">
        <div className="video-embed">
          <iframe
            src={embedUrl}
            title="Video lesson"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        {!hasCompleted && (
          <button className="mark-complete-video" onClick={() => { setHasCompleted(true); onComplete && onComplete(); }}>
            Mark as Complete
          </button>
        )}
        {hasCompleted && (
          <div className="completed-message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Lesson Completed
          </div>
        )}
      </div>
    );
  }

  // Direct Video
  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => { setHasCompleted(true); onComplete && onComplete(); }}
          onClick={handlePlayPause}
        />
        
        <div className="video-controls">
          <button className="play-btn" onClick={handlePlayPause}>
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          
          <div className="progress-wrapper">
            <div className="progress-bar" onClick={handleSeek}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          
          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          
          <button className="fullscreen-btn" onClick={() => videoRef.current?.requestFullscreen()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
        </div>
      </div>
      
      {hasCompleted && (
        <div className="completed-message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          Lesson Completed
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
