"use client"
import React from "react"
import { usePathname } from "next/navigation"
import { useParams } from "next/navigation"
import { useState } from "react"
import { XCircle } from "@medusajs/icons"
interface PromotionTextProps {
  text?: string
}

const PromotionText: React.FC<PromotionTextProps> = ({ text }) => {
  const path = usePathname()
  const params = useParams()
  const { locale, countryCode } = params || {} // Ensure params is not undefined
  const isHomePage = path === `/${countryCode}/${locale}`
  const [isPromotionTextVisible, setIsPromotionTextVisible] = useState(true)

const handleClosePromotion = () => {
    setIsPromotionTextVisible(false)
}

  return (
    <>
      {isHomePage && isPromotionTextVisible && (
        <>
          <div className="bg-violet-700 w-full flex items-center gap-3 rounded-sm">
          <div className="w-fit"><a href="#" onClick={handleClosePromotion}><XCircle className="text-white"></XCircle></a></div>
          
          <div className="marquee-container w-max">
          
            <div className="marquee text-white">
          
              <p>
                Promotion 1: Get 20% off on all items! | Promotion 2: Free
                shipping on orders over $50! | Promotion 3: Buy 2 get 1 free on
                select items!
              </p>
            </div>
          </div>
          </div>
        </>
      )}
    </>
  )
}

export default PromotionText
