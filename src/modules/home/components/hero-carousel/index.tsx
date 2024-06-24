
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
import "./custom-swiper-style.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@medusajs/ui"
import Image from "next/image"
type ImageItem = {
  title: string
  subtitle: string
  link: string
  linkText: string
  elementsPositions: {
    linkPosition: string
    titlePosition: string
    subtitlePosition: string
    wrapperDivPosition: string
    wrapperDivPositionTailwind: string
  }
  imageName: string
  imageUrl: string
}

const MySwiperComponent = ({ locale }: { locale: string }) => {
  const router = useRouter()
  const [images, setImages] = useState<ImageItem[]>([])
  useEffect(() => {
    fetch( `https://strapi-blog-m4go.onrender.com/api/hero-images?locale=${locale}&populate=*`)
      .then((response) => response.json())
      .then((data) => {
        let items = extractData(data)
        setImages(items)
      })
      .catch((error) => console.error("Error fetching images:", error))
  }, [])

  const parseStyleString = (styleString: any) => {
    return styleString
      .split(";")
      .filter((style: string) => style.split(":")[0] && style.split(":")[1])
      .reduce(
        (
          styleObj: { [x: string]: any },
          style: { split: (arg0: string) => [any, any] }
        ) => {
          const [key, value] = style.split(":")
          styleObj[key.trim()] = value.trim()
          return styleObj
        },
        {}
      )
  }

  const extractData = (apiResponse: any) => {
    return apiResponse.data.map((item: { attributes: any }) => {
      const { image, elementsPositions, title, subtitle, link,linkText } =
        item.attributes
      const imageUrl =
        image.data.length > 0 ? image.data[0].attributes.url : null
      const imageName =
        image.data.length > 0 ? image.data[0].attributes.name : null

      return {
        title,
        subtitle,
        link: link.replace(/"/g, ""), // Remove double quotes around the link
        elementsPositions: {
          linkPosition: elementsPositions["link-position"],
          titlePosition: elementsPositions["title-position"],
          subtitlePosition: elementsPositions["subtitle-position"],
          wrapperDivPosition: elementsPositions["wrapper-div-position"],
          wrapperDivPositionTailwind:
            elementsPositions["wrapper-div-position-tailwind"],
        },
        imageName,
        imageUrl,
        linkText
      }
    })
  }

  return (
    <Swiper
      style={{ height: "100%", width: "100%" }}
      modules={[Navigation, Autoplay, Pagination]}
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
      {images.map(
        (img, index) => (
          (
            <SwiperSlide key={index}>
              <div className="hero-banner-image font- relative z-0 w-full h-full">
                <Image
                  src={img.imageUrl} // Make sure your API response matches the expected src attribute
                  alt={img.imageName || "Background"} // Optional alt text from API or default
                  className="rounded-lg object-fit w-full h-full"
                  width={1920}
                  height={1080}
                />
         
                  <div
                  className={img.elementsPositions.wrapperDivPositionTailwind}
                    style={parseStyleString(
                      img.elementsPositions.wrapperDivPosition
                    )}
                  >
                    <h2 className={img.elementsPositions.titlePosition}>{img.title}</h2>
                    <span className={img.elementsPositions.subtitlePosition}>{img.subtitle}</span>
                    {img.link && (
                      <div className="button-wrapper w-full flex justify-center items-center">
                        <Button
                          onClick={() => router.push(img.link)}
                          className="custom-button"
                        >
                          {img.linkText}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
             
            </SwiperSlide>
          )
        )
      )}
    </Swiper>
  )
}

export default MySwiperComponent
