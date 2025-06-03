// src/components/SongPlayer.jsx
import React from 'react'; // Ya no necesita useState, useRef, useEffect

// Iconos
const PlayIconList = () => ( 
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M8 5v14l11-7z"></path>
  </svg>
);
const PauseIconList = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
  </svg>
);
const DetailIcon = () => ( 
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const formatDuration = (totalSeconds) => {
  if (typeof totalSeconds === 'string' && totalSeconds.includes(':')) {
    return totalSeconds;
  }
  if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds) || totalSeconds <= 0 || !isFinite(totalSeconds) ) {
    return "0:00";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function SongPlayer({ songData, onPlayClick, onDetailClick, isCurrentlyPlaying }) {
  if (!songData) {
    return null; 
  }

  const handlePlayButtonClick = (e) => {
    e.stopPropagation(); 
    if (onPlayClick && songData.audioUrl) { 
      onPlayClick(); 
    } else if (!songData.audioUrl) {
      alert("Audio no disponible para esta canción.");
    }
  };
  
  const handleDetailButtonClick = (e) => {
    e.stopPropagation();
    if (onDetailClick) {
      onDetailClick();
    }
  };
  
  const handleCardAreaClick = () => {
    if (onDetailClick) { // Priorizar abrir detalles si se hace clic en la tarjeta
      onDetailClick();
    } else if (onPlayClick && songData.audioUrl) { // Si no hay para detalles, que reproduzca
      onPlayClick();
    }
  };

  return (
    <div 
      className={`song-player ${isCurrentlyPlaying ? 'playing-in-list' : ''}`}
      onClick={handleCardAreaClick} 
      style={{cursor: (onDetailClick || (onPlayClick && songData.audioUrl)) ? 'pointer' : 'default'}}
      title={isCurrentlyPlaying ? `Reproduciendo: ${songData.title}` : (onDetailClick ? `Ver detalles de ${songData.title}` : `Reproducir ${songData.title}`)}
    >
      <img
        src={songData.albumArtUrl || songData.albumArt || 'https://via.placeholder.com/55?text=Art'}
        alt={`Portada de ${songData.title}`}
        className="song-album-art"
      />
      <div className="song-info">
        <span className="title">{songData.title || "Título Desconocido"}</span>
        <span className="artist">{songData.artist || "Artista Desconocido"}</span>
      </div>

      <button
        className="play-pause-button-list" 
        aria-label={isCurrentlyPlaying ? `Pausar ${songData.title}` : `Reproducir ${songData.title}`}
        disabled={!songData.audioUrl}
        onClick={handlePlayButtonClick} // Este es el botón específico de play/pause de la lista
      >
        {isCurrentlyPlaying ? <PauseIconList /> : <PlayIconList />}
      </button>

      <span className="song-duration">{formatDuration(songData.duration)}</span>
      
      {onDetailClick && ( // Mostrar botón de detalle solo si se pasa la función
          <button 
            className="detail-button-list" 
            onClick={handleDetailButtonClick}
            aria-label={`Ver detalles de ${songData.title}`}
            title="Ver detalles"
          >
            <DetailIcon />
          </button>
      )}

      <div className="waveform-placeholder-list">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="waveform-bar"
            style={{ height: `${Math.floor(Math.random() * (isCurrentlyPlaying ? 60: 30)) + (isCurrentlyPlaying ? 25 : 15)}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default SongPlayer;