// src/components/RandomPage.jsx

import React from 'react';
import SongPlayer from './SongPlayer';
import './RandomPage.css'; // Opcional

function RandomPage({ onClose, songsToDisplay, onPlaySongInTendencias, isSongPlaying, currentPlayingSongId }) {
  if (!songsToDisplay || songsToDisplay.length === 0) {
    return (
      <div className="random-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <p>Buscando una canción para ti...</p>
      </div>
    );
  }

  const randomSong = songsToDisplay[0]; // Tomamos la única canción del array

  return (
    <div className="random-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="random-header-modal">
        <h2 className="random-page-title">Tu Canción Aleatoria del Día</h2>
      </header>

      <div className="random-song-list">
        {/* Renderizamos directamente el SongPlayer ya que solo hay una canción */}
        <SongPlayer
            key={randomSong.id}
            songData={randomSong}
            onPlayClick={() => onPlaySongInTendencias(randomSong)} 
            isCurrentlyPlaying={currentPlayingSongId === randomSong.id && isSongPlaying}
        />
      </div>
    </div>
  );
}

export default RandomPage;