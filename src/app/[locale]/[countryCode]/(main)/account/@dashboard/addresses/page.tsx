import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getCustomer, getLang } from "@lib/data"
import initTranslations from "app/i18n"
import { getRegion } from "app/actions"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses() {
  const nextHeaders = headers()
  const countryCodeCookie = nextHeaders.get("cookie")?.split("; ").find((cookie) => cookie.startsWith("countryCode="))
  const countryCode = countryCodeCookie?.split("=")[1] || ""
  // const countryCode = nextHeaders.get("next-url")?.split("/")[2] || ""
  const customer = await getCustomer()
  const region = await getRegion(countryCode)
  const locale = getLang();
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
