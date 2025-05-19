'use client'


interface SimpleSliderProps {
  images: string[];
}


import React from "react";
import Slider from "react-slick";

function Fade({ images }: SimpleSliderProps) {
  const settings = {
      autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    dots: true,
    fade: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false
  };
  return (
    <div className="slider-container ">
      <Slider {...settings}>

             {images.map((image, index) => (
          <div key={index} className="slider-item ">
          
          <img
  src={image}
  alt={`Apartment image ${index + 1}`}
  className="w-full h-48 object-cover"
/>
          </div>
        ))}
     
     
   
      </Slider>
    </div>
  );
}

export default Fade;
