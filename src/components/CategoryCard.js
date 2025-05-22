import React from 'react';

const CategoryCard = ({ title, imageUrl, size }) => {
  let cardClass = "category-card";
  if (size === "wide") cardClass += " wide";
  if (size === "tall") cardClass += " tall";

  return (
    <div className={cardClass}>
      <img src={imageUrl} alt={title} />
      <div className="category-card-title">{title}</div>
    </div>
  );
};

export default CategoryCard;