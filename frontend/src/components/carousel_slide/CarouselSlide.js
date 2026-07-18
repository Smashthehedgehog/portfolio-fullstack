import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import './CarouselSlide.css';

export default function CarouselSlide({ imageURLs }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const showPrevImage = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const showNextImage = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        onSelect();
        emblaApi.on('select', onSelect);
        return () => emblaApi.off('select', onSelect);
    }, [emblaApi]);

    function handleKeyDown(e) {
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }

    return (
        <div className="d-flex position-relative">
            <div
                className="embla w-100 h-100"
                ref={emblaRef}
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                <div className="embla__container w-100 h-100">
                    {imageURLs.map((url, index) => (
                        <div className="embla__slide" key={index}>
                            <img
                                src={url}
                                alt={`Slide ${index + 1}`}
                                loading="lazy"
                                className="object-fit-cover w-100 h-100 carousel-slider-image d-block"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="carousel-slider-button d-block position-absolute text-light"
                style={{ left: 0 }}
                onClick={showPrevImage}
                aria-label="Previous image"
            >
                <i className="button-styles bi-arrow-left-circle-fill"></i>
            </button>
            <button
                className="carousel-slider-button d-block position-absolute text-light"
                style={{ right: 0 }}
                onClick={showNextImage}
                aria-label="Next image"
            >
                <i className="button-styles bi-arrow-right-circle-fill"></i>
            </button>

            <div className="image-index-buttons-container d-flex position-absolute">
                {imageURLs.map((_, index) => (
                    <button
                        key={index}
                        className="image-index-buttons"
                        onClick={() => emblaApi?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === selectedIndex}
                    >
                        {index === selectedIndex ? <i className="bi-circle-fill"></i> : <i className="bi-circle"></i>}
                    </button>
                ))}
            </div>
        </div>
    );
}
