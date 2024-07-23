import { useState } from "react";
import './CarouselSlide.css';

// https://www.youtube.com/watch?v=Kx8XlKRBZx8
// come back to this video for expert version

export default function CarouselSlide({ imageURLs }) {
    const [imageIndex, setImageIndex] = useState(0); // sets component to first image

    function showNextImage() {
        setImageIndex((index) => {
            if (index === imageURLs.length - 1) return 0
            return index + 1
        });
    }

    function showPrevImage() {
        setImageIndex((index) => {
            if (index === 0) return imageURLs.length - 1
            return index - 1
        });
    }

    return (
        <div className="d-flex position-relative">
            <div className="w-100 h-100 d-flex overflow-hidden">
                {imageURLs.map(url => 
                    <img
                        key={url}
                        src={url}
                        className="object-fit-cover w-100 h-100 carousel-slider-image d-block"
                        style={{ translate: `${-100 * imageIndex}%`}}/>
                )}
            </div>
            
            <button className="carousel-slider-button d-block position-absolute text-light" style={{ left: 0 }} onClick={showPrevImage}>
                <i className="button-styles bi-arrow-left-circle-fill" ></i>
            </button>
            <button className="carousel-slider-button d-block position-absolute text-light" style={{ right: 0 }} onClick={showNextImage}>
                <i className="button-styles bi-arrow-right-circle-fill"></i>
            </button>

            <div className="image-index-buttons-container d-flex position-absolute">
                {imageURLs.map((_, index) => (
                    <button className="image-index-buttons" onClick={() => setImageIndex(index)}>
                        {index === imageIndex ? <i class="bi-circle-fill"></i> : <i class="bi-circle"></i>}
                    </button>
                ))}
            </div>
        </div>

    );
}