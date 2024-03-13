import { headers } from "next/headers"
import { Suspense } from "react"
import { listRegions } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Theme from "@modules/layout/components/theme-toggle"
import LanguageToggle from "@modules/layout/components/language-toggle"
import initTranslations from "app/i18n"
export default async function Nav(params:any) {
  const regions = await listRegions().then((regions) => regions)
  const locale = params.children[1];
  const { t,resources } = await initTranslations(locale, ['common']);


  return (
    <div className="sticky top-0 inset-x-0 z-50 group ">
      <header className="relative dark:bg-black bg-ui-bg-subtle h-16 mx-auto border-b duration-200  border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full pr-2 pl-2 h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <h1 className="text-center">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
            >
              Medusa Store
            </LocalizedClientLink>
            </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-x-6 h-full flex-1 basis-0 justify-end pl-1 sm:pl-0">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                >
                  {t("search")}
                </LocalizedClientLink>
              )}
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
              >
                 {t("account")}
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <a
                  className="hover:text-ui-fg-base flex gap-2 ml "
                  href="/cart"
                >
                  {t("cart")}(0)
                </a>
              }
            >
              <CartButton />
            </Suspense>
            <Theme/>
            <LanguageToggle/>
          </div>
        </nav>
      </header>
    </div>
  )
}
