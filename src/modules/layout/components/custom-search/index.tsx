"use client";
import React, { useState, useEffect } from "react";
import { MagnifyingGlass } from "@medusajs/icons";
import { Poppins } from "next/font/google";
import TypingText from "@modules/common/components/animata/typing-text";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

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

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY <= 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <LocalizedClientLink
      className={`sm:w-1/2 w-[90%] transition-opacity duration-500 ${
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
          text="Type to discover your favorite art!"
          waitTime={2000}
          className={`absolute ${
            isRtl ? "right-[40px]" : "left-[40px]"
          } top-[5px] ${merienda.className}`}
        />
      </div>
    </LocalizedClientLink>
  );
};

export default CustomSearch;
