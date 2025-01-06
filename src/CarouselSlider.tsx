import React from "react";
import Slider from "react-slick";

const CarouselSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Slider {...settings}>
        <div className="p-4 bg-indigo-600 text-white rounded-lg">
          <h2 className="text-2xl font-bold">Welcome to Hall Management</h2>
          <p>Streamlining your accommodation process.</p>
        </div>
        <div className="p-4 bg-purple-600 text-white rounded-lg">
          <h2 className="text-2xl font-bold">Easy Payments</h2>
          <p>Pay your hall and dining fees online securely.</p>
        </div>
        <div className="p-4 bg-pink-600 text-white rounded-lg">
          <h2 className="text-2xl font-bold">Stay Updated</h2>
          <p>Access important notices and updates instantly.</p>
        </div>
      </Slider>
    </div>
  );
};

export default CarouselSlider;
