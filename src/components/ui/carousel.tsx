import { ReactNode, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface CarouselProps {
  children: ReactNode[];
  itemsPerSlide?: number;
  className?: string;
  showDots?: boolean;
}

export function Carousel({
  children,
  itemsPerSlide = 3,
  className = '',
  showDots = true,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    skipSnaps: false,
    inViewThreshold: 0.7,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const totalSlides = Math.ceil(children.length / itemsPerSlide);
  const extendedChildren = [...children, ...children, ...children];
  
  const slides = [];
  for (let i = 0; i < extendedChildren.length; i += itemsPerSlide) {
    slides.push(extendedChildren.slice(i, i + itemsPerSlide));
  }

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slideItems, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 grid md:grid-cols-3 gap-6 px-1"
            >
              {slideItems}
            </div>
          ))}
        </div>
      </div>

      {showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`
                rounded-full transition-all duration-300
                ${
                  index === (selectedIndex % totalSlides)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-3'
                    : 'bg-gray-300 hover:bg-gray-400 w-3 h-3'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

