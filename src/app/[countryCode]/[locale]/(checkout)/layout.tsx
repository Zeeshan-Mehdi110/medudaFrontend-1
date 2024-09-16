import { getLang } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import LanguageToggle from "@modules/layout/components/language-toggle"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import Theme from "@modules/layout/components/theme-toggle"
import initTranslations from "app/i18n"
export default async function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: any
}) {
  const {locale} = params;
  const { t} = await initTranslations(locale, ['common']);
  const isRtl = locale === 'ar' || locale === 'he';
  return (
    <div className="w-full bg-white dark:text-white dark:bg-black relative small:min-h-screen ">
      <div className="h-16 bg-white dark:text-white dark:bg-black border-b ">
        <nav className="flex h-full items-center content-container justify-between gap-4 !pl-1 !pr-1">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase w-1/3"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
             {t("back-to-shopping-cart")}
            </span>
            <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              {t("back")}
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className={`flex justify-center ${isRtl ? "pr-2" : "pl-2"} t-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase w-1/3`}
          >
               <img className="pb-[25px] sm:scale-100 scale-80 max-w-[150px] min-w-[150px]" alt='navigation bar logo' id="nav-logo" src="/rr.svg"></img>
          </LocalizedClientLink>
         
          {/* <div className="flex-1 basis-0" /> */}
          <div className="flex justify-end gap-2 w-1/3 sm:scale-100 scale-80">
          <Theme/>
          <LanguageToggle locale={locale} />
          </div>
   
        </nav>

        
      </div>
      <div className="relative">{children}</div>
      <div className="py-4 w-full flex items-center justify-center">
        <MedusaCTA />
      </div>
    </div>
  )
}
