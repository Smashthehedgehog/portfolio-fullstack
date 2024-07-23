import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';

export default function ImageCarousel({images}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='carousel-image-container d-flex align-items-center'>
      {images.map((image, index) => (
        <img key={index} src={image} alt={`slide ${index}`} width={'230rem'} height={'230rem'}
          className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}