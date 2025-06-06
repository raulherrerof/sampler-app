// src/components/TopEspanaPage.jsx

import React from 'react';
import SongPlayer from './SongPlayer'; // Usamos la ruta correcta con ./
import './TopEspanaPage.css'; // Crearemos este archivo CSS (opcional)

function TopEspanaPage({ onClose, songsToDisplay, onPlaySongInTendencias, isSongPlaying, currentPlayingSongId }) {
  if (!songsToDisplay) {
    return (
      <div className="top-espana-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <p>Cargando Top España...</p>
      </div>
    );
  }

  return (
    <div className="top-espana-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="top-espana-header-modal">
        <h2 className="top-espana-page-title">Top en España</h2>
      </header>

      <div className="top-espana-song-list">
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
          <p>No hay canciones en el Top de España en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default TopEspanaPage;