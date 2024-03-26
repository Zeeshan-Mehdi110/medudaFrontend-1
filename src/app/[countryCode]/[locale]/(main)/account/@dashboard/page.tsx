import { Metadata, ResolvingMetadata } from "next"

import { getCustomer, listCustomerOrders } from "@lib/data"
import Overview from "@modules/account/components/overview"
import { notFound } from "next/navigation"
import initTranslations from "app/i18n"

type Props = {
  params: { locale: string }

}
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { t } = await initTranslations(params.locale, ['common']);
 
  return {
    title: t("account"),
    description: t("overview-of-your-account-activity"),
  }
}

export default async function OverviewTemplate() {
  const customer = await getCustomer().catch(() => null)
  const orders = (await listCustomerOrders().catch(() => null)) || null

  if (!customer) {
    notFound()
  }

  return <Overview customer={customer} orders={orders} />
}
