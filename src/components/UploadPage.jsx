// UploadPage.jsx
import React, { useState } from 'react';
import './UploadPage.css'; // Asegúrate que este archivo CSS se llame así

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px', verticalAlign: 'middle', color: '#b3b3b3' }}> {/* Ajustado el color y tamaño */}
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

  const API_URL = process.env.REACT_APP_API_BASE_URL || '';

  const handleCoverArtChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverArtFile(file);
      setCoverArtName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setCoverArtPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setCoverArtFile(null); setCoverArtName(''); setCoverArtPreview(null);
    }
  };

  const handleAudioFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file); setAudioFileName(file.name);
    } else {
      setAudioFile(null); setAudioFileName('');
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

      if (!response.ok || data.error) {
        throw new Error(data.error || data.message || 'Error al subir la canción');
      }
      if (onUploadSuccess && data.id) { // Asumiendo que la API devuelve el objeto de la canción subida con su id
        onUploadSuccess(data);
        // Limpiar formulario
        setTitle(''); setArtist(''); setFeaturedArtists(''); setGenre('');
        setCoverArtFile(null); setAudioFile(null);
        setCoverArtName(''); setAudioFileName(''); setCoverArtPreview(null);
      } else {
        console.warn("Subida exitosa pero no se recibió 'data.id' o 'onUploadSuccess' no está definida.", data);
        throw new Error('Respuesta inválida del servidor tras la subida.');
      }
    } catch (err) {
      console.error("Error subiendo canción:", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    // Este div ya tiene la clase base para el contenido del overlay
    <div className="upload-page-overlay-content">
      {onClose && <button onClick={onClose} className="overlay-close-button" aria-label="Cerrar">×</button>}

      {/* Encabezado del modal de subida - usamos clases de App.css */}
      <header className="upload-header-modal"> {/* Clase de App.css */}
        <h1 className="welcome-message-modal">Sube tu Música</h1> {/* Clase de App.css */}
      </header>

      {/* Contenedor del formulario de subida */}
      <div className="upload-form-container"> {/* Esta clase la definiremos en UploadPage.css */}
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
              <label htmlFor="featured-artists-upload">Artistas invitados (opcional, separados por coma)</label>
              <input type="text" id="featured-artists-upload" value={featuredArtists} onChange={(e) => setFeaturedArtists(e.target.value)} placeholder="Ej: Artista1, Artista2"/>
            </div>
            <div className="form-group">
              <label htmlFor="genre-upload">Género principal</label>
              <input type="text" id="genre-upload" value={genre} onChange={(e) => setGenre(e.target.value)} required />
            </div>

            <hr className="form-separator" /> {/* Separador visual */}

            <div className="form-group file-input-container"> {/* Contenedor para el input de portada */}
              <label htmlFor="cover-art-input" className="file-input-label">
                {coverArtPreview ? (
                  <img src={coverArtPreview} alt="Vista previa portada" className="upload-preview-image" />
                ) : (
                  <span>Seleccionar portada</span>
                )}
                <UploadIcon />
              </label>
              <input type="file" id="cover-art-input" accept="image/jpeg, image/png, image/gif, image/webp" onChange={handleCoverArtChange} style={{ display: 'none' }} required />
              {coverArtName && <span className="file-name-display">{coverArtName}</span>}
            </div>

            <div className="form-group file-input-container"> {/* Contenedor para el input de audio */}
              <label htmlFor="audio-file-input" className="file-input-label">
                <span>Seleccionar archivo de audio</span>
                <UploadIcon />
              </label>
              <input type="file" id="audio-file-input" accept=".mp3,audio/mpeg,audio/wav,audio/ogg,audio/aac" onChange={handleAudioFileChange} style={{ display: 'none' }} required />
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