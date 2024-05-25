import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import { CartWithCheckoutStep } from "types/global"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { Customer } from "@medusajs/medusa"

const CartTemplate = ({
  cart,
  customer,
  locale,
}: {
  cart: CartWithCheckoutStep | null
  customer: Omit<Customer, "password_hash"> | null
  locale: string
}) => {
  return (
    <div className="py-12 dark:text-white ">
      <div className="content-container">
        {cart?.items.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 pr-4 pl-4 gap-y-6 dark:bg-black">
              {!customer && (
                <>
                  <SignInPrompt locale={locale} />
                  <Divider />
                </>
              )}
              <ItemsTemplate locale={locale} region={cart?.region} items={cart?.items} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white py-6 dark:bg-black pr-4 pl-4">
                      <Summary cart={cart} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage locale={locale} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
