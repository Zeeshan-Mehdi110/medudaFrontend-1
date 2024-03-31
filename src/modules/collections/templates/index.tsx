import { ProductCollection } from "@medusajs/medusa"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import TextConvertor from "@modules/products/components/text-convertor"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  locale,
}: {
  sortBy?: SortOptions
  collection: ProductCollection
  page?: string
  countryCode: string,
  locale: string
}) {
  const pageNumber = page ? parseInt(page) : 1

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList isCategoryPage={false} locale={locale} sortBy={sortBy || "created_at"} />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
        <h1><TextConvertor locale={locale} title={collection.title as string} metadata={collection?.metadata?.title as string ?? null} ></TextConvertor></h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sortBy || "created_at"}
            page={pageNumber}
            collectionId={collection.id}
            countryCode={countryCode}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  )
}
