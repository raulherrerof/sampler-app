import React, { useState, useEffect } from 'react';
import './PlayerBar.css'; // Necesitarás crear este archivo para los estilos

// --- Iconos (puedes reemplazarlos con los de una librería o tus propios SVGs) ---
const PlayIconPlayerBar = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIconPlayerBar = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const NextIconPlayerBar = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>;
const PrevIconPlayerBar = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>;
const VolumeUpIconPlayerBar = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>;
const VolumeMuteIconPlayerBar = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path></svg>;
const HeartIconPlayerBar = ({ liked }) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill={liked ? "red" : "none"} stroke={liked ? "red" : "currentColor"} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);
// --- Fin Iconos ---


// Función de utilidad para formatear tiempo
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds) || timeInSeconds === Infinity || timeInSeconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

function PlayerBar({
  song,               // Objeto de la canción actual (con title, artist, albumArtUrl, likeCount, userHasLiked, etc.)
  isPlaying,          // Booleano: si la canción está sonando
  currentTime,        // Número: tiempo actual en segundos
  duration,           // Número: duración total en segundos
  volume,             // Número: volumen actual (0-1)
  onPlayPause,        // Función para alternar play/pause
  onNext,             // Función para ir a la siguiente canción
  onPrev,             // Función para ir a la canción anterior
  onSeek,             // Función para cambiar la posición de reproducción (recibe el nuevo tiempo)
  onVolumeChange,     // Función para cambiar el volumen (recibe el nuevo volumen 0-1)
  onToggleLike        // (Opcional) Función para dar like/unlike desde la barra, si lo implementas
}) {
  const [isDraggingSeekBar, setIsDraggingSeekBar] = useState(false);
  const [isMuted, setIsMuted] = useState(volume === 0);
  const [lastVolumeBeforeMute, setLastVolumeBeforeMute] = useState(volume > 0 ? volume : 0.5); // Para restaurar

  // Sincronizar estado de mute con el volumen global
  useEffect(() => {
    setIsMuted(volume === 0);
    if (volume > 0) {
      setLastVolumeBeforeMute(volume); // Actualizar el último volumen conocido si no está muteado
    }
  }, [volume]);

  const handleSeekBarChange = (e) => {
    onSeek(parseFloat(e.target.value));
  };

  const handleVolumeSliderChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const toggleMute = () => {
    if (isMuted) { // Si está muteado, restaurar al último volumen o un valor por defecto
      onVolumeChange(lastVolumeBeforeMute > 0.01 ? lastVolumeBeforeMute : 0.5);
    } else { // Si no está muteado, mutear
      setLastVolumeBeforeMute(volume); // Guardar el volumen actual antes de mutear
      onVolumeChange(0);
    }
  };

  if (!song) {
    return (
      <div className="player-bar placeholder">
        <span>Selecciona una canción para reproducir</span>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="player-bar">
      {/* Sección Izquierda: Información de la Canción y Like (Opcional) */}
      <div className="player-song-info-wrapper">
        <img
          src={song.albumArtUrl || song.albumArt || 'https://via.placeholder.com/60?text=Art'}
          alt={song.title || "Portada"}
          className="player-album-art"
        />
        <div className="player-text-details">
          <span className="player-title" title={song.title}>{song.title || "Canción Desconocida"}</span>
          <span className="player-artist" title={song.artist}>{song.artist || "Artista Desconocido"}</span>
        </div>
        {/* Opcional: Botón de Like en la barra */}
        {onToggleLike && ( 
            <button
                onClick={() => onToggleLike(song.id, song.userHasLiked, song.likeCount)} 
                className={`control-button like-button-player-bar ${song.userHasLiked ? 'liked' : ''}`}
                aria-label={song.userHasLiked ? "Quitar Me gusta" : "Me gusta"}
                title={song.userHasLiked ? "Quitar Me gusta" : "Me gusta"}
            >
                <HeartIconPlayerBar liked={song.userHasLiked} />
            </button>
        )}
      </div>

      {/* Sección Central: Controles de Reproducción y Barra de Progreso */}
      <div className="player-controls-progress-wrapper">
        <div className="player-main-controls">
          <button onClick={onPrev} className="control-button prev-button" aria-label="Anterior" title="Anterior"><PrevIconPlayerBar /></button>
          <button onClick={onPlayPause} className="control-button play-pause-main-button" aria-label={isPlaying ? "Pausar" : "Reproducir"} title={isPlaying ? "Pausar" : "Reproducir"}>
            {isPlaying ? <PauseIconPlayerBar /> : <PlayIconPlayerBar />}
          </button>
          <button onClick={onNext} className="control-button next-button" aria-label="Siguiente" title="Siguiente"><NextIconPlayerBar /></button>
        </div>
        <div className="player-progress-bar-section">
          <span className="time current-time">{formatTime(currentTime)}</span>
          <div className="progress-bar-container">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeekBarChange}
              onMouseDown={() => setIsDraggingSeekBar(true)} 
              onMouseUp={() => setIsDraggingSeekBar(false)}
              className="seek-bar"
              aria-label="Barra de progreso"
              style={{ backgroundSize: `${isDraggingSeekBar || currentTime > 0 ? progressPercent : 0}% 100%` }}
            />
          </div>
          <span className="time total-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Sección Derecha: Control de Volumen */}
      <div className="player-volume-controls-wrapper">
        <button onClick={toggleMute} className="control-button volume-mute-button" aria-label={isMuted ? "Quitar silencio" : "Silenciar"} title={isMuted ? "Quitar silencio" : "Silenciar"}>
            {isMuted || volume === 0 ? <VolumeMuteIconPlayerBar /> : <VolumeUpIconPlayerBar />}
        </button>
        <div className="volume-bar-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume} 
              onChange={handleVolumeSliderChange}
              className="volume-bar"
              aria-label="Control de volumen"
              style={{ backgroundSize: `${(isMuted ? 0 : volume) * 100}% 100%` }}
            />
        </div>
      </div>
    </div>
  );
}

export default PlayerBar;