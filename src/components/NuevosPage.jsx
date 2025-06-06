// src/components/NuevosPage.jsx
import React from 'react';
import SongPlayer from './SongPlayer';
import './CategoryPages.css'; // Puedes usar un CSS genérico para todas las páginas de categoría

function NuevosPage({ onClose, songsToDisplay, onPlaySongInTendencias, isSongPlaying, currentPlayingSongId }) {
  if (!songsToDisplay || songsToDisplay.length === 0) {
    return (
      <div className="category-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <p>No hay canciones nuevas por el momento.</p>
      </div>
    );
  }

  return (
    <div className="category-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="category-page-header">
        <h2 className="category-page-title">Nuevos Lanzamientos</h2>
      </header>

      <div className="song-list-container">
        {songsToDisplay.map(song => (
          <SongPlayer
            key={song.id}
            songData={song}
            duration={song.duration}
            onPlayClick={() => onPlaySongInTendencias(song)} 
            // Pasamos las props necesarias para que SongPlayer funcione dentro de este overlay
            onDetailClick={null} // Opcional: puedes quitar el botón de detalle aquí si quieres
            isCurrentlyPlaying={currentPlayingSongId === song.id && isSongPlaying}
          />
        ))}
      </div>
    </div>
  );
}

export default NuevosPage;