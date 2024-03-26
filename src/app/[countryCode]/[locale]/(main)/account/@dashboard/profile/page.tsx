import { Metadata, ResolvingMetadata } from "next"

import ProfilePhone from "@modules/account//components/profile-phone"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePassword from "@modules/account/components/profile-password"
import initTranslations from "app/i18n"
import { getCustomer, getLang, listRegions } from "@lib/data"
import { notFound } from "next/navigation"

type Props = {
  params: { locale: string }

}
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { t } = await initTranslations(params.locale, ['common']);
 
  return {
    title: t("profile"),
    description: t("view-your-profile"),
  }
}

export default async function Profile({params}: {params: any}) {
  const customer = await getCustomer()
  const regions = await listRegions()
  const {locale} = params;
  const { t } = await initTranslations(locale, ["common"])
  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi"> {t("profile")}</h1>
        <p className="text-base-regular">{t("update-profile-info")}</p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <ProfileName customer={customer} />
        <Divider />
        <ProfileEmail customer={customer} />
        <Divider />
        <ProfilePhone customer={customer} />
        <Divider />
        <ProfilePassword customer={customer} />
        <Divider />
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </div>
  )
}

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />
}
