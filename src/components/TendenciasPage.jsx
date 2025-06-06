// src/components/TendenciasPage.jsx
import React, { useMemo } from 'react'; // <<< 1. IMPORTAMOS useMemo
import SongPlayer from './SongPlayer';
import './CategoryPages.css';

function TendenciasPage({ onClose, songsToDisplay, onPlaySongInTendencias, isSongPlaying, currentPlayingSongId }) {

  // <<< 2. CREAMOS LA LISTA ALEATORIA USANDO useMemo >>>
  const shuffledSongs = useMemo(() => {
    // Si no hay canciones, devolvemos un array vacío
    if (!songsToDisplay || songsToDisplay.length === 0) {
      return [];
    }
    // Creamos una copia del array para no modificar el original y lo desordenamos
    return [...songsToDisplay].sort(() => 0.5 - Math.random());
  }, [songsToDisplay]); // La lista solo se volverá a desordenar si 'songsToDisplay' cambia

  if (!shuffledSongs || shuffledSongs.length === 0) {
    return (
      <div className="category-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <header className="category-page-header">
          <h2 className="category-page-title">Tendencias</h2>
        </header>
        <p style={{marginTop: '20px'}}>No hay canciones en tendencias en este momento.</p>
      </div>
    );
  }

  return (
    <div className="category-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="category-page-header">
        <h2 className="category-page-title">Tendencias</h2>
      </header>

      <div className="song-list-container">
        {/* <<< 3. USAMOS NUESTRA NUEVA LISTA ALEATORIA `shuffledSongs` PARA EL .map() >>> */}
        {shuffledSongs.map(song => (
          <SongPlayer
            key={song.id}
            songData={song}
            duration={song.duration}
            onPlayClick={() => onPlaySongInTendencias(song)} 
            onDetailClick={null}
            isCurrentlyPlaying={currentPlayingSongId === song.id && isSongPlaying}
          />
        ))}
      </div>
    </div>
  );
}

export default TendenciasPage;