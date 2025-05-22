// src/pages/HomePage.js
import React from 'react';
import CategoryCard from '../components/CategoryCard'; // Ajusta la ruta si es necesario
import SongPlayer from '../components/SongPlayer';   // Ajusta la ruta si es necesario

// Los datos pueden pasarse como props o importarse aquí si son estáticos y solo para HomePage
// Por simplicidad, los pasaremos como props desde App.js por ahora.

const HomePage = ({ categoriesData, songsData }) => {
  // Lógica para ordenar las categorías si es específica de HomePage
  // Si esta lógica se usa en más sitios, podría ser una función helper
  const gridCategoriesInOrder = [
    "Tendencias", "Top en España", "Del momento", "Recomendadas",
    "Artistas del momento", "Para ti",
    "Álbum del momento", "Géneros", "Nuevos", "Random", "Podcasts"
  ]
    .map(title => categoriesData.find(c => c.title === title))
    .filter(Boolean); // filter(Boolean) elimina cualquier undefined si algún título no se encuentra

  return (
    <> {/* Usamos un Fragmento React <>...</> ya que Routes espera un solo elemento hijo */}
      <h2 className="welcome-title">Bienvenido a <span className="highlight">Sampler</span></h2>
      <div className="categories-grid">
        {gridCategoriesInOrder.map(category => (
          category && <CategoryCard key={category.id} title={category.title} imageUrl={category.imageUrl} size={category.size} />
        ))}
      </div>
      <div className="song-list">
        {songsData.map(song => (
          <SongPlayer key={song.id} albumArt={song.albumArt} title={song.title} artist={song.artist} duration={song.duration} />
        ))}
      </div>
    </>
  );
};

export default HomePage;