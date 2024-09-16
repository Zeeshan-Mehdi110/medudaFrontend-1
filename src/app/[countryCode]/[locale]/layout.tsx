import { Metadata } from "next"
import "styles/globals.css"
import TranslationsProvider from "../../../modules/translations/TranslationsProvider";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
import initTranslations from '../../i18n'
import { locales } from "../../../../config/config";
import { listRegions } from "@lib/data";
import { Poppins } from "next/font/google";

type Props = {
  params: {countryCode: string; locale: string }
}


export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regions) =>
    regions?.map((r) => r.countries.map((c) => c.iso_2)).flat()
  );

  let staticParams: any = [];

  locales.forEach((locale) => {
    const localeParams = countryCodes
      ?.map((countryCode) => ({
        countryCode,
        locale
      }))
      .flat() ?? [];

    staticParams = [...staticParams, ...localeParams];
  });
  return staticParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  
  
  return {
    title: "Pixels Jourey Store",
    description: "Pixels Jourey Store",
  }
}
const inter = Poppins({subsets:["latin"], weight: "600"})
const i18NameSpaces = ['common','profile',"en"];
export default async function Layout(props: { children: React.ReactNode, params: { locale: string }}) {
  const { params:{locale} } = props;

  const { t,resources } = await initTranslations(locale, ['common',"profile","en"]);
  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  return (
  <TranslationsProvider resources={resources} locale={locale} namespaces={i18NameSpaces} >
    <html lang={locale} data-mode="light" dir={dir}>
      
    <body className={`dark:bg-black ${inter.className}`}>
        <main className="relative  bg-white-smoke dark:bg-black ">{props.children}
        </main>
      </body>
  
    </html>
    </TranslationsProvider>
  )
}
