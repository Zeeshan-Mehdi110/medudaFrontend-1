// import { Region } from "@medusajs/medusa"

// import ProductRail from "@modules/home/components/featured-products/product-rail"
// import { ProductCollectionWithPreviews } from "types/global"

// export default async function FeaturedProducts({
//   collections,
//   region,
//   locale,
// }: {
//   collections: ProductCollectionWithPreviews[]
//   region: Region,
//   locale: string
// }) {
//   return collections.map((collection) => (
//     <li key={collection.id}>
//       <ProductRail locale={locale} collection={collection} region={region} />
//     </li>
//   ))
// }

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
  const colorPairs = [
    { bgColor: 'bg-gray', textColor: 'text-black dark:text-white', textBorderClass: 'text-border-black' },
    { bgColor: 'bg-dark-navy', textColor: 'text-white dark:text-white', textBorderClass: 'text-border-white' },
    { bgColor: 'bg-gold', textColor: 'text-black dark:text-white', textBorderClass: 'text-border-black' },
  ];
  return collections.map((collection, index) => {
    const { bgColor, textColor, textBorderClass } = colorPairs[index % colorPairs.length];
  
    return (
      <li className={`${bgColor} ${textColor} ${textBorderClass} dark:bg-black`} key={collection.id}>
      <ProductRail locale={locale} textColor={textColor} collection={collection} region={region} />
    </li>
    );
  });
}
