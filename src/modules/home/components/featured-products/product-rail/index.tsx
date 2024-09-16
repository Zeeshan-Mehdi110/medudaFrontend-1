// import { getLang } from "@lib/data"
// import { Region } from "@medusajs/medusa"
// import { Text } from "@medusajs/ui"

// import InteractiveLink from "@modules/common/components/interactive-link"
// import ProductPreview from "@modules/products/components/product-preview"
// import { ProductCollectionWithPreviews } from "types/global"
// import initTranslations from 'app/i18n';
// import TextConvertor from "@modules/products/components/text-convertor"
// export default async function ProductRail({
//   collection,
//   region,
//   locale,
// }: {
//   collection: ProductCollectionWithPreviews
//   region: Region,
//   locale: string
// }) {
//   const { products } = collection
//   const { t } = await initTranslations(locale, ['common']);
//   if (!products) {
//     return null
//   }

//   return (
//     <div className="content-container py-12 small:py-24">
//       <div className="flex justify-between mb-8">
//         <Text className="txt-xlarge dark:text-white"> <TextConvertor locale={locale ?? "en"} title={collection.title as string} metadata={collection?.metadata?.title ?? null as any}/></Text>
//         <InteractiveLink href={`/collections/${collection.handle}`}>
//         {t("view-all")}
//         </InteractiveLink>
//       </div>
//       <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
//         {products &&
//           products.map((product) => (
//             <li key={product.id}>
//               <ProductPreview
//                 productPreview={product}
//                 region={region}
//                 isFeatured
//                 locale={locale ?? "en"}
//               />
//             </li>
//           ))}
//       </ul>
//     </div>
//   )
// }
import { getLang } from "@lib/data"
import { Region } from "@medusajs/medusa"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import { ProductCollectionWithPreviews } from "types/global"
import initTranslations from 'app/i18n';
import TextConvertor from "@modules/products/components/text-convertor"
import { Poppins } from "next/font/google"

const poppins = Poppins({subsets:["latin"], weight: "600"})

export default async function ProductRail({
  collection,
  region,
  locale,
  textColor,
}: {
  collection: ProductCollectionWithPreviews
  region: Region,
  locale: string,
  textColor: string,
}) {
  const { products } = collection
  const { t } = await initTranslations(locale, ['common']);
  if (!products) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className={`txt-xlarge ${poppins.className} dark:text-white`}> <TextConvertor locale={locale ?? "en"} title={collection.title as string} metadata={collection?.metadata?.title ?? null as any}/></Text>
        <InteractiveLink locale={locale} textColor={textColor}  href={`/collections/${collection.handle}`}>
        {t("view-all")}
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
        {products &&
          products.map((product) => (
            <li key={product.id}>
              <ProductPreview
                productPreview={product}
                region={region}
                isFeatured
                locale={locale ?? "en"}
                textColor={textColor}
              />
            </li>
          ))}
      </ul>
    </div>
  )
}
