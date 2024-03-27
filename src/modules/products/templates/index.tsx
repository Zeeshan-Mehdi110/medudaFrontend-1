import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import initTranslations from "app/i18n"

type ProductTemplateProps = {
  product: PricedProduct
  region: Region
  countryCode: string
  locale: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = async({
  product,
  region,
  countryCode,
  locale,
}) => {
  if (!product || !product.id) {
    return notFound()
  }
  const { t } = await initTranslations(locale, ['common']);
  const rtl = locale === "ar" || locale === "he";
  return (
    <>
      <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative">
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo locale={locale} product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={product?.images || []} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <ProductOnboardingCta />
          <Suspense
            fallback={<ProductActions product={product} region={region} />}
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
          <div className="">
            <h3 className={`text-lg dark:text-white font-semibold mb-4 ${rtl ? "text-right" : "text-left"}`}>{t("share-with-friends-on")}:</h3>
            <div className={`flex ${rtl ? "justify-start" : ""} gap-4 items-center`}>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=pixelsjourney.com/${countryCode}/${locale}/products/${product.handle}`}
                target="_blank"
              >
                <img src="/fbLogo.png" width={35} height={35} />
              </a>
              <a
                href={`https://wa.me/?text=I%20found%20this%20great%20image%20on%20Pixels Journey!%20Check%20it%20out:%20pixelsjourney.com/${countryCode}/${locale}/products/${product.handle}`}
                target="_blank"
              >
                {" "}
                <img src="/WhatsApp.svg" width={42} height={42} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="content-container my-16 small:my-32">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts locale={locale} product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
