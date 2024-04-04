// import { notFound } from "next/navigation"
// import { Suspense } from "react"

// import { ProductCategoryWithChildren } from "types/global"
// import InteractiveLink from "@modules/common/components/interactive-link"
// import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
// import RefinementList from "@modules/store/components/refinement-list"
// import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
// import PaginatedProducts from "@modules/store/templates/paginated-products"
// import LocalizedClientLink from "@modules/common/components/localized-client-link"


// export default function CategoryTemplate({
//   categories,
//   sortBy,
//   page,
//   countryCode,
//   locale,
//   artist
// }: {
//   categories: ProductCategoryWithChildren[]
//   sortBy?: SortOptions
//   page?: string
//   countryCode: string
//   locale: string
//   artist?: string
// }) {
//   const pageNumber = page ? parseInt(page) : 1

//   const category = categories[categories.length - 1]
//   const parents = categories.slice(0, categories.length - 1)

//   if (!category || !countryCode) notFound()

//   return (
//     <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
//       <RefinementList sortBy={sortBy || "created_at"} />
//       <div className="w-full">
//         <div className="flex flex-row mb-8 text-2xl-semi gap-4">
//           {parents &&
//             parents.map((parent) => (
//               <span key={parent.id} className="text-ui-fg-subtle">
//                 <LocalizedClientLink
//                   className="mr-4 hover:text-black"
//                   href={`/categories/${parent.handle}`}
//                 >
//                   {parent.name}
//                 </LocalizedClientLink>
//                 /
//               </span>
//             ))}
//           <h1>{category.name}</h1>
//         </div>
//         {category.description && (
//           <div className="mb-8 text-base-regular">
//             <p>{category.description}</p>
//           </div>
//         )}
//         {category.category_children && (
//           <div className="mb-8 text-base-large">
//             <ul className="grid grid-cols-1 gap-2">
//               {category.category_children?.map((c) => (
//                 <li key={c.id}>
//                   <InteractiveLink href={`/categories/${c.handle}`}>
//                     {c.name}
//                   </InteractiveLink>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         <Suspense fallback={<SkeletonProductGrid />}>
//           <PaginatedProducts
//             sortBy={sortBy || "created_at"}
//             page={pageNumber}
//             categoryId={category.id}
//             countryCode={countryCode}
//             locale={locale}
//             artist={artist}
//           />
//         </Suspense>
//       </div>
//     </div>
//   )
// }


import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCategoryWithChildren } from "types/global";
import InteractiveLink from "@modules/common/components/interactive-link";
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid";
import RefinementList from "@modules/store/components/refinement-list";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import PaginatedProducts from "@modules/store/templates/paginated-products";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import initTranslations from "app/i18n";

export default async function CategoryTemplate({
  categories,
  sortBy,
  page,
  countryCode,
  locale,
  artist
}: {
  categories: ProductCategoryWithChildren[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
  locale: string
  artist?: string
}) {
  const pageNumber = page ? parseInt(page) : 1;

  const { t } = await initTranslations(locale, ['common']);
  // Extract category IDs
  const categoryIds = categories.map(category => category?.id ?? null);


  const categoryNames = categories.map(category => {
    const metadata = (category.metadata && JSON.parse(category.metadata.title as string ?? null)) ?? null;
    return metadata[`title_${locale}`] || category.name; // Fallback to category.name if locale specific title is not found
  }).join(', ');

  
  if (!categories.length || !countryCode) {
    notFound();
  }

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList isCategoryPage={true} locale={locale} sortBy={sortBy || "created_at"} />
      <div className="w-full sm:mr-10 sm:ml-10">
        {/* Single <h1> for all category names */}
        <div className="flex flex-col sm:flex-row mb-8 gap-4 mt-6 dark:text-white">
          <h1 className="text-2xl-semi align-middle">{t("search-results-for")}</h1>
          <span className="text-xl-semi flex items-center">{categoryNames}</span>
        </div>
        {/* Sections for each category */}
        {categories.map((category) => (
          <div key={category.id} className="category-section">
            {/* Category description */}
            {category.description && (
              <div className="mb-8 text-base-regular">
                <p>{category.description}</p>
              </div>
            )}
            {/* Subcategories if any */}
            {category.category_children && (
              <div className="mb-8 text-base-large">
                <ul className="grid grid-cols-1 gap-2">
                  {category.category_children.map((child) => (
                    <li key={child.id}>
                      <InteractiveLink href={`/categories/${child.handle}`}>
                        {child.name}
                      </InteractiveLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sortBy || "created_at"}
            page={pageNumber}
            categoryIds={categoryIds}
            countryCode={countryCode}
            locale={locale}
            artist={artist}
          />
        </Suspense>
      </div>
    </div>
  );
}
