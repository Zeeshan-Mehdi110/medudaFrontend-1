import { Text } from "@medusajs/ui"
import { ProductPreviewType } from "types/global"
import { Region } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import TextConvertor from "../text-convertor"
import {Poppins} from "next/font/google"
const poppins = Poppins({subsets:["latin"], weight: "600"})
export default function ProductPreview({
  productPreview,
  isFeatured,
  locale,
  textColor,
}: {
  productPreview: ProductPreviewType
  isFeatured?: boolean
  region: Region
  locale: string,
  textColor?: string
}) {


  return (
    <LocalizedClientLink
      href={`/products/${productPreview.handle}`}
      className="group"
    >
      <div>
        <Thumbnail
          thumbnail={productPreview.thumbnail}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
        <Text className={`text-ui-fg-subtlee ${textColor} ${poppins.className}`}><TextConvertor locale={locale} title={productPreview.title} metadata={productPreview?.metadata?.title ?? null}/></Text>
          <div className="flex items-center gap-x-2">
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
