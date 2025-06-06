// UploadPage.jsx (CORREGIDO)
import React, { useState } from 'react';
import './UploadPage.css'; // Asegúrate que este archivo CSS se llame así

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
    // En el backend, usas $_FILES['coverArt'] y $_FILES['audioFile'], así que mantenemos esos nombres.
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

      // Corregimos la condición para que busque dentro del objeto 'song'
      if (!response.ok || !data.success) { // <<< 1. VERIFICAMOS EL ÉXITO PRIMERO
        throw new Error(data.error || data.message || 'Error al subir la canción');
      }

      // La lógica del éxito ahora busca dentro de `data.song`
      if (onUploadSuccess && data.song && data.song.id) { // <<< 2. BUSCAMOS EL ID DENTRO DE `data.song`
        onUploadSuccess(data.song); // Pasamos solo el objeto de la canción
        // Limpiar formulario
        setTitle(''); setArtist(''); setFeaturedArtists(''); setGenre('');
        setCoverArtFile(null); setAudioFile(null);
        setCoverArtName(''); setAudioFileName(''); setCoverArtPreview(null);
      } else {
        console.warn("Subida exitosa pero la respuesta del servidor no tiene el formato esperado.", data);
        throw new Error('Respuesta inválida del servidor tras la subida.');
      }
    } catch (err) {
      console.error("Error subiendo canción:", err);
      // Extraemos el mensaje de la respuesta si es posible
      const errorMessage = err.response ? await err.response.json().then(d => d.details || d.error) : err.message;
      setError(errorMessage || 'Ocurrió un error inesperado.');
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

            <div className="form-group file-input-container">
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

            <div className="form-group file-input-container">
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