// //@ts-nocheck
// import { Metadata } from "next"
// import { notFound } from "next/navigation"

// import { getCategoryByHandle, getLang, listCategories, listRegions } from "@lib/data"
// import CategoryTemplate from "@modules/categories/templates"
// import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

// type Props = {
//   params: { category: string[]; countryCode: string, locale: string}
//   searchParams: {
//     sortBy?: SortOptions
//     page?: string
//     artist?: string
//   }
// }

// export async function generateStaticParams() {
//   const product_categories = await listCategories()

//   if (!product_categories) {
//     return []
//   }

//   const countryCodes = await listRegions().then((regions) =>
//     regions?.map((r) => r.countries.map((c) => c.iso_2)).flat()
//   )

//   const categoryHandles = product_categories.map((category) => category.handle)

//   const staticParams = countryCodes
//     ?.map((countryCode) =>
//       categoryHandles.map((handle) => ({
//         countryCode,
//         category: [handle],
//       }))
//     )
//     .flat()

//   return staticParams
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   try {
//     const { product_categories } = await getCategoryByHandle(
//       params.category
//     ).then((product_categories) => product_categories)

//     const title = product_categories
//       .map((category) => category.name)
//       .join(" | ")

//     const description =
//       product_categories[product_categories.length - 1].description ??
//       `${title} category.`

//     return {
//       title: `${title} | Pixels Journey`,
//       description,
//       alternates: {
//         canonical: `${params.category.join("/")}`,
//       },
//     }
//   } catch (error) {
//     notFound()
//   }
// }

// export default async function CategoryPage({ params, searchParams }: Props) {
//   const { sortBy, page, artist } = searchParams
//   const {locale} = params;
//   const { product_categories } = await getCategoryByHandle(
//     params.category
//   ).then((product_categories) => product_categories)

//   if (!product_categories) {
//     notFound()
//   }

//   return (
//       <CategoryTemplate
//         categories={product_categories}
//         sortBy={sortBy}
//         page={page}
//         countryCode={params.countryCode}
//         locale={locale ?? "en"}
//         artist={artist}
//       />
//   )
// }


//@ts-nocheck
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, getLang, listCategories, listRegions } from "@lib/data"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: { category: string[]; countryCode: string, locale: string}
  searchParams: {
    sortBy?: SortOptions
    page?: string
    artist?: string
  }
}

export async function generateStaticParams() {
  const product_categories = await listCategories()
  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions) =>
    regions?.map((r) => r.countries.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map((category) => category.handle)

  const staticParams = countryCodes
    ?.map((countryCode) =>
      categoryHandles.map((handle) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Split the category parameter by underscore to handle multiple categories
    const categorySlugs = params.category[0].split('_');

    // Fetch metadata for each category
    const categoriesMetadataPromises = categorySlugs.map(slug => 
      getCategoryByHandle(slug).catch(error => {
        console.error(`Error fetching category: ${slug}`, error);
        return null; // Return null if fetching fails for a category
      })
    );

    // Await all the getCategoryByHandle calls
    const categoriesMetadata = await Promise.all(categoriesMetadataPromises);

    // Filter out any null results from failed fetches
    const validCategoriesMetadata = categoriesMetadata.filter(Boolean);

    // Combine the titles and descriptions
    const title = validCategoriesMetadata
      .map(metadata => metadata?.product_categories.map(category => category.name).join(" | "))
      .join(" | ");
    const description = validCategoriesMetadata
      .map(metadata => metadata?.product_categories[metadata.product_categories.length - 1].description)
      .filter(Boolean) // Remove any undefined descriptions
      .join(" | ") || `${title} category.`;

    // Generate canonical URL
    const canonical = `/categories/${categorySlugs.join('/')}`;

    return {
      title: `${title} | Pixels Journey`,
      description,
      alternates: {
        canonical,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
    notFound()
  }
}


export default async function CategoryPage({ params, searchParams }: Props) {
  const { sortBy, page, artist } = searchParams;
  const { countryCode, locale } = params;

  // Split the category string into an array of category handles
  const categoryHandles = params.category[0].split('_');
  
  // Fetch categories data for each handle
  const categoriesPromises = categoryHandles.map(handle => getCategoryByHandle([decodeURIComponent(handle)]));
  
  try {
    // Wait for all the getCategoryByHandle promises to resolve
    const categoriesArray = await Promise.all(categoriesPromises);

    // Flatten the array of product_categories objects
    const product_categories = [].concat(...categoriesArray.map(({ product_categories }) => product_categories));
    // console.log('product_categories:', product_categories);
    if (!product_categories) {
      notFound();
    }

    return (
      <CategoryTemplate
        categories={product_categories}
        sortBy={sortBy}
        page={page}
        countryCode={countryCode}
        locale={locale ?? "en"}
        artist={artist}
      />
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    notFound();
  }
}
