// src/components/DelMomentoPage.jsx

import React from 'react';
import SongPlayer from './SongPlayer';
import './CategoryPages.css'; // <<< 1. Importamos el CSS compartido y genérico

// Las props que recibe el componente no cambian
function DelMomentoPage({ onClose, songsToDisplay, onPlaySongInTendencias, isSongPlaying, currentPlayingSongId }) {
  
  if (!songsToDisplay || songsToDisplay.length === 0) {
    // Usamos las clases genéricas para el mensaje de carga/vacío
    return (
      <div className="category-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <header className="category-page-header">
            <h2 className="category-page-title">Del Momento</h2>
        </header>
        <p style={{marginTop: '20px'}}>No hay canciones disponibles en este momento.</p>
      </div>
    );
  }

  return (
    // <<< 2. Usamos las clases genéricas en todo el JSX
    <div className="category-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="category-page-header">
        <h2 className="category-page-title">Del Momento</h2>
      </header>

      <div className="song-list-container">
        {songsToDisplay.map(song => (
          <SongPlayer
            key={song.id}
            songData={song}
            duration={song.duration} // Importante pasar la duración
            onPlayClick={() => onPlaySongInTendencias(song)} 
            onDetailClick={null} // No mostramos botón de detalle en esta vista
            isCurrentlyPlaying={currentPlayingSongId === song.id && isSongPlaying}
          />
        ))}
      </div>
    </div>
  );
}

export default DelMomentoPage;