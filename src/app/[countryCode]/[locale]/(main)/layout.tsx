import { Metadata, ResolvingMetadata } from "next"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import initTranslations from "app/i18n"
import PromotionText from "@modules/home/components/promotion-text"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export async function generateMetadata(
  { params }: { params: { locale: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { t } = await initTranslations(params.locale, ["common"])
  const translatedKeywords = t("pixels-journey-store-seo-keywords").split(",")
  return {
    title: "Pixels Journey Store",
    description: t("pixels-journey-store-seo-description"),
    keywords: translatedKeywords,
    openGraph: { images: ["/opengraph-image.png"] },
  }
}

type NavProps = {
  children?: React.ReactNode
  params: { locale: string; countryCode: string }
}
export default async function PageLayout(props: {
  children: React.ReactNode
  params: { locale: string; countryCode: string }
}) {
  return (
    <>
      <Nav> {props.params}</Nav>
      {props.children}
      <Footer locale={props.params.locale} />
    </>
  )
}
