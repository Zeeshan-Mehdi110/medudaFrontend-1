// "use client";
// import React, { useEffect, useState } from 'react';
// // Removed Swiper imports since we are using react-fast-marquee instead
// import 'swiper/css'; // You might not need this import anymore unless other parts of your project use Swiper
// import style from './style.module.css';
// import fire from '../../../../../../public/redDot.gif'; // Adjusted comment to reflect default import usage
// import LocalizedClientLink from '@modules/common/components/localized-client-link';
// import TextConvertor from '@modules/products/components/text-convertor';
// import { useTranslation } from 'react-i18next';
// import Image from 'next/image';
// import Marquee from 'react-easy-marquee'; // Added import for react-fast-marquee
// interface Product {
//   id: string;
//   thumbnail: string;
//   title: string;
//   subtitle?: string;
//   handle: string;
//   metadata?: any;
// }

// interface ProductCardProps {
//   product: Product;
//   locale: string;
// }

// interface ProductSliderProps {
//   products: Product[];
//   locale: string;
// }

// function useMediaQuery(query: string) {
//   const [matches, setMatches] = useState(false);

//   useEffect(() => {
//     const media = window.matchMedia(query);
//     if (media.matches !== matches) {
//       setMatches(media.matches);
//     }
//     const listener = () => {
//       setMatches(media.matches);
//     };
//     media.addEventListener('change', listener);
//     return () => media.removeEventListener('change', listener);
//   }, [matches, query]);

//   return matches;
// }

// const ProductCard: React.FC<ProductCardProps> = ({ product,locale }) => {

//   return (
//     <div className="product-card rounded-lg h-[200px] w-full flex flex-col bg-white shadow-lg overflow-hidden">
//       <div className="h-2/3 overflow-hidden">
//         {/* <img src={product.thumbnail} className='w-full h-full object-cover' alt={product.title} /> */}
//         <Image loading={'lazy'} src={product.thumbnail} width={300} height={500}  placeholder="blur" blurDataURL={Buffer.from(product.thumbnail).toString('base64')} className='w-full h-full object-cover' alt={product.title} />
//       </div>
//       <div className="flex-1 px-2 pb-4 pt-2">
//         <button className="text-sm font-semibold ">
//           <TextConvertor locale={locale ?? "en"} title={product.title as string} metadata={product?.metadata?.title ?? null as any} />
//         </button>
//         <p className="text-xs ">{product.subtitle}</p>
//       </div>
//     </div>
//   );
// };

// const ProductSlider: React.FC<ProductSliderProps> = ({ products, locale }) => {
//   const { t } = useTranslation();
//   const isMobile = useMediaQuery('(max-width: 767px)');
//   const isRtlLocale = ['ar', 'he'].includes(locale);

//   return (
//     <>
//       <div className='w-full top-2 relative mb-4 flex justify-between items-center'>
//         <div className='flex justify-between w-fit gap-1'>
//           <Image src={fire.src} width={27} height={27} alt='hottest products animation'/>
//           <h2 className="dark:text-white whitespace-nowrap dark:bg-transparent text-lg text-center font-bold">{t("the-hottest")}</h2>
//         </div>
//       </div>
//       {isMobile ? (
//         <Marquee
//           duration={30000}
//           height="200px"
//           className='custom-marquee'
//           reverse={isRtlLocale}
//           pauseOnHover={true}
//         >
//           {products.map((product, index) => (
//             <LocalizedClientLink className='mr-2 ml-2 w-[150px]' href={`/products/${product.handle}`} key={index}>
//               <ProductCard locale={locale} product={product} />
//             </LocalizedClientLink>
//           ))}
//         </Marquee>
//       ) : (
//         <div className="vertical-marquee-container" style={{ height: '100%', overflow: 'hidden' }}>
//           <div className="vertical-marquee-content" style={{
//             animation: 'verticalMarquee 30s linear infinite',
//             display: 'flex',
//             flexDirection: 'column',
//           }}>
//             {products.concat(products).map((product, index) => (
//       <LocalizedClientLink className='my-2' href={`/products/${product.handle}`} key={index}>
//         <ProductCard locale={locale} product={product} />
//       </LocalizedClientLink>
//     ))}
//           </div>
//         </div>
//       )}
//       <style jsx>{`
//         @keyframes verticalMarquee {
//           from { transform: translateY(0); }
//           to { transform: translateY(-50%); }
//         }
//       `}</style>
//     </>
//   );
// };

// export default ProductSlider;

"use client"
import React, { useEffect, useState } from "react"
// Removed Swiper imports since we are using react-fast-marquee instead
import "swiper/css" // You might not need this import anymore unless other parts of your project use Swiper
import style from "./style.module.css"
import fire from "../../../../../../public/redDot.gif" // Adjusted comment to reflect default import usage
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TextConvertor from "@modules/products/components/text-convertor"
import { useTranslation } from "react-i18next"
import Image from "next/image"
// import Marquee from 'react-easy-marquee';
import Marquee from "@modules/common/components/animata/marquee" // Added import for react-fast-marquee
interface Product {
  id: string
  thumbnail: string
  title: string
  subtitle?: string
  handle: string
  metadata?: any
}

interface ProductCardProps {
  product: Product
  locale: string
}

interface ProductSliderProps {
  products: Product[]
  locale: string
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => {
      setMatches(media.matches)
    }
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
}

const ProductCard: React.FC<ProductCardProps> = ({ product, locale }) => {
  return (
    <div className="product-card rounded-lg h-[200px] w-full flex flex-col bg-white shadow-lg overflow-hidden">
      <div className="h-2/3 overflow-hidden">
        <Image
          loading={"lazy"}
          src={product.thumbnail}
          width={300}
          height={500}
          placeholder="blur"
          blurDataURL={Buffer.from(product.thumbnail).toString("base64")}
          className="w-full h-full object-cover"
          alt={product.title}
        />
      </div>
      <div className="flex-1 px-2 pb-4 pt-2">
        <button className="text-sm font-semibold ">
          <TextConvertor
            locale={locale ?? "en"}
            title={product.title as string}
            metadata={product?.metadata?.title ?? (null as any)}
          />
        </button>
        <p className="text-xs ">{product.subtitle}</p>
      </div>
    </div>
  )
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products, locale }) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isRtlLocale = ["ar", "he"].includes(locale)

  return (
    <>
      <div className="w-full top-2 relative mb-4 flex justify-between items-center">
        <div className="flex justify-between w-fit gap-1">
          <Image
            src={fire.src}
            width={27}
            height={27}
            alt="hottest products animation"
          />
          <h2 className="dark:text-white whitespace-nowrap dark:bg-transparent text-lg text-center font-bold">
            {t("the-hottest")}
          </h2>
        </div>
      </div>
      {isMobile ? (
        <div className="relative flex h-full max-h-96 min-h-72 w-full min-w-72 max-w-xl items-center justify-center overflow-hidden rounded-md border bg-background flex-col">
          <Marquee isMobile={isMobile}>
            {products.map((product, index) => (
              <LocalizedClientLink
                className="mr-2 ml-2 w-[150px]"
                href={`/products/${product.handle}`}
                key={index}
              >
                <ProductCard locale={locale} product={product} />
              </LocalizedClientLink>
            ))}
          </Marquee>
        </div>
      ) : (
        <Marquee
          vertical={true}
          reverse={isRtlLocale}
          pauseOnHover={true}
          repeat={10}
        >
          {products.map((product, index) => (
            <LocalizedClientLink
              className="mr-2 ml-2 w-[200px]"
              href={`/products/${product.handle}`}
              key={index}
            >
              <ProductCard locale={locale} product={product} />
            </LocalizedClientLink>
          ))}
        </Marquee>
      )}
    </>
  )
}

export default ProductSlider
