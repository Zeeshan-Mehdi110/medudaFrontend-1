//@ts-nocheck
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { locales } from "../../../../../../../config/config"
import {
  getCategoryByHandle,
  getLang,
  listCategories,
  listRegions,
} from "@lib/data"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { medusaClient } from "@lib/config"
type Props = {
  params: { category: string[]; countryCode: string; locale: string }
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

  let staticParams = []

  locales.forEach((locale) => {
    const localeParams = countryCodes
      ?.map((countryCode) =>
        categoryHandles.map((handle) => ({
          countryCode,
          locale,
          category: [handle],
        }))
      )
      .flat()

    staticParams = [...staticParams, ...localeParams]
  })

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const categorySlugs = params.category[0].split("_")


  const { product_categories } = await medusaClient.productCategories.list()
  const chosenCategories = product_categories.filter((category) =>
    categorySlugs.includes(category.handle)
  )

  if (!chosenCategories) {
    return {
      title: `Pixels Journey`,
      description: "Pixels Journey",
      alternates: {
        canonical: "/categories/not-found",
      },
    }
  }
  else if(chosenCategories.length === 1){
    return {
      title:  `${JSON.parse(chosenCategories[0].metadata.title)[`title_${locale}`]} | Pixels Journey`,
      description: `${JSON.parse(chosenCategories[0].metadata.title)[`title_${locale}`]}`,
      alternates: {
        canonical: `/categories/${chosenCategories[0].handle}`,
      },
    }
  }
  else {
    const title = chosenCategories
      .map((category) => JSON.parse(category.metadata.title)[`title_${locale}`])
      .join(" , ");
    const description = chosenCategories
      .map((category) => JSON.parse(category.metadata.title)[`title_${locale}`])
      .join(" , ");
  
    const canonical = `/categories/${categorySlugs.join("_")}`;
  
    return {
      title: `${title} | Pixels Journey`,
      description,
      alternates: {
        canonical,
      },
    };
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
