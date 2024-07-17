// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { MagnifyingGlass } from "@medusajs/icons";
// import { Poppins } from "next/font/google";
// import TypingText from "@modules/common/components/animata/typing-text";
// import LocalizedClientLink from "@modules/common/components/localized-client-link";
// import { useTranslation } from "react-i18next";
// import { useParams, usePathname } from 'next/navigation'

// interface CustomSearchProps {
//   locale?: string;
// }

// const merienda = Poppins({
//   fallback: ["sans-serif"],
//   weight: "400",
//   subsets: ["latin"],
// });

// const CustomSearch: React.FC<CustomSearchProps> = ({ locale }) => {
//   const isRtl = locale === "ar" || locale === "he";
//   const [isVisible, setIsVisible] = useState(true);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const path = usePathname()
//   const params = useParams()
//   const {countryCode } = params || {} // Ensure params is not undefined
//   const isHomePage = path === `/${countryCode}/${locale}`

//   const { t } = useTranslation();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsVisible(window.scrollY <= 300);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     if (containerRef.current) {
//       if (isVisible) {
//         containerRef.current.style.maxHeight = '100px'; // Adjust this value based on your content's height
//         containerRef.current.style.opacity = '1';
//       } else {
//         containerRef.current.style.maxHeight = '0';
//         containerRef.current.style.opacity = '0';
//       }
//     }
//   }, [isVisible]);

//   if (!isHomePage) {
//     return null;
//   }

//   return (
//     <div
//       ref={containerRef}
//       className={`flex justify-center items-center w-full bg-gray ${isVisible ? 'p-1' : ''} transition-all duration-700 ease-in-out overflow-hidden`}
//       style={{
//         maxHeight: isVisible ? '100px' : '0', // Adjust this value based on your content's height
//         opacity: isVisible ? '1' : '0'
//       }}
//     >
//       <LocalizedClientLink
//         className={`sm:w-1/2 w-[90%] transition-opacity duration-700 ${
//           isVisible ? "opacity-100" : "opacity-0"
//         }`}
//         href="/search"
//         scroll={false}
//       >
//         <div className="w-full relative">
//           <MagnifyingGlass
//             className={`absolute top-[7px] ${
//               isRtl ? "right-[7px]" : "left-[5px] bg-whitesmoke rounded-xl"
//             }`}
//           />
//           <input
//             type="text"
//             className="w-full rounded-2xl shadow-sm border border-gray-300 h-8"
//           />
//           <TypingText
//             alwaysVisibleCount={0}
//             delay={50}
//             grow={true}
//             smooth={false}
//             cursor={true}
//             text={t("search_placeholder")}
//             waitTime={2000}
//             className={`absolute ${
//               isRtl ? "right-[40px]" : "left-[40px]"
//             } top-[5px] ${merienda.className}`}
//           />
//         </div>
//       </LocalizedClientLink>
//     </div>
//   );
// };

// export default CustomSearch;


"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { MagnifyingGlass } from "@medusajs/icons";
import { Poppins } from "next/font/google";
import TypingText from "@modules/common/components/animata/typing-text";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { useTranslation } from "react-i18next";
import { useParams, usePathname } from 'next/navigation';
import debounce from 'lodash/debounce';

interface CustomSearchProps {
  locale?: string;
}

const merienda = Poppins({
  fallback: ["sans-serif"],
  weight: "400",
  subsets: ["latin"],
});

const CustomSearch: React.FC<CustomSearchProps> = ({ locale }) => {
  const isRtl = locale === "ar" || locale === "he";
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const params = useParams();
  const { countryCode } = params || {}; // Ensure params is not undefined
  const isHomePage = path === `/${countryCode}/${locale}`;

  const { t } = useTranslation();

  // Debounced scroll handler
  const handleScroll = useCallback(
    debounce(() => {
      setIsVisible(window.scrollY <= 300);
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (containerRef.current) {
      if (isVisible) {
        containerRef.current.style.maxHeight = '100px'; // Adjust this value based on your content's height
        containerRef.current.style.opacity = '1';
      } else {
        containerRef.current.style.maxHeight = '0';
        containerRef.current.style.opacity = '0';
      }
    }
  }, [isVisible]);

  if (!isHomePage) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`flex justify-center items-center w-full bg-gray ${isVisible ? 'p-1' : ''} transition-all duration-700 ease-in-out overflow-hidden`}
      style={{
        maxHeight: isVisible ? '100px' : '0', // Adjust this value based on your content's height
        opacity: isVisible ? '1' : '0'
      }}
    >
      <LocalizedClientLink
        className={`sm:w-1/2 w-[90%] transition-opacity duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        href="/search"
        scroll={false}
      >
        <div className="w-full relative">
          <MagnifyingGlass
            className={`absolute top-[7px] ${
              isRtl ? "right-[7px]" : "left-[5px] bg-whitesmoke rounded-xl"
            }`}
          />
          <input
            type="text"
            className="w-full rounded-2xl shadow-sm border border-gray-300 h-8"
          />
          <TypingText
            alwaysVisibleCount={0}
            delay={50}
            grow={true}
            smooth={false}
            cursor={true}
            text={t("search_placeholder")}
            waitTime={2000}
            className={`absolute ${
              isRtl ? "right-[40px]" : "left-[40px]"
            } top-[5px] ${merienda.className}`}
          />
        </div>
      </LocalizedClientLink>
    </div>
  );
};

export default CustomSearch;