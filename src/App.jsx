// src/App.js
import React from 'react';
import './App.css';
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import SongPlayer from './components/SongPlayer';

const categoriesData = [
  { id: 1, title: "Tendencias", imageUrl: "/Imagenes/tupac.jpg" },
  { id: 2, title: "Top en España", imageUrl: "https://via.placeholder.com/300x300/5cb85c/fff?text=Artist+Green", size: "" },
  { id: 3, title: "Del momento", imageUrl: "https://via.placeholder.com/300x300/333/fff?text=Artist+BW", size: "" },
  { id: 4, title: "Recomendadas", imageUrl: "https://via.placeholder.com/300x300/d9534f/fff?text=Artist+Red", size: "" },
  { id: 5, title: "Álbum del momento", imageUrl: "https://via.placeholder.com/300x400/f0ad4e/000?text=MJ", size: "tall" },
  { id: 6, title: "Artistas del momento", imageUrl: "https://via.placeholder.com/620x300/444/fff?text=Bearded+Artist", size: "wide" },
  { id: 7, title: "Para ti", imageUrl: "https://via.placeholder.com/300x300/5bc0de/fff?text=Artist+Chair", size: "" },
  { id: 8, title: "Random", imageUrl: "https://via.placeholder.com/300x300/999/000?text=Dice", size: "" },
  { id: 10, title: "Géneros", imageUrl: "https://via.placeholder.com/300x300/A52A2A/fff?text=Mozart", size: "" },
  { id: 11, title: "Nuevos", imageUrl: "https://via.placeholder.com/300x300/228B22/fff?text=Young+Artist", size: "" },
  { id: 12, title: "Podcasts", imageUrl: "https://via.placeholder.com/620x300/666/fff?text=Podcast+Hosts", size: "wide" },
];

const songsData = [
  { id: 1, albumArt: "https://via.placeholder.com/100/8A2BE2/fff?text=Art1", title: "Canción", artist: "Nombre del artista", duration: "4:20" },
  { id: 2, albumArt: "https://via.placeholder.com/100/6A0DAD/fff?text=Art2", title: "Canción", artist: "Nombre del artista", duration: "4:20" },
  { id: 3, albumArt: "https://via.placeholder.com/100/4B0082/fff?text=Art3", title: "Canción", artist: "Nombre del artista", duration: "4:20" },
  { id: 4, albumArt: "https://via.placeholder.com/100/3A005E/fff?text=Art4", title: "Canción", artist: "Nombre del artista", duration: "4:20" },
];

function App() {
  const gridCategoriesInOrder = [
    "Tendencias", "Top en España", "Del momento", "Recomendadas",
    "Artistas del momento", "Para ti",
    "Álbum del momento", "Géneros", "Nuevos", "Random", "Podcasts"
  ]
    .map(title => categoriesData.find(c => c.title === title))
    .filter(Boolean); // Elimina cualquier undefined

  return (
    <div className="app-container">
      <Header />
      <h2 className="welcome-title">Bienvenido a <span className="highlight">Sampler</span></h2>

      <div className="categories-grid">
        {gridCategoriesInOrder.map(category => (
          <CategoryCard
            key={category.id}
            title={category.title}
            imageUrl={category.imageUrl}
            size={category.size}
          />
        ))}
      </div>

      <div className="song-list">
        {songsData.map(song => (
          <SongPlayer
            key={song.id}
            albumArt={song.albumArt}
            title={song.title}
            artist={song.artist}
            duration={song.duration}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
