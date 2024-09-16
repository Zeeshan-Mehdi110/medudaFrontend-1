import Addresses from "@modules/checkout/components/addresses"
import Shipping from "@modules/checkout/components/shipping"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import {
  createPaymentSessions,
  getCustomer,
  listShippingMethods,
} from "@lib/data"
import { cookies } from "next/headers"
import { CartWithCheckoutStep } from "types/global"
import { getCheckoutStep } from "@lib/util/get-checkout-step"

export default async function CheckoutForm({ locale }: { locale: string }) {
  const cartId = cookies().get("_medusa_cart_id")?.value
  if (!cartId) {
    return null
  }

  // create payment sessions and get cart
  const cart = (await createPaymentSessions(cartId).then(
    (cart) => cart
  )) as CartWithCheckoutStep

  if (!cart) {
    return null
  }

  cart.checkout_step = cart && getCheckoutStep(cart)
  const isOnlyGiftCard = cart.items.every((item) => item.is_giftcard)
  // get available shipping methods
  const availableShippingMethods = await listShippingMethods(
    cart.region_id
  ).then((methods) => methods?.filter((m) => !m.is_return))

  if (!availableShippingMethods) {
    return null
  }

  // get customer if logged in
  const customer = await getCustomer()

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-8 bg-white  dark:text-white dark:bg-black">
        <div>
          <Addresses locale={locale} cart={cart} customer={customer} />
        </div>
        {!isOnlyGiftCard && (
          <div>
            <Shipping
              cart={cart}
              availableShippingMethods={availableShippingMethods}
            />
          </div>
        )}

        <div>
          <Payment locale={locale} cart={cart} />
        </div>

        <div>
          <Review cart={cart} />
        </div>
      </div>
    </div>
  )
}
