import { Suspense } from "react"
import { getSession, listRegions } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Theme from "@modules/layout/components/theme-toggle"
import LanguageToggle from "@modules/layout/components/language-toggle"
import initTranslations from "app/i18n"
import { Heart, ShoppingCart, ShoppingCartSolid, User } from "@medusajs/icons"
import { Poppins } from "next/font/google"
import PromotionText from "@modules/home/components/promotion-text"
import CustomSearch from "@modules/layout/components/custom-search"
import { headers } from "next/headers"

const merienda = Poppins({
  fallback: ["sans-serif"],
  weight: "400",
  subsets: ["latin"],
})

export default async function Nav(params: any) {
  const regions = await listRegions().then((regions) => regions)
  const locale = params.children[1].locale
  const countryCode = params.children[1].countryCode
  const session = await getSession().catch(() => null)
  const { t } = await initTranslations(locale, ["common"])

  const heads = headers()

  const pathname = heads.get("x-pathname")
  const isHomePage = pathname === `/${countryCode}/${locale}`

  return (
    <div className="sticky top-0 inset-x-0 z-50 group ">
      {isHomePage && <PromotionText />}
      <header className="relative  dark:bg-black bg-ui-bg-subtle h-16 mx-auto border-b duration-200  border-ui-border-base">
        <nav className="content-container overflow-x-hidden overflow-y-hidden txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full  h-full text-small-regular gap-[20px] pr-2 pl-2">
          <div className="flex-1 basis-0 h-full flex items-center sm:justify-between gap-4">
            <div className="h-full">
              <SideMenu locale={locale} regions={regions} session={session} />
            </div>
            <div className="sm:hidden">
              <Theme />
            </div>
          </div>

          <div
            className={`flex items-center h-full sm:pl-0 w-[140px] scale-100 sm:scale-90`}
          >
            <h1 className="text-center w-min sm:w-fit">
              <LocalizedClientLink
                href="/"
                className={`txt-compact-xlarge-plus hover:text-ui-fg-base uppercase ${merienda.className} text-lg sm:text-xl`}
              >
                <img
                  className="pb-[25px] sm:scale-100 scale-80 max-w-[150px] min-w-[150px]"
                  alt="navigation bar logo"
                  id="nav-logo"
                  src="/rr.svg"
                ></img>
              </LocalizedClientLink>
            </h1>
          </div>

          <div className="flex items-center gap-[10px] scale-90 sm:scale-100 sm:gap-x-6 h-full flex-1 basis-0 justify-end sm:pl-0">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.FEATURE_SEARCH_ENABLED && (
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex flex-col justify-center items-center"
                  href={session ? "/account/my-images" : "/account"}
                  scroll={false}
                >
                  <Heart fill="red" />
                  {t("wishlist")}
                </LocalizedClientLink>
              )}
              <LocalizedClientLink
                className="hover:text-ui-fg-base flex flex-col justify-center items-center"
                href="/account"
              >
                <User fill="#87CEEB" />
                {t("account")}
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <a
                  className="hover:text-ui-fg-base flex flex-col gap-2 ml "
                  href="/cart"
                >
                  <ShoppingCartSolid className="mr-1" />
                  {t("cart")}
                </a>
              }
            >
              <CartButton />
            </Suspense>
            <div className="hidden sm:block">
              <Theme />
            </div>
            <LanguageToggle locale={locale} />
          </div>
        </nav>
      </header>
      <div className="flex justify-center items-center w-full bg-white-smoke dark:bg-black">
        {isHomePage && <CustomSearch locale={locale} />}
      </div>
    </div>
  )
}
