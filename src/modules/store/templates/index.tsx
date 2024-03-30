import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import initTranslations from "app/i18n"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  locale,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string,
  locale: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const { t } = await initTranslations(locale, ['common']);
  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList locale={locale} sortBy={sortBy || "created_at"} />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1>{t("all-products")}</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sortBy || "created_at"}
            page={pageNumber}
            countryCode={countryCode}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
