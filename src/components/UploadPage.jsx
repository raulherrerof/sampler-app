// UploadPage.jsx
import React, { useState } from 'react';
import './UploadPage.css';

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px', verticalAlign: 'middle', color: '#b3b3b3' }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

function UploadPage({ onUploadSuccess, onClose }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [genre, setGenre] = useState('');
  const [coverArtFile, setCoverArtFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [coverArtName, setCoverArtName] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [coverArtPreview, setCoverArtPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // <<< 1. ESTADOS PARA EL FEEDBACK VISUAL DEL DRAG & DROP >>>
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);

  const API_URL = process.env.REACT_APP_API_BASE_URL || '';

  // <<< 2. CREAMOS FUNCIONES GENÉRICAS PARA MANEJAR ARCHIVOS >>>
  const processCoverArtFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setCoverArtFile(file);
      setCoverArtName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setCoverArtPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setError('Por favor, selecciona un archivo de imagen válido para la portada.');
    }
  };

  const processAudioFile = (file) => {
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioFileName(file.name);
    } else {
      setError('Por favor, selecciona un archivo de audio válido.');
    }
  };

  // <<< 3. LOS MANEJADORES DE CLIC AHORA USAN LAS FUNCIONES GENÉRICAS >>>
  const handleCoverArtChange = (event) => {
    const file = event.target.files[0];
    if (file) processCoverArtFile(file);
  };

  const handleAudioFileChange = (event) => {
    const file = event.target.files[0];
    if (file) processAudioFile(file);
  };
  
  // <<< 4. NUEVOS MANEJADORES DE EVENTOS PARA DRAG & DROP >>>
  const handleDragEvents = (e, setDragging) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragging(true);
    } else if (e.type === 'dragleave') {
      setDragging(false);
    }
  };

  const handleDrop = (e, fileProcessor, setDragging) => {
    handleDragEvents(e, setDragging); // Llama para resetear el estado visual
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      fileProcessor(e.dataTransfer.files[0]);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!title || !artist || !genre || !coverArtFile || !audioFile) {
      setError('Por favor, completa todos los campos y selecciona los archivos.'); return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('featuredArtists', featuredArtists);
    formData.append('genre', genre);
    formData.append('coverArt', coverArtFile);
    formData.append('audioFile', audioFile);

    try {
      const response = await fetch(`${API_URL}/api/upload_audio.php`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.details || data.error || 'Error al subir la canción');
      }

      if (onUploadSuccess && data.song && data.song.id) {
        onUploadSuccess(data.song);
        setTitle(''); setArtist(''); setFeaturedArtists(''); setGenre('');
        setCoverArtFile(null); setAudioFile(null);
        setCoverArtName(''); setAudioFileName(''); setCoverArtPreview(null);
      } else {
        throw new Error('Respuesta inválida del servidor tras la subida.');
      }
    } catch (err) {
      console.error("Error subiendo canción:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="upload-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}
      <header className="upload-header-modal">
        <h1 className="welcome-message-modal">Sube tu Música</h1>
      </header>
      <div className="upload-form-container">
        {error && <p className="form-error-message" style={{color: 'red', textAlign: 'center', marginBottom: '15px'}}>{error}</p>}
        <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title-upload">Título de la canción</label>
              <input type="text" id="title-upload" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="artist-upload">Artista principal</label>
              <input type="text" id="artist-upload" value={artist} onChange={(e) => setArtist(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="featured-artists-upload">Artistas invitados (opcional)</label>
              <input type="text" id="featured-artists-upload" value={featuredArtists} onChange={(e) => setFeaturedArtists(e.target.value)} placeholder="Ej: Artista1, Artista2"/>
            </div>
            <div className="form-group">
              <label htmlFor="genre-upload">Género principal</label>
              <input type="text" id="genre-upload" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            </div>

            <hr className="form-separator" />

            {/* <<< 5. AÑADIMOS LOS EVENTOS DE DRAG & DROP AL CONTENEDOR >>> */}
            <div 
              className={`form-group file-input-container ${isDraggingCover ? 'drag-over' : ''}`}
              onDragEnter={(e) => handleDragEvents(e, setIsDraggingCover)}
              onDragLeave={(e) => handleDragEvents(e, setIsDraggingCover)}
              onDragOver={(e) => handleDragEvents(e, setIsDraggingCover)}
              onDrop={(e) => handleDrop(e, processCoverArtFile, setIsDraggingCover)}
            >
              <label htmlFor="cover-art-input" className="file-input-label">
                {coverArtPreview ? (
                  <img src={coverArtPreview} alt="Vista previa portada" className="upload-preview-image" />
                ) : (
                  <span>Arrastra una portada aquí o haz clic para seleccionar</span>
                )}
                <UploadIcon />
              </label>
              <input type="file" id="cover-art-input" accept="image/jpeg, image/png, image/gif, image/webp" onChange={handleCoverArtChange} style={{ display: 'none' }} />
              {coverArtName && <span className="file-name-display">{coverArtName}</span>}
            </div>

            <div 
              className={`form-group file-input-container ${isDraggingAudio ? 'drag-over' : ''}`}
              onDragEnter={(e) => handleDragEvents(e, setIsDraggingAudio)}
              onDragLeave={(e) => handleDragEvents(e, setIsDraggingAudio)}
              onDragOver={(e) => handleDragEvents(e, setIsDraggingAudio)}
              onDrop={(e) => handleDrop(e, processAudioFile, setIsDraggingAudio)}
            >
              <label htmlFor="audio-file-input" className="file-input-label">
                <span>Arrastra un archivo de audio aquí o haz clic para seleccionar</span>
                <UploadIcon />
              </label>
              <input type="file" id="audio-file-input" accept=".mp3,audio/mpeg,audio/wav,audio/ogg,audio/aac" onChange={handleAudioFileChange} style={{ display: 'none' }} />
              {audioFileName && <span className="file-name-display">{audioFileName}</span>}
            </div>

            <button type="submit" className="submit-button upload-submit-button" disabled={loading}>
              {loading ? 'Subiendo...' : 'SUBIR CANCIÓN'}
            </button>
          </form>
      </div>
    </div>
  );
}
export default UploadPage;