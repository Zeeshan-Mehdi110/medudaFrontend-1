import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TextConvertor  from "@modules/products/components/text-convertor"

type ProductInfoProps = {
  product: PricedProduct
  locale: string
}



const ProductInfo = ({ product,locale }: ProductInfoProps) => {

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
    
        <Heading level="h2" className="text-3xl leading-10 text-ui-fg-base ">
          <TextConvertor locale={locale} title={product.title as string} metadata={product?.metadata?.title ?? product.title as any} />
        </Heading>

        <Text className="text-medium text-ui-fg-subtle ">
        <TextConvertor locale={locale} title={product.description as string} metadata={product?.metadata?.description ?? product.description as any} />
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
