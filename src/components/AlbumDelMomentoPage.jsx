// src/components/AlbumDelMomentoPage.jsx

import React from 'react';
import SongPlayer from './SongPlayer';
// Reutilizamos el mismo CSS que otras páginas de categoría para mantener la consistencia
import './CategoryPages.css'; 

function AlbumDelMomentoPage({ onClose, songsToDisplay, onPlaySong, isSongPlaying, currentPlayingSongId }) {
  
  // Mensaje por si, por alguna razón, la lista llega vacía.
  if (!songsToDisplay || songsToDisplay.length === 0) {
    return (
      <div className="category-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <header className="category-page-header">
          <h2 className="category-page-title">Álbum del Momento: Ferxxocalipsis</h2>
        </header>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No se encontraron canciones de Feid en este momento.</p>
      </div>
    );
  }

  return (
    <div className="category-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="category-page-header">
        <h2 className="category-page-title">Álbum del Momento: Ferxxocalipsis</h2>
        <p className="category-page-subtitle">Disfruta de Ferxxocalipsis</p>
      </header>

      <div className="song-list-container">
        {songsToDisplay.map(song => (
          <SongPlayer
            key={song.id}
            songData={song}
            duration={song.duration}
            onPlayClick={() => onPlaySong(song)} 
            onDetailClick={null} // Opcional: No mostramos botón de detalle en esta vista
            isCurrentlyPlaying={currentPlayingSongId === song.id && isSongPlaying}
          />
        ))}
      </div>
    </div>
  );
}

export default AlbumDelMomentoPage;