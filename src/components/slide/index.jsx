import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
//import { baseUrl } from "./config";

const SimpleSlider = (props) => {
    const { slides, slidesToShow, dots, infinite, speed, fade, autoplay, arrow } = props;

    console.log(slides);

    var settings = {
        dots: dots !== undefined ? dots : false,
        fade: fade !== undefined ? fade : false,
        infinite: infinite !== undefined ? infinite : false,
        autoplay: autoplay !== undefined ? autoplay : false,
        speed: speed !== undefined ? speed : 500,
        slidesToShow: slidesToShow !== undefined ? slidesToShow : 1,
        arrows: arrow !== undefined ? arrow : false,
        slidesToScroll: 1,
        waitForAnimate: false
    };

    return (
        <Slider {...settings}>
            {slides.map((slide, index) => (
                <div className="inner-slide" key={index}>
                    <Image
                        //src={slide.image_url}
                        src={slide}
                        alt={`Slide ${index}`}
                        className="object-cover h-full w-full"
                    />
                </div>
            ))}
        </Slider>
    );
}

export default SimpleSlider;