// src/components/RecomendadasPage.jsx

import React from 'react';
import SongPlayer from './SongPlayer';
import './RecomendadasPage.css'; // Opcional

function RecomendadasPage({ onClose, songsToDisplay, onPlaySongInTendencias, isSongPlaying, currentPlayingSongId }) {
  if (!songsToDisplay) {
    return (
      <div className="recomendadas-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <p>Recomendaciones...</p>
      </div>
    );
  }

  return (
    <div className="recomendadas-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="recomendadas-header-modal">
        <h2 className="recomendadas-page-title">Recomendadas para Ti</h2>
      </header>

      <div className="recomendadas-song-list">
        {songsToDisplay.length > 0 ? (
          songsToDisplay.map(song => (
            <SongPlayer
              key={song.id}
              songData={song}
              onPlayClick={() => onPlaySongInTendencias(song)} 
              isCurrentlyPlaying={currentPlayingSongId === song.id && isSongPlaying}
            />
          ))
        ) : (
          <p>No hay recomendaciones disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default RecomendadasPage;