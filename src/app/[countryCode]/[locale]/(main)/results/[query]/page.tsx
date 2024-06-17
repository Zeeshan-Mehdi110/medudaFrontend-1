import { Metadata } from "next"

import SearchResultsTemplate from "@modules/search/templates/search-results-template"

import { search } from "@modules/search/actions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import initTranslations from "app/i18n";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, query, countryCode } = params;
  const { t } = await initTranslations(locale, ['common']);
  return {
    title: `${t("search-results-for")} ${query}`,
    description: t("pixels-journey-store-page-seo-description"),
    alternates: {
      canonical: `${countryCode}/${locale}/search/${query}`,
    }
  }

}

type Params = {
  params: { query: string; countryCode: string, locale: string}
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
}

export default async function SearchResults({ params, searchParams }: Params) {
  const { query } = params
  const { sortBy, page } = searchParams

  let hits = await search(query).then((data) => data)
  hits = hits.filter((h) => h.handle !== "custom-print" && h.is_giftcard === false)
  const ids = hits
    .map((h) => h.objectID || h.id)
    .filter((id): id is string => {
      return typeof id === "string"
    })

  return (
    <SearchResultsTemplate
      query={query}
      ids={ids}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      locale={params.locale}
    />
  )
}
