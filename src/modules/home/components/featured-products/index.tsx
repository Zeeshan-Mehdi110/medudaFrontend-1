import { Region } from "@medusajs/medusa"

import ProductRail from "@modules/home/components/featured-products/product-rail"
import { ProductCollectionWithPreviews } from "types/global"

export default async function FeaturedProducts({
  collections,
  region,
  locale,
}: {
  collections: ProductCollectionWithPreviews[]
  region: Region,
  locale: string
}) {
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail locale={locale} collection={collection} region={region} />
    </li>
  ))
}
