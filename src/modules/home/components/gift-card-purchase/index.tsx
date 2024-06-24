"use client"
import React from "react"
import { useRouter } from "next/navigation"
import silverGiftBox from "/public/2148465527.jpg"
import Image from "next/image"
import { Poppins } from 'next/font/google'
import { Button } from "@medusajs/ui"
 import { useTranslation } from "react-i18next" 
// If loading a variable font, you don't need to specify the font weight
const inter = Poppins({subsets:["latin"], weight: "600"})
const GiftCardBanner = () => {
  const router = useRouter()
const { t } = useTranslation()
  const handleRedirect = () => {
    router.push("/products/pixels-journey-gift-card")
  }

  return (
    <div className={`${inter.className} hero-banner-image font- relative z-0 w-full h-full`}>
      <Image
        src={silverGiftBox}
        alt="Gift Card Banner Background"
        objectFit="cover"
        quality={100}
        className="z-0 lg:h-[33rem] md:h-[28rem] xl:h-[38rem] 2xl:h-[40rem]"
      />
      <div className="gift-card-banner-text">
        <h2 className="text-4xl font-bold mb-4">{t("gift-voucher-title")}</h2>
        <p className="text-lg mb-8">
          {t("gift-voucher-description")}
        </p>
        <Button type={"button"} className="min-w-[12rem] custom-button" onClick={handleRedirect}>{t("gift-voucher-button-text")}</Button>
      </div>
    </div>
  )
}

export default GiftCardBanner
