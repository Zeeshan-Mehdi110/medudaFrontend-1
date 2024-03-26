import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveOrder } from "@lib/data"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
import initTranslations from "app/i18n"

type Props = {
  params: { id: string, locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const order = await retrieveOrder(params.id).catch(() => null)
  const {locale} = params;
  const { t } = await initTranslations(locale, ['common']);
  if (!order) {
    notFound()
  }

  return {
    title: `${t("order")} #${order.display_id}`,
    description: t("view-your-order"),
  }
}

export default async function OrderDetailPage({ params }: Props) {
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return <OrderDetailsTemplate params={params} order={order} />
}
