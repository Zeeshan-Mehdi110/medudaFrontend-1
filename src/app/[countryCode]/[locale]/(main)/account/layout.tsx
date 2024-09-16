import { getCustomer } from "@lib/data"
import AccountLayout from "@modules/account/templates/account-layout"

export default async function AccountPageLayout({
  dashboard,
  login,
  params,
}: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
  params: any
}) {
  const customer = await getCustomer().catch(() => null)
  const {locale} = params;
  return (
    <AccountLayout locale={locale} customer={customer}>
      {customer ? dashboard : login}
    </AccountLayout>
  )
}
