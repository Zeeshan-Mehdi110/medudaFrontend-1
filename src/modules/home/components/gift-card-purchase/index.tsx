"use client"
import React from "react"
import { useRouter } from "next/navigation"
import silverGiftBox from "/public/silverGiftBox.jpg"
import Image from "next/image"
import { Poppins } from 'next/font/google'
import { Button } from "@medusajs/ui"
 
// If loading a variable font, you don't need to specify the font weight
const inter = Poppins({subsets:["latin"], weight: "600"})
const GiftCardBanner = () => {
  const router = useRouter()

  const handleRedirect = () => {
    router.push("/account/gift-cards")
  }

  return (
    <div className={`${inter.className} hero-banner-image font- relative z-0 w-full h-full`}>
      <Image
        src={silverGiftBox}
        alt="Gift Card Banner Background"
        objectFit="cover"
        quality={100}
        className="z-0 min-h-[15rem]"
      />
      <div className="gift-card-banner-text">
        <h2 className="text-4xl font-bold mb-4">Everyone loves gifts!</h2>
        <p className="text-lg mb-8">
          Surprise your loved ones with a gift card! Perfect for any occasion.
        </p>
        <Button variant={"secondary"} className="min-w-[12rem]" onClick={handleRedirect}>Buy A Gift Card</Button>
      </div>
    </div>
  )
}

export default GiftCardBanner
