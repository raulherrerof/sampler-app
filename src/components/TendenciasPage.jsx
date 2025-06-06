import React from 'react';
import SongPlayer from './SongPlayer'; // Reutilizamos SongPlayer para la lista
import './TendenciasPage.css'; // Crearemos este CSS

// onClose viene de App.jsx si es un overlay
// songsToDisplay son las canciones de tendencias pasadas desde App.jsx
// onPlaySongInTendencias es la función de App.jsx para reproducir una canción
function TendenciasPage({ onClose, songsToDisplay, onPlaySongInTendencias, isSongPlaying, currentPlayingSongId }) {
  if (!songsToDisplay) {
    return (
      <div className="tendencias-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <p>Cargando tendencias...</p>
      </div>
    );
  }

  return (
    <div className="tendencias-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="tendencias-header-modal">
        <h2 className="tendencias-page-title">Estas son las tendencias ahora mismo</h2>
      </header>

      <div className="tendencias-song-list">
        {songsToDisplay.length > 0 ? (
          songsToDisplay.map(song => (
            <SongPlayer
              key={song.id}
              songData={song}
              // Pasamos la función de App.jsx para que el SongPlayer pueda iniciar la reproducción global
              onPlayClick={() => onPlaySongInTendencias(song)} 
              // onDetailClick={() => onOpenSongDetailFromTendencias(song)} // Opcional: si quieres abrir detalle desde aquí
              isCurrentlyPlaying={currentPlayingSongId === song.id && isSongPlaying}
            />
          ))
        ) : (
          <p>No hay canciones en tendencias en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default TendenciasPage;