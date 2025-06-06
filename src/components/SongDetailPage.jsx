import React, { useState, useRef, useEffect } from 'react';
import './SongDetailPage.css';

// --- Iconos ---
const PlayIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIconDetail = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const UserIconPlaceholder = () => ( <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" color="#A9A9A9"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>);
const HeartIcon = ({ liked }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill={liked ? "#8a2be2" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

function SongDetailPage({
  song,
  onClose,
  currentUser,
  onLikeUpdate,
  onCommentAdded,
  isGlobalPlaying,
  onGlobalPlayPause,
  currentPlayingSong, // Prop de App.jsx
  onLoginRedirect     // Prop de App.jsx para redirigir al login
}) {
  const [isPlaying, setIsPlaying] = useState(
    currentPlayingSong?.id === song?.id ? isGlobalPlaying : false
  );
  const [currentTime, setCurrentTime] = useState(
    currentPlayingSong?.id === song?.id && typeof currentPlayingSong.currentTime === 'number' ? currentPlayingSong.currentTime : 0
  ); // Sincronizar tiempo inicial si es la canción global
  const [duration, setDuration] = useState(
    currentPlayingSong?.id === song?.id && typeof currentPlayingSong.duration === 'number' ? currentPlayingSong.duration : (song?.duration || 0)
  );
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(song?.userHasLiked || false);
  const [currentLikeCount, setCurrentLikeCount] = useState(song?.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState(Array.isArray(song?.comments) ? song.comments : []);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null); // Para el clic en la barra de progreso
  const API_URL = process.env.REACT_APP_API_BASE_URL || '';

  // Sincronizar isPlaying con el estado global si esta es la canción global
  useEffect(() => {
    if (currentPlayingSong?.id === song?.id && typeof isGlobalPlaying === 'boolean') {
        setIsPlaying(isGlobalPlaying);
    }
  }, [isGlobalPlaying, currentPlayingSong, song]);

  // Sincronizar datos de la canción (likes, comments, duración inicial)
  useEffect(() => {
    setIsLikedByCurrentUser(song?.userHasLiked || false);
    setCurrentLikeCount(song?.likeCount || 0);
    setComments(Array.isArray(song?.comments) ? song.comments : []);
    
    // Establecer duración inicial desde la prop song.duration
    // Si es un string "M:SS", convertir a segundos. Si es número, usarlo.
    let initialDurationSeconds = 0;
    if (song?.duration) {
        if (typeof song.duration === 'string' && song.duration.includes(':')) {
            const parts = song.duration.split(':');
            initialDurationSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        } else if (!isNaN(parseFloat(song.duration))) {
            initialDurationSeconds = parseFloat(song.duration);
        }
    }
    setDuration(initialDurationSeconds);


    const audio = audioRef.current;
    // Lógica para el audio local si este detalle NO usa el reproductor global
    // o si la canción del detalle es DIFERENTE a la del reproductor global
    const useLocalAudioControl = !onGlobalPlayPause || (currentPlayingSong?.id !== song?.id);

    if (useLocalAudioControl && audio && song?.audioUrl) {
        if (audio.src !== song.audioUrl) {
            audio.src = song.audioUrl;
            audio.load(); // Cargar la nueva fuente
            // Resetear estados para la nueva canción local
            setIsPlaying(false); 
            setCurrentTime(0);
        }
    } else if (audio && !song?.audioUrl) { // Si no hay URL de audio, limpiar
      audio.pause();
      audio.src = "";
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [song, onGlobalPlayPause, currentPlayingSong]);


  // Efecto para el elemento de audio LOCAL (si aplica)
  useEffect(() => {
    const useLocalAudioControl = !onGlobalPlayPause || (currentPlayingSong?.id !== song?.id);
    const audio = audioRef.current;

    if (useLocalAudioControl && audio && song?.audioUrl) {
      const setAudioData = () => { 
        if (audio.readyState >= 2 && !isNaN(audio.duration) && audio.duration !== Infinity) { 
          setDuration(audio.duration); 
        }
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const handleSongEnd = () => { setIsPlaying(false); setCurrentTime(audio.duration); }; // O ir al siguiente
      
      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('durationchange', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleSongEnd);
      
      // Sincronizar play/pause del audio local con el estado 'isPlaying' local
      if (isPlaying) {
          audio.play().catch(e => { console.warn("Local audio play en SongDetail falló:", e); setIsPlaying(false); });
      } else {
          audio.pause();
      }

      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('durationchange', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleSongEnd);
      };
    } else if (audio && !useLocalAudioControl && currentPlayingSong?.id === song?.id) {
      // Si ahora se controla globalmente, asegurar que el audio local esté pausado y su src limpio
      // para evitar que suene al mismo tiempo que el global.
      audio.pause();
      // audio.src = ""; // Podría ser problemático si el global intenta usar este mismo ref
    }
  }, [song, isPlaying, onGlobalPlayPause, currentPlayingSong]);


  const togglePlayPause = () => {
    if (onGlobalPlayPause && currentPlayingSong?.id === song?.id) {
      onGlobalPlayPause(); // Llama a la función global
    } else if (song?.audioUrl && audioRef.current) { // Control local
      setIsPlaying(prev => !prev);
    } else {
      alert("No hay audio para reproducir.");
    }
  };

  const handleProgressClick = (e) => {
    if (!song?.audioUrl || duration === 0 || !progressBarRef.current || !audioRef.current) return;
    const progressBar = progressBarRef.current;
    const clickPosition = e.pageX - progressBar.getBoundingClientRect().left;
    const newTime = (clickPosition / progressBar.offsetWidth) * duration;
    
    if (onGlobalPlayPause && currentPlayingSong?.id === song?.id) {
        // Si hay un reproductor global y es esta canción, idealmente App.jsx debería tener onSeek
        // Por ahora, si onGlobalPlayPause está definido, asumimos que App.jsx no tiene onSeek para el detalle
        // Esto es una simplificación, lo ideal sería un onGlobalSeek.
        if (audioRef.current && audioRef.current.src === song.audioUrl) { // Si el audio local es el correcto
             audioRef.current.currentTime = newTime;
        }
        setCurrentTime(newTime); // Actualizar UI localmente
    } else if (audioRef.current) { // Control local
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }
  };

  const handleToggleLike = async () => {
    if (!currentUser) { 
      if (onLoginRedirect) onLoginRedirect(); // Redirigir al login si se pasa la función
      else alert("Debes iniciar sesión para dar 'Me Gusta'."); 
      return; 
    }
    if (!song?.id || isLiking) return;

    setIsLiking(true);
    const originalIsLiked = isLikedByCurrentUser;
    const originalLikeCount = currentLikeCount;

    // Actualización optimista
    setIsLikedByCurrentUser(!originalIsLiked);
    setCurrentLikeCount(prev => originalIsLiked ? Math.max(0, prev - 1) : prev + 1);

    try {
      const response = await fetch(`${API_URL}/api/toggle_like.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ song_id: song.id })
      });
      const data = await response.json();

      if (!response.ok) { // Primero chequear si el status HTTP es de error
        // data.error puede no existir si la respuesta no es JSON o es un error de servidor genérico
        const errorMsg = data?.error || data?.message || `Error del servidor: ${response.status}`;
        throw new Error(errorMsg);
      }
      
      // Si response.ok es true, entonces la operación fue exitosa en el backend
      // y esperamos que 'data' contenga 'userHasLiked' y 'likeCount'
      if (typeof data.userHasLiked !== 'boolean' || typeof data.likeCount !== 'number') {
          console.error("Respuesta inesperada de toggle_like.php:", data);
          throw new Error('Respuesta inesperada del servidor al procesar "Me Gusta".');
      }
      
      // Sincronizar con la respuesta real del servidor
      setIsLikedByCurrentUser(data.userHasLiked);
      setCurrentLikeCount(data.likeCount);
      if (onLikeUpdate) { 
        onLikeUpdate(song.id, data.userHasLiked, data.likeCount); 
      }

    } catch (err) {
      console.error(`Error al ${originalIsLiked ? 'quitar' : 'dar'} "Me Gusta":`, err);
      // Revertir el estado optimista si la llamada a la API falla
      setIsLikedByCurrentUser(originalIsLiked);
      setCurrentLikeCount(originalLikeCount);
      alert(`Error al procesar "Me Gusta": ${err.message}`);
    } finally { 
      setIsLiking(false); 
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || !isFinite(timeInSeconds) || timeInSeconds <= 0) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) { 
        if(onLoginRedirect) onLoginRedirect();
        else alert("Debes iniciar sesión para comentar."); 
        return; 
    }
    if (!newCommentText.trim()) { alert("El comentario no puede estar vacío."); return; }
    if (!song?.id || isSubmittingComment) return;

    setIsSubmittingComment(true);
    const commentData = { song_id: song.id, comment_text: newCommentText.trim() };
    const userNameForOptimisticComment = currentUser.name || currentUser.username || "Tú";
    const userProfilePicForOptimisticComment = currentUser.profilePicUrl || null; // Usar la URL completa

    const optimisticComment = {
      id: `optimistic_${Date.now()}`,
      user: { id: currentUser.id, name: userNameForOptimisticComment, profilePicUrl: userProfilePicForOptimisticComment },
      text: newCommentText.trim(),
      createdAt: new Date().toISOString(), // Fecha aproximada
      isOptimistic: true
    };

    setComments(prevComments => [optimisticComment, ...prevComments]);
    setNewCommentText('');

    try {
      const response = await fetch(`${API_URL}/api/add_comment.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(commentData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) { // Asume que add_comment.php devuelve {success: true/false}
        throw new Error(result.error || result.message || 'Error al añadir el comentario.');
      }
      const newCommentFromServer = result.comment; // Asume que la API devuelve el comentario completo
      setComments(prevComments =>
        prevComments.map(c => (c.id === optimisticComment.id ? newCommentFromServer : c))
      );
      if (onCommentAdded) {
        onCommentAdded(song.id, newCommentFromServer);
      }
    } catch (err) {
      console.error("Error al añadir comentario:", err);
      setComments(prevComments => prevComments.filter(c => c.id !== optimisticComment.id)); // Revertir optimista
      alert('Error: ' + err.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    if (onLoginRedirect) {
      onLoginRedirect();
    } else if (onClose) { // Fallback si onLoginRedirect no se pasa
      onClose();
      // Aquí podrías necesitar una forma de decirle a App.jsx que abra el login si onClose solo cierra el modal actual
    }
  };

  // Determinar el estado de reproducción y tiempos a mostrar
  // Priorizar el control global si esta es la canción que está sonando globalmente
  const displayIsPlaying = (currentPlayingSong?.id === song?.id) ? isGlobalPlaying : isPlaying;
  const displayCurrentTime = (currentPlayingSong?.id === song?.id && typeof currentPlayingSong.currentTime === 'number') ? currentPlayingSong.currentTime : currentTime;
  const displayDuration = (currentPlayingSong?.id === song?.id && typeof currentPlayingSong.duration === 'number') ? currentPlayingSong.duration : duration;


  if (!song) {
    return (
      <div className="song-detail-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        <p style={{ padding: '50px', textAlign: 'center' }}>Cargando información de la canción...</p>
      </div>
    );
  }
  
  const displayArtists = `${song.artist || "Artista Desconocido"}${song.featuredArtists ? `, ${song.featuredArtists}` : ''}`;

  return (
    <div className="song-detail-page-overlay-content">
        {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
        
        <div className="song-detail-upper-section">
            <div className="song-cover-art-large-container">
                <img src={song.albumArtUrl || 'https://via.placeholder.com/300?text=Sampler'} alt={`Portada de ${song.title}`} className="song-cover-art-large" />
            </div>
            <div className="song-info-basic-column">
                <div className="text-limiter-wrapper">
                    <span className="title-detail-page" title={song.title || "Título Desconocido"}>
                        {song.title || "Título Desconocido"}
                    </span>
                    <span className="artist-detail-page" title={displayArtists}>
                        {displayArtists}
                    </span>
                </div>
            </div>
        </div>

        <div className="player-controls-bottom-section">
            <div className="player-actions">
                <button onClick={handleToggleLike} className={`like-button ${isLikedByCurrentUser ? 'liked' : ''}`} aria-label={isLikedByCurrentUser ? "Quitar Me gusta" : "Me gusta"} disabled={!currentUser || isLiking} >
                    <HeartIcon liked={isLikedByCurrentUser} />
                    {typeof currentLikeCount === 'number' && <span className="like-count">{currentLikeCount}</span>}
                </button>
                <button onClick={togglePlayPause} className="play-pause-button-detail" disabled={!song.audioUrl}>
                    {displayIsPlaying ? <PauseIconDetail /> : <PlayIconDetail />}
                </button>
                <span className="time-display">{formatTime(displayCurrentTime)} / {formatTime(displayDuration)}</span>
            </div>
            {/* El elemento <audio> solo se renderiza si no hay control global o si la canción es diferente */}
            {(!onGlobalPlayPause || (currentPlayingSong?.id !== song?.id && song.audioUrl)) && (
                <audio ref={audioRef} preload="metadata" src={song.audioUrl /* Se establece src aquí o en useEffect */}></audio>
            )}
        </div>

        <div className="comments-section">
            <div className="comments-header">
                <h3>{comments.length} Comentarios</h3>
            </div>
            {currentUser ? (
              <form onSubmit={handleAddComment} className="add-comment-form">
                <div className="comment-input-row">
                  <div className="comment-user-avatar current-user-avatar">
                    {(currentUser.profilePicUrl) ? ( 
                      <img src={currentUser.profilePicUrl} alt={currentUser.name || currentUser.username || 'Tu avatar'} />
                    ) : ( <UserIconPlaceholder /> )}
                  </div>
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Escribe un comentario..."
                    rows="2" // Más pequeño
                    disabled={isSubmittingComment}
                  />
                </div>
                <button type="submit" className="submit-comment-button" disabled={isSubmittingComment || !newCommentText.trim()}>
                  {isSubmittingComment ? 'Enviando...' : 'Comentar'}
                </button>
              </form>
            ) : ( 
              <p className="login-to-comment-prompt"> 
                <a href="#" onClick={handleLoginClick}>Inicia sesión</a> para dejar un comentario. 
              </p> 
            )}
            <div className="comments-list">
                {comments.length > 0 ? comments.map(comment => (
                    <div key={comment.id} className={`comment-item ${comment.isOptimistic ? 'optimistic' : ''}`}>
                        <div className="comment-user-avatar">
                            {comment.user?.profilePicUrl ? (
                                <img src={comment.user.profilePicUrl} alt={comment.user.name || "Avatar"} />
                            ) : ( <UserIconPlaceholder /> )}
                        </div>
                        <div className="comment-content">
                            <span className="comment-user-name" title={comment.user?.name || "Usuario Anónimo"}>
                                {comment.user?.name || "Usuario Anónimo"}
                            </span>
                            <p className="comment-text">{comment.text}</p>
                            {/* Opcional: mostrar fecha del comentario */}
                            {/* <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span> */}
                        </div>
                    </div>
                )) : ( 
                    !isSubmittingComment && <p className="no-comments-prompt">No hay comentarios aún. ¡Sé el primero!</p>
                )}
            </div>
        </div>
    </div>
  );
}

export default SongDetailPage;