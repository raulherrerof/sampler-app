import React from 'react';


const PlayIconList = () => ( 
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M8 5v14l11-7z"></path>
  </svg>
);


function SongPlayer({ songData, onPlayClick }) {
  if (!songData) return null;

  return (
    <div className="song-player" onClick={onPlayClick} style={{cursor: 'pointer'}}>
      <img 
        src={songData.albumArt || 'https://via.placeholder.com/55?text=Art'} 
        alt={`Portada de ${songData.title}`} 
        className="song-album-art" 
      />
      <div className="song-info">
        <span className="title">{songData.title || "Título Desconocido"}</span>
        <span className="artist">{songData.artist || "Artista Desconocido"}</span>
      </div>
      
      
      <button 
        className="play-pause-button" 
        aria-label={`Ver detalles de ${songData.title}`}
        disabled={!songData.audioUrl}
        onClick={(e) => { e.stopPropagation(); onPlayClick(); }} 
      >
        <PlayIconList /> 
      </button>
      
      <span className="song-duration">{songData.duration || "0:00"}</span>
      
      <div className="waveform">
        {[...Array(20)].map((_, i) => ( 
          <div 
            key={i} 
            className="waveform-bar" 
            style={{ height: `${Math.floor(Math.random() * 60) + 15}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default SongPlayer;