// "use client";
// import React, { useEffect, useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules'; // Fix: Import Autoplay from 'swiper' instead of { Autoplay }
// import 'swiper/css'; // Import Swiper styles
// import style from './style.module.css';
// import fire from '../../../../../../public/redDot.gif'; // Fix: Use default import syntax for 'fire.gif'
// import LocalizedClientLink from '@modules/common/components/localized-client-link';
// import TextConvertor from '@modules/products/components/text-convertor';
// import { useTranslation } from 'react-i18next';
// // Assuming the rest of your Product and ProductCardProps interfaces remain unchanged
// interface Product {
//     id: string;
//     thumbnail: string;
//     title: string;
//     subtitle?: string;
//     handle: string;
//     metadata?: any;
// }
  
//   interface ProductCardProps {
//     product: Product;
//   }
  
// const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
//   const [locale, setLocale] = useState(localStorage.getItem("lang") ?? "en");

//   return (
//     <div className="product-card rounded-lg h-[200px] w-full flex flex-col bg-white shadow-lg overflow-hidden">
//     {/* Fixed height for the image container */}
//     <div className="h-2/3 overflow-hidden">
//       <img src={product.thumbnail} className="w-full h-full object-cover" alt={product.title} />
//     </div>
//     {/* Title and subtitle with padding for spacing */}
//     <div className="flex-1 px-2 pb-4 pt-2">
//       <button className="text-sm font-semibold "><TextConvertor locale={locale ?? "en"} title={product.title as string} metadata={product?.metadata?.title ?? null as any} /></button>
//       <p className="text-xs ">{product.subtitle}</p>
//     </div>
//   </div>

             
//   );
// };

// interface ProductSliderProps {
//   products: Product[];
// }

// const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {


//   const [swiperDirection, setSwiperDirection] = useState<'horizontal' | 'vertical'>('vertical');
//   const [swiperHeight, setSwiperHeight] = useState('auto');
 
//   const { t } = useTranslation();
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 767) {
//         setSwiperDirection('horizontal');
//         setSwiperHeight('auto');
//       } else {
//         setSwiperDirection('vertical');
//         setSwiperHeight('100%');
//       }
//     };

//     // Set initial direction based on the current window size
//     handleResize();

//     // Add event listener
//     window.addEventListener('resize', handleResize);

//     // Clean up event listener
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);



//   return ( 
//     <>
//     <div className='w-full top-2 relative mb-4 flex justify-between items-center'>
//     <div className='flex justify-between w-fit gap-1'>
//       <img src={fire.src} style={{width:'27px'}}/><h2 className="dark:text-white  whitespace-nowrap  dark:bg-transparent text-lg text-center font-bold">{t("the-hottest")}</h2>
//       </div>
//       </div>   
//     <Swiper
//        modules={[Navigation, Autoplay,Pagination, Scrollbar, A11y]}
//        slidesPerView={'auto'}
//        style={{height: swiperHeight}}
//        spaceBetween={15}
//         autoplay={{
//         delay: 2200, // Delay in milliseconds between slides auto change, adjust as needed
//         disableOnInteraction: false, // Continue autoplay after user interactions
//         pauseOnMouseEnter:true,
//         reverseDirection:true // Continue autoplay after user interactions
//       }}
//       loop={true} // Enable looping for infinite scroll effect
//       direction={swiperDirection}
//       breakpoints={{
//         // When window width is <= 767px
//         767: {
//           slidesPerView: 2,
//           spaceBetween: 10,
//         },
//       }}
//       // Change to 'horizontal' if you want a horizontal slider
//     >
//         {products.map((product) => (
//             //eslint-disable-next-line
            
//             <SwiperSlide key={product.id} className={`${style.swiperSlide}`}>
//             <LocalizedClientLink href={`/products/${product.handle}`} key={product.id}>
//                 <ProductCard key={product.id} product={product} />
//                 </LocalizedClientLink>
//             </SwiperSlide>
         
//         ))}
//     </Swiper>
//     </>
//   );
// };

// export default ProductSlider;

"use client";
import React, { useEffect, useState } from 'react';
// Removed Swiper imports since we are using react-fast-marquee instead
import 'swiper/css'; // You might not need this import anymore unless other parts of your project use Swiper
import style from './style.module.css';
import fire from '../../../../../../public/redDot.gif'; // Adjusted comment to reflect default import usage
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import TextConvertor from '@modules/products/components/text-convertor';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Marquee from 'react-easy-marquee'; // Added import for react-fast-marquee
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

interface ProductSliderProps {
  products: Product[];
  locale: string;
}


function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [locale, setLocale] = useState(localStorage.getItem("lang") ?? "en");
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isRtlLocale = ['ar', 'he'].includes(locale);
  const marqueeDirection = isMobile ? (isRtlLocale ? 'left' : 'right') : 'down';
  return (
    <div className="product-card rounded-lg h-[200px] w-full flex flex-col bg-white shadow-lg overflow-hidden">
      <div className="h-2/3 overflow-hidden">
        <img src={product.thumbnail} className='w-full h-full object-cover' alt={product.title} />
      </div>
      <div className="flex-1 px-2 pb-4 pt-2">
        <button className="text-sm font-semibold ">
          <TextConvertor locale={locale ?? "en"} title={product.title as string} metadata={product?.metadata?.title ?? null as any} />
        </button>
        <p className="text-xs ">{product.subtitle}</p>
      </div>
    </div>
  );
};


const ProductSlider: React.FC<ProductSliderProps> = ({ products, locale }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isRtlLocale = ['ar', 'he'].includes(locale);

  return (
    <>
      <div className='w-full top-2 relative mb-4 flex justify-between items-center'>
        <div className='flex justify-between w-fit gap-1'>
          <Image src={fire.src} width={27} height={27} alt='hottest products animation'/>
          <h2 className="dark:text-white whitespace-nowrap dark:bg-transparent text-lg text-center font-bold">{t("the-hottest")}</h2>
        </div>
      </div>
      {isMobile ? (
        <Marquee 
          duration={20000}
          height="200px"
          className='custom-marquee'
          reverse={isRtlLocale}
          pauseOnHover={true}
        >
          {products.map((product, index) => (
            <LocalizedClientLink className='mr-2 ml-2 w-[150px]' href={`/products/${product.handle}`} key={index}>
              <ProductCard product={product} />
            </LocalizedClientLink>
          ))}
        </Marquee>
      ) : (
        <div className="vertical-marquee-container" style={{ height: '100%', overflow: 'hidden' }}>
          <div className="vertical-marquee-content" style={{
            animation: 'verticalMarquee 30s linear infinite',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {products.concat(products).map((product, index) => (
      <LocalizedClientLink className='my-2' href={`/products/${product.handle}`} key={index}>
        <ProductCard product={product} />
      </LocalizedClientLink>
    ))}
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes verticalMarquee {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
      `}</style>
    </>
  );
};

export default ProductSlider;