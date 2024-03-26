import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { listCustomerOrders } from "@lib/data"
import { notFound } from "next/navigation"
import { getLang } from "@lib/data"
import initTranslations from "app/i18n"
export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders({params}: {params: any}) {
  const orders = await listCustomerOrders()
  const {locale} = params;
const { t } = await initTranslations(locale, ['common']);
  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t("orders")}</h1>
        <p className="text-base-regular">
        {t("view-orders-status")}
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
      </div>
    </div>
  )
}
