import React from 'react';

// Iconos (puedes tener Play/Pause dinámico aquí también)
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
const DetailIcon = () => ( // Un icono para "ver detalles"
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="1">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

// Función de utilidad para formatear la duración
const formatDuration = (totalSeconds) => {
  if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds) || totalSeconds <= 0) {
    return "0:00";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};


function SongPlayer({ songData, onPlayClick, onDetailClick, isCurrentlyPlaying }) { // Nuevas props
  if (!songData) return null;

  const handleMainClick = () => {
    if (songData.audioUrl) {
      onPlayClick(); // Llama a la función de App.jsx para reproducir/pausar
    }
  };

  const handleDetailClick = (e) => {
    e.stopPropagation(); // Evitar que se active handleMainClick
    if (onDetailClick) {
      onDetailClick(); // Llama a la función de App.jsx para abrir detalles
    }
  };

  return (
    <div 
      className={`song-player ${isCurrentlyPlaying ? 'playing' : ''}`} 
      onClick={handleMainClick} // Clic en el área principal reproduce
      style={{cursor: songData.audioUrl ? 'pointer' : 'default'}}
      title={isCurrentlyPlaying ? `Reproduciendo: ${songData.title}` : `Reproducir ${songData.title}`}
    >
      <img
        src={songData.albumArtUrl || songData.albumArt || 'https://via.placeholder.com/55?text=Art'}
        alt={`Portada de ${songData.title}`}
        className="song-album-art"
        // onClick={handleDetailClick} // Opcional: clic en la imagen también abre detalles
      />
      <div className="song-info" /*onClick={handleDetailClick} // Opcional: clic en info también abre detalles*/>
        <span className="title">{songData.title || "Título Desconocido"}</span>
        <span className="artist">{songData.artist || "Artista Desconocido"}</span>
      </div>

      {/* Botón de Play/Pause en la lista */}
      <button
        className="play-pause-button-list" // Clase diferente para estilo específico
        aria-label={isCurrentlyPlaying ? `Pausar ${songData.title}` : `Reproducir ${songData.title}`}
        disabled={!songData.audioUrl}
        onClick={(e) => { 
          e.stopPropagation(); // Evita que se active el onClick del div principal
          onPlayClick(); 
        }}
      >
        {isCurrentlyPlaying ? <PauseIconList /> : <PlayIconList />}
      </button>

      <span className="song-duration">{formatDuration(songData.duration)}</span>
      
      {/* Botón para ver detalles (opcional) */}
      {onDetailClick && (
          <button 
            className="detail-button-list" 
            onClick={handleDetailClick}
            aria-label={`Ver detalles de ${songData.title}`}
            title="Ver detalles"
          >
            <DetailIcon />
          </button>
      )}

      {/* Waveform (sigue siendo un placeholder visual) */}
      <div className="waveform-placeholder-list">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="waveform-bar"
            style={{ height: `${Math.floor(Math.random() * (isCurrentlyPlaying ? 60: 30)) + (isCurrentlyPlaying ? 25 : 15)}%` }} // Animación simple
          ></div>
        ))}
      </div>
    </div>
  );
}

export default SongPlayer;