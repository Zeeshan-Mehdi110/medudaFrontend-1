"use client";
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules'; // Fix: Import Autoplay from 'swiper' instead of { Autoplay }
import 'swiper/css'; // Import Swiper styles
import style from './style.module.css';
import fire from '../../../../../../public/redDot.gif'; // Fix: Use default import syntax for 'fire.gif'
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import TextConvertor from '@modules/products/components/text-convertor';

// Assuming the rest of your Product and ProductCardProps interfaces remain unchanged
interface Product {
    id: string;
    thumbnail: string;
    title: string;
    subtitle?: string;
    handle: string;
    metadata?: any;
}
  
  interface ProductCardProps {
    product: Product;
  }
  
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [locale, setLocale] = useState(localStorage.getItem("lang") ?? "en");
  return (
    <div className="product-card rounded-lg h-[200px] max-w-48 mr-2 flex flex-col bg-white shadow-lg overflow-hidden">
    {/* Fixed height for the image container */}
    <div className="h-2/3 overflow-hidden">
      <img src={product.thumbnail} className="w-full h-full object-cover" alt={product.title} />
    </div>
    {/* Title and subtitle with padding for spacing */}
    <div className="flex-1 px-2 pb-4 pt-2">
      <button className="text-sm font-semibold "><TextConvertor locale={locale ?? "en"} title={product.title as string} metadata={product?.metadata?.title ?? null as any} /></button>
      <p className="text-xs ">{product.subtitle}</p>
    </div>
  </div>

             
  );
};

interface ProductSliderProps {
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {


  const [swiperDirection, setSwiperDirection] = useState<'horizontal' | 'vertical'>('vertical');
  const [swiperHeight, setSwiperHeight] = useState('auto');
  const [isRtl, setIsRtl] = useState(localStorage.getItem('lang') === 'ar' || localStorage.getItem('lang') === 'he' ? true : false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 767) {
        setSwiperDirection('horizontal');
        setSwiperHeight('auto');
      } else {
        setSwiperDirection('vertical');
        setSwiperHeight('100%');
      }
    };

    // Set initial direction based on the current window size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  return ( 
    <>
    <div className='w-full top-2 relative mb-4 flex justify-between items-center'><img src={fire.src} style={{width:'22px'}}/><h2 className="dark:text-white absolute left-6 whitespace-nowrap  dark:bg-transparent text-lg text-center font-bold">The Hottest</h2></div>   
    <Swiper
       modules={[Navigation, Autoplay,Pagination, Scrollbar, A11y]}
       slidesPerView={'auto'}
       style={{height: swiperHeight}}
       spaceBetween={15}
        autoplay={{
        delay: 2200, // Delay in milliseconds between slides auto change, adjust as needed
        disableOnInteraction: false, // Continue autoplay after user interactions
        pauseOnMouseEnter:true,
        reverseDirection:true // Continue autoplay after user interactions
      }}
      loop={true} // Enable looping for infinite scroll effect
      direction={swiperDirection}
      dir={swiperDirection === "horizontal" ? (isRtl ? "rtl" : "ltr") : undefined}
      breakpoints={{
        // When window width is <= 767px
        767: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
      }}
      // Change to 'horizontal' if you want a horizontal slider
    >
        {products.map((product) => (
            //eslint-disable-next-line
            
            <SwiperSlide key={product.id} className={`${style.swiperSlide}`}>
            <LocalizedClientLink href={`/products/${product.handle}`} key={product.id}>
                <ProductCard key={product.id} product={product} />
                </LocalizedClientLink>
            </SwiperSlide>
         
        ))}
    </Swiper>
    </>
  );
};

export default ProductSlider;

