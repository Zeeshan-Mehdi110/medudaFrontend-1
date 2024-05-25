import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getCustomer, getLang } from "@lib/data"
import initTranslations from "app/i18n"
import { getRegion } from "app/actions"
import { headers } from "next/headers"

type Props = {
  params: { locale: string }

}
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { t } = await initTranslations(params.locale, ['common']);
 
  return {
    title: t("shipping-addresses"),
    description: t("update-shipping-addresses"),
  }
}

export default async function Addresses({params}: {params: any}) {
  const {countryCode} = params;
  const customer = await getCustomer().catch(() => null)
  const region = await getRegion(countryCode)
  const {locale} = params;
  const { t } = await initTranslations(locale, ['common']);
  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t("shipping-addresses")}</h1>
        <p className="text-base-regular">
        {t("update-shipping-addresses")}
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
