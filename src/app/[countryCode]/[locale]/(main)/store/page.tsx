import { Metadata, ResolvingMetadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import initTranslations from "app/i18n";


export async function generateMetadata(
  { params }: { params: { locale: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { t } = await initTranslations(params.locale, ['common']);
  const translatedKeywords = t("pixels-journey-store-seo-keywords").split(', ');

  return {
    title: "Pixels Journey Store",
    description: t("pixels-journey-store-page-seo-description"),
    keywords: translatedKeywords,
    openGraph: {
      images: ['/opengraph-image.png']
    }
  };
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
  params: {
    countryCode: string
    locale: string
  }
}

export default async function StorePage({ searchParams, params }: Params) {
  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      locale={params.locale}
    />
  )
}
