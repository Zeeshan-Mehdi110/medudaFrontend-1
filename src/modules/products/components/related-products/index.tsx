import { StoreGetProductsParams } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"

import { getLang, getProductsList } from "@lib/data"

import { getRegion } from "app/actions"
import ProductPreview from "../product-preview"
import initTranslations from "app/i18n"

type RelatedProductsProps = {
  product: PricedProduct
  countryCode: string,
  locale: string
}

export default async function RelatedProducts({
  product,
  countryCode,
  locale,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)
const { t } = await initTranslations(locale, ['common']);
  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const setQueryParams = (): StoreGetProductsParams => {
    const params: StoreGetProductsParams = {}

    if (region?.id) {
      params.region_id = region.id
    }

    if (region?.currency_code) {
      params.currency_code = region.currency_code
    }

    if (product.collection_id) {
      params.collection_id = [product.collection_id]
    }

    if (product.tags) {
      params.tags = product.tags.map((t) => t.value)
    }

    params.is_giftcard = false

    return params
  }

  const queryParams = setQueryParams()

  const productPreviews = await getProductsList({
    queryParams,
    countryCode,
  }).then(({ response }) =>
    response.products.filter(
      (productPreview) => productPreview.id !== product.id
    )
  )

  if (!productPreviews.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
        {t("related-products")}
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
        {t("check-out-products")}
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {productPreviews.map((productPreview) => (
          <li key={productPreview.id}>
            <ProductPreview locale={locale ?? 'en'} region={region} productPreview={productPreview} />
          </li>
        ))}
      </ul>
    </div>
  )
}
