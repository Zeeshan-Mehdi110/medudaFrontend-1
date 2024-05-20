import { Text, clx } from "@medusajs/ui"

import { getCategoriesList, getCollectionsList } from "@lib/data"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "../../components/medusa-cta"
import TextConvertor from "@modules/products/components/text-convertor"
import initTranslations from "app/i18n"

const fetchCollections = async () => {
  const { collections } = await getCollectionsList()
  return collections
}

const fetchCategories = async () => {
  const { product_categories } = await getCategoriesList()
  return product_categories
}

export default async function Footer({locale}: {locale: string}) {
  let productCollections = await fetchCollections().then(
    (collections) => collections
  )
  productCollections = productCollections.filter((c) => c.handle !== "custom-print") 
  const productCategories = await fetchCategories().then(
    (categories) => categories
  )
  const { t } = await initTranslations(locale, ["common"])
  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-40">
          <div>
          <LocalizedClientLink
              href="/"
              className={`txt-compact-xlarge-plus hover:text-ui-fg-base uppercase text-lg sm:text-xl`}
            >
            <img className="pb-[25px] sm:scale-100 scale-80 max-w-[150px] min-w-[150px]" alt='navigation bar logo' id="nav-logo" src="/rr.svg"></img>
            </LocalizedClientLink>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCollections && productCollections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base dark:text-white">
                  {t("collections")}
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (productCollections?.length || 0) > 3,
                    }
                  )}
                >
                  {productCollections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        <TextConvertor locale={locale} metadata={c?.metadata?.title as string ?? null} title={c.title}/>
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} {t("copyright")}
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  )
}
