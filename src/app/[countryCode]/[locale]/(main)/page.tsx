import { Product } from "@medusajs/medusa"
import { Metadata } from "next"

import { getCollectionsList, getProductsList, getTheme } from "@lib/data"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getRegion } from "app/actions"
import { ProductCollectionWithPreviews } from "types/global"

export const metadata: Metadata = {
  title: "Pixels Journey Store",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

const getCollectionsWithProducts = async (
  countryCode: string
): Promise<ProductCollectionWithPreviews[] | null> => {
  const { collections } = await getCollectionsList(0, 3).then(
    (collections) => collections
  )

  if (!collections) {
    return null
  }

  const collectionIds = collections.map((collection) => collection.id)

  await Promise.all(
    collectionIds.map((id) =>
      getProductsList({
        queryParams: { collection_id: [id] },
        countryCode,
      })
    )
  ).then((responses) =>
    responses.forEach(({ response, queryParams }) => {
      let collection

      if (collections) {
        collection = collections.find(
          (collection) => collection.id === queryParams?.collection_id?.[0]
        )
      }

      if (!collection) {
        return
      }

      collection.products = response.products as unknown as Product[]
    })
  )

  return collections as unknown as ProductCollectionWithPreviews[]
}

export default async function Home({
  params: { countryCode, locale},
}: {
  params: { countryCode: string, locale: string}
}) {
  const collections = await getCollectionsWithProducts(countryCode)
  const region = await getRegion(countryCode)
  if (!collections || !region) {
    return null
  }
  // const theme = getTheme();
  // const backgroundImageStyle = {
  //   backgroundImage: theme ==='dark' ? `url('/2363.jpg')` : `url('/lightTheme.jpg')`,
  //   backgroundPosition: 'center',
  //   backgroundSize: 'cover',
  //   backgroundRepeat: 'no-repeat',
  //   minHeight: '100vh', // Ensures the background covers the full viewport height
  // };
  return (
    <>
      {/* <Hero locale={locale} />
      <div id="background-image" style={backgroundImageStyle}>
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts locale={locale} collections={collections} region={region} />
        </ul>
      </div> */}

<Hero locale={locale} />
      
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts locale={locale} collections={collections} region={region} />
        </ul>
      
    </>
  )
}
