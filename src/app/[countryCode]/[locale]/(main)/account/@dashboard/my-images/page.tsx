import { Metadata, ResolvingMetadata } from "next"
import initTranslations from "app/i18n"
import { getCustomer, getLang, listRegions } from "@lib/data"
import { notFound } from "next/navigation"
import { Text } from "@medusajs/ui"

import MyImagesComponent from "@modules/my-images"
import WishList from "@modules/common/components/wishlist"
import { getRegion } from "app/actions"

type Props = {
  params: { locale: string }

}
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { t } = await initTranslations(params.locale, ['common']);
 
  return {
    title: t("my-images"),
    description: t("view-your-profile"),
  }
}


export default async function MyImages({params}: {params: any}) {
  const customer = await getCustomer().catch(() => null)
  const regions = await listRegions()

  const {locale, countryCode} = params;
  const region = await getRegion(countryCode)
  const { t } = await initTranslations(locale, ["common"])
//   const {result:{token}} = await fetchCloudflareBatchToken();
  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-8">
        <h1 className="text-2xl-semi"> {t("my-images")}</h1>
        <Text size="large">{t("upload-manage-images")}.</Text>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
      <MyImagesComponent countryCode={countryCode} locale={locale} customer={customer}></MyImagesComponent>
      <WishList locale={locale} region={region} countryCode={countryCode}></WishList>
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />
}
