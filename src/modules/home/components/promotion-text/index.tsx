"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

interface PromotionTextProps {
  text?: string;
}

const PromotionText: React.FC<PromotionTextProps> = ({ text }) => {
  const path = usePathname();
  const params = useParams();
  const { locale, countryCode } = params || {}; // Ensure params is not undefined
  const isHomePage = path === `/${countryCode}/${locale}`;

  console.log(path);
  
  return (
    <>
      {isHomePage && (
        <div className="marquee-container bg-violet-700 mb-2">
          <div className="marquee text-white">
            <p>
              Promotion 1: Get 20% off on all items! | Promotion 2: Free shipping on
              orders over $50! | Promotion 3: Buy 2 get 1 free on select items!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionText;
