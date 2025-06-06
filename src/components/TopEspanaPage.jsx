// src/components/TopEspanaPage.jsx

import React, { useMemo } from 'react'; // <<< 1. IMPORTAMOS useMemo
import SongPlayer from './SongPlayer';
import './CategoryPages.css';

function TopEspanaPage({ onClose, songsToDisplay, onPlaySongInTendencias, isSongPlaying, currentPlayingSongId }) {
  
  // <<< 2. CREAMOS LA LISTA ALEATORIA USANDO useMemo >>>
  const shuffledSongs = useMemo(() => {
    if (!songsToDisplay || songsToDisplay.length === 0) {
      return [];
    }
    return [...songsToDisplay].sort(() => 0.5 - Math.random());
  }, [songsToDisplay]);

  if (!shuffledSongs || shuffledSongs.length === 0) {
    return (
      <div className="category-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <header className="category-page-header">
            <h2 className="category-page-title">Top en España</h2>
        </header>
        <p style={{marginTop: '20px'}}>No hay canciones en el Top de España en este momento.</p>
      </div>
    );
  }

  return (
    <div className="category-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      
      <header className="category-page-header">
        <h2 className="category-page-title">Top en España</h2>
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

export default TopEspanaPage;