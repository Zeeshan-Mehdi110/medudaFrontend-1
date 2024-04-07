import { Metadata } from "next"
import "styles/globals.css"
import TranslationsProvider from "../../../modules/translations/TranslationsProvider";
// import { Next, useMessages } from 'next-intl';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
import initTranslations from '../../i18n'
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}
const i18NameSpaces = ['common','profile',"en"];
export default async function RootLayout(props: { children: React.ReactNode, params: { locale: string }}) {
  const { params } = props;
  const { t,resources } = await initTranslations(params.locale, ['common',"profile","en"]);
  const dir = params.locale === 'ar' || params.locale === 'he' ? 'rtl' : 'ltr';
  return (
  <TranslationsProvider resources={resources} locale={params.locale} namespaces={i18NameSpaces} >
    <html lang={params.locale} data-mode="light" dir={dir}>
      
      <body className="dark:bg-black">
        <main className="relative  bg-white-smoke dark:bg-black ">{props.children}
        </main>
      </body>
  
    </html>
    </TranslationsProvider>
  )
}
