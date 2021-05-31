import React, {useState} from 'react'
import {Carousel,Row, Col} from "react-bootstrap";

function ControlledCarousel() {
    const [index, setIndex] = useState(0);
  
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
  
    return (
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item class="crop" style={{background:"black"}}>
        <Row className="justify-content-center">
          <img
            src="https://image.tmdb.org/t/p/w500/knjeEeeyIwDkUtZwDfJOcUIuNdB.jpg"
            alt="First slide"
            width="1200" height="800"
          />
        </Row>

        </Carousel.Item>
        <Carousel.Item class="crop" style={{background:"black"}}>
        <Row className="justify-content-center">
              <img
                src="https://image.tmdb.org/t/p/w500/fYOJaaCpqq1NatziVJntmsXXDi8.jpg"
                alt="Second slide"
                width="1200" height="800"
            />
         </Row>

        </Carousel.Item>
        <Carousel.Item className="justify-content-center" style={{background:"black"}}>
        <Row className="justify-content-center">
          <img
            src="https://image.tmdb.org/t/p/w500/y89kFMNYXNKMdlZjR2yg7nQtcQH.jpg"
            alt="Third slide"
            width="1200" height="800"
          />
        </Row>
        </Carousel.Item>
      </Carousel>
    );
  }
  
  export default ControlledCarousel;
