import React, {useState} from 'react'
import {ModalBody, ModalFooter, Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem} from 'reactstrap'

const items = [
    {
      src: 'https://i.imgur.com/PUHSFlu.jpg',
      altText: 'Slide 1',
      caption: 'three to one'
    },
    {
      src: 'https://i.imgur.com/dPGl5UY.jpg',
      altText: 'Slide 2',
      caption: 'Slide 2'
    },
    {
      src: 'https://i.imgur.com/tkQxuwk.jpg',
      altText: 'Slide 3',
      caption: 'Slide 3'
    }
  ];
  
  const Explain = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
  
    const next = () => {
      if (animating) return;
      const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
      setActiveIndex(nextIndex);
    }
  
    const previous = () => {
      if (animating) return;
      const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
      setActiveIndex(nextIndex);
    }
  
    const goToIndex = (newIndex) => {
      if (animating) return;
      setActiveIndex(newIndex);
    }
  
    const slides = items.map((item) => {
      return (
        <CarouselItem
          onExiting={() => setAnimating(true)}
          onExited={() => setAnimating(false)}
          key={item.src}
        >
          <img src={item.src} alt={item.altText} />
        </CarouselItem>
      );
    });
  
    return (
    <>
   
      <Carousel
        activeIndex={activeIndex}
        next={next}
        previous={previous}
      >
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
      </Carousel>
   
    </>
    );
  }

  export default Explain
  
