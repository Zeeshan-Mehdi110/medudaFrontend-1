import { headers } from "next/headers"
import { Suspense } from "react"
import { listRegions } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Theme from "@modules/layout/components/theme-toggle"
import LanguageToggle from "@modules/layout/components/language-toggle"
import initTranslations from "app/i18n"
import Image from "next/image"
import { MagnifyingGlass, ShoppingCart, User } from "@medusajs/icons"
import { Merienda } from 'next/font/google'
import PromotionText from "@modules/home/components/promotion-text"
const merienda = Merienda({
  fallback: ['sans-serif'],
  weight: "800",
  subsets:['latin']
})
export default async function Nav(params:any) {
  const regions = await listRegions().then((regions) => regions)
  const locale = params.children[1];
  const { t } = await initTranslations(locale, ['common']);
  const isRtl = locale === 'ar' || locale === 'he';

  return (
    <div className="sticky top-0 inset-x-0 z-50 group ">
       <PromotionText></PromotionText>
      <header className="relative  dark:bg-black bg-ui-bg-subtle h-16 mx-auto border-b duration-200  border-ui-border-base">
      <nav className="content-container overflow-x-hidden overflow-y-hidden txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full  h-full text-small-regular gap-[2px] pr-2 pl-2">
        <div className="flex-1 basis-0 h-full flex items-center sm:justify-between gap-4">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
            <div className="sm:hidden"><Theme/></div>
          </div>

          <div className={`flex items-center h-full sm:pl-0 w-[140px] scale-100 sm:scale-90`}>
          
          <h1 className="text-center w-min sm:w-fit">
            <LocalizedClientLink
              href="/"
              className={`txt-compact-xlarge-plus hover:text-ui-fg-base uppercase ${merienda.className} text-lg sm:text-xl`}
            >
            <img className="pb-[25px] sm:scale-100 scale-80 max-w-[150px] min-w-[150px]" alt='navigation bar logo' id="nav-logo" src="/rr.svg"></img>
              {/* <Image width={60} height={65}  src="/logo.png" alt='Pixels Journey Logo'></Image> */}
              {/* Pixels Journey */}
            </LocalizedClientLink>
            </h1>
          </div>

          <div className="flex items-center gap-1 scale-90 sm:scale-100 sm:gap-x-6 h-full flex-1 basis-0 justify-end sm:pl-0">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.FEATURE_SEARCH_ENABLED && (
             <LocalizedClientLink
             className="hover:text-ui-fg-base flex flex-col justify-center items-center"
             href="/search"
             scroll={false}
           >
             <MagnifyingGlass/>
             {t("search")}
           </LocalizedClientLink>
              )}
           <LocalizedClientLink
                className="hover:text-ui-fg-base flex flex-col justify-center items-center"
                href="/account"
              >
                <User/>
                {t("account")}
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <a
                  className="hover:text-ui-fg-base flex flex-col gap-2 ml "
                  href="/cart"
                >
                  <ShoppingCart className="mr-1" />
                  {t("cart")}
                </a>
              }
            >
              <CartButton />
            </Suspense>
            <div className="hidden sm:block">
              <Theme/>
            </div>
            <LanguageToggle locale={locale}/>
          </div>
        </nav>
      </header>
    </div>
  )
}
