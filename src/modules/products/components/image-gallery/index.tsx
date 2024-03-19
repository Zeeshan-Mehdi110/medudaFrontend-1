// import { Image as MedusaImage } from "@medusajs/medusa"
// import { Container } from "@medusajs/ui"
// import Image from "next/image"

// type ImageGalleryProps = {
//   images: MedusaImage[]
// }

// const ImageGallery = ({ images }: ImageGalleryProps) => {
//   return (
//     <div className="flex items-start relative">
//       <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
//         {images.map((image, index) => {
//           return (
//             <Container
//               key={image.id}
//               className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
//               id={image.id}
//             >
//               <Image
//                 src={image.url}
//                 priority={index <= 2 ? true : false}
//                 className="absolute inset-0 rounded-rounded"
//                 alt={`Product image ${index + 1}`}
//                 fill
//                 sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
//                 style={{
//                   objectFit: "cover",
//                 }}
//               />
//             </Container>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default ImageGallery


import { Image as MedusaImage } from "@medusajs/medusa"
import { Container } from "@medusajs/ui"
import Image from "next/image"

type ImageGalleryProps = {
  images: MedusaImage[]
}

function isMockupImage(url: string) {
  const domainWithMockup = /(https?:\/\/[^\/]+\/mockup)/
  return domainWithMockup.test(url)
}
function getHeightFromUrl(url: string) {
  const match = url.match(/width_(\d+)/)
  return match ? parseInt(match[1], 10) : null
}
function extractBottomAttribute(url: string) {
  const match = /bottom_(\d+)/.exec(url)
  return match ? Number(match[1]) : null
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const mockup = images.find((image) => isMockupImage(image.url))
  const base = images.find((image) => !isMockupImage(image.url))

  const displayImages = mockup && base ? [base, mockup] : images

  if (!mockup) {
    // Render all images if no mockup image exists
    return (
      <div className="flex items-start relative">
        <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
          {images.map((image, index) => {
            return (
              <Container
                key={image.id}
                className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
                id={image.id}
              >
                <Image
                  src={image.url}
                  priority={index <= 2}
                  className="absolute inset-0 rounded-rounded"
                  alt={`Product image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </Container>
            )
          })}
        </div>
      </div>
    )
  }
  const bottomAttribute = displayImages[1]
    ? extractBottomAttribute(displayImages[1].url)
    : 40
  const widthAttribute = displayImages[1]
    ? getHeightFromUrl(displayImages[1].url)
    : null
  const widthPercentage = widthAttribute ? widthAttribute : 30 // a number now
  const heightPercentage = widthAttribute ? widthAttribute * 1.3 : 36 // a number now

  const leftPercentage = 50 - widthPercentage / 2

  // Else, render according to the current setup
  return (
    <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
      <Container
        key={displayImages[0].id}
        className={`relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle}`}
        id={displayImages[0].id}
        style={{ zIndex: 1, position: "relative" }}
      >
        <Image
          src={displayImages[0].url}
          className="inset-0 rounded-rounded"
          alt={`Product image base`}
          layout="fill"
          objectFit="cover"
        />
        {displayImages[1] && (
          <div
            style={{
              width: `${widthPercentage}%`,
              height: `${heightPercentage}%`,
              left: `${leftPercentage}%`,
              bottom: `${bottomAttribute}%`,

              position: "absolute",
              zIndex: 2,
            }}
            id="scalable-image"
            {...(widthAttribute ? { "data-width": widthAttribute } : {})}
          >
            <img
              src={displayImages[1].url}
              className="absolute"
              alt={`Product image mockup`}
              style={{
                height: "100%",
                width: "100%",
                boxShadow: "3px 3px 8px 0 rgba(0,0,0,0.5)",
              }}
           
            />
          </div>
        )}
      </Container>
    </div>
  )
}

export default ImageGallery
