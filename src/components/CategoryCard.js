// components/CategoryCard.jsx

import React from 'react';

// 1. Añade 'onClick' a la lista de props que recibe el componente.
const CategoryCard = ({ title, imageUrl, size, onClick }) => {
  
  // Mantenemos tu lógica para las clases 'wide' y 'tall'.
  let cardClass = "category-card";
  if (size === "wide") cardClass += " wide";
  if (size === "tall") cardClass += " tall";
  
  // 3. (Recomendado) Si la prop onClick existe, añadimos una clase 'clickable'.
  // Esto nos permitirá darle un estilo especial con CSS (ej. cambiar el cursor).
  if (onClick) {
    cardClass += " clickable";
  }

  return (
    // 2. Añade el manejador de evento 'onClick' al div principal.
    // Ahora, cuando se haga clic en este div, se ejecutará la función que le pasaste.
    <div className={cardClass} onClick={onClick}>
      <img src={imageUrl} alt={title} />
      <div className="category-card-title">{title}</div>
    </div>
  );
};

export default CategoryCard;