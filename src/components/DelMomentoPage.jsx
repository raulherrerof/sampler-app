// src/components/DelMomentoPage.jsx

import React from 'react';
import SongPlayer from './SongPlayer';
import './DelMomentoPage.css'; // Opcional, si quieres estilos específicos

function DelMomentoPage({ onClose, songsToDisplay, onPlaySongInTendencias, isSongPlaying, currentPlayingSongId }) {
  if (!songsToDisplay) {
    return (
      <div className="del-momento-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <p>Canciones del momento...</p>
      </div>
    );
  }

  return (
    <div className="del-momento-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="del-momento-header-modal">
        <h2 className="del-momento-page-title">Del Momento</h2>
      </header>

      <div className="del-momento-song-list">
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
          <p>No hay canciones disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default DelMomentoPage;