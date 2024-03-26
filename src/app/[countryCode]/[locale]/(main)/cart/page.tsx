import { LineItem } from "@medusajs/medusa"
import { Metadata, ResolvingMetadata } from "next"

import CartTemplate from "@modules/cart/templates"

import { enrichLineItems, retrieveCart } from "@modules/cart/actions"
import { getCheckoutStep } from "@lib/util/get-checkout-step"
import { CartWithCheckoutStep } from "types/global"
import { getCustomer } from "@lib/data"
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
    title: t("cart"),
    description: t("cart-page-meta-description"),
  }
}

const fetchCart = async () => {
  const cart = await retrieveCart().then((cart) => cart as CartWithCheckoutStep)

  if (!cart) {
    return null
  }

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems as LineItem[]
  }

  cart.checkout_step = cart && getCheckoutStep(cart)

  return cart
}

export default async function Cart({params}: {params: any}) {
  const {locale} = params;
  const cart = await fetchCart()
  const customer = await getCustomer()

  return <CartTemplate locale={locale} cart={cart} customer={customer} />
}
