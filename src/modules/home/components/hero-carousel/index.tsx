"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules"
import "swiper/css" // core Swiper
import "swiper/css/navigation" // Navigation module
import "swiper/css/pagination" // Pagination module
import heroBanner from "../../../../../public/PixelsJourney.png"
import heroBanner2 from "../../../../../public/PixelsJourneyCopy.png"
import heroBanner3 from "../../../../../public/PixelsJourneyCopy2.png"
import './custom-swiper-style.css';
const MySwiperComponent = () => {
  return (
    <Swiper
      style={{ height: "100%", width: "100%" }}
      modules={[Navigation,Autoplay, Pagination]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2500,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
        reverseDirection: true,
      }}
      loop={true}
      
    >
      <SwiperSlide>
        {" "}
        <img
          src={heroBanner.src}
          alt="Background"
          className="absolute w-full h-full z-0 rounded-lg object-fit"
        />{" "}
      </SwiperSlide>
      <SwiperSlide>
        {" "}
        <img
          src={heroBanner2.src}
          alt="Background"
          className="absolute w-full h-full z-0 rounded-lg object-fit"
        />{" "}
      </SwiperSlide>
      <SwiperSlide>
        {" "}
        <img
          src={heroBanner3.src}
          alt="Background"
          className="absolute w-full h-full z-0 rounded-lg object-fit"
        />{" "}
      </SwiperSlide>
      {/* Add more <SwiperSlide> components as needed */}
    </Swiper>
  )
}

export default MySwiperComponent
