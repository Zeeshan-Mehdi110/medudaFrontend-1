"use client"

import {
  useSearchParams,
  useRouter,
  usePathname,
  useParams,
} from "next/navigation"
import { Cart, Customer } from "@medusajs/medusa"
import { CheckCircleSolid } from "@medusajs/icons"
import { Heading, Text, useToggleState } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"

import BillingAddress from "../billing_address"
import ShippingAddress from "../shipping-address"
import { setAddresses } from "../../actions"
import { SubmitButton } from "../submit-button"
import { useFormState } from "react-dom"
import ErrorMessage from "../error-message"
import compareAddresses from "@lib/util/compare-addresses"
import { useTranslation } from "react-i18next"
const Addresses = ({
  cart,
  customer,
  locale
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
  customer: Omit<Customer, "password_hash"> | null,
  locale: string
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const { t } = useTranslation()
  const countryCode = params.countryCode as string
  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsSBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useFormState(setAddresses, null)

  return (
    <div className="bg-white dark:text-white dark:bg-black">
      <div className="flex flex-row items-center justify-between mb-6 ">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          {t("address")}
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && cart?.payment_session && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
            >
                {t("edit")}
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              countryCode={countryCode}
              checked={sameAsSBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
              locale={locale}
            />

            {!sameAsSBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-3xl-regular gap-x-4 pb-6 pt-8"
                >
                 {t("billing-address")}
                </Heading>

                <BillingAddress cart={cart} countryCode={countryCode} />
              </div>
            )}
            <SubmitButton className="mt-6">{t("continue-to-delivery")}</SubmitButton>
            <ErrorMessage error={message} />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div className="flex flex-col w-1/3">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                    {t("shipping-address")}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div className="flex flex-col w-1/3 break-words break-all">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                    {t("contact")}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.email}
                    </Text>
                  </div>

                  <div className="flex flex-col w-1/3">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                    {t("billing-address")}
                    </Text>

                    {sameAsSBilling ? (
                      <Text className="txt-medium text-ui-fg-subtle">
                       {t("billing-delivery-same")}
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.first_name}{" "}
                          {cart.billing_address.last_name}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.address_1}{" "}
                          {cart.billing_address.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.postal_code},{" "}
                          {cart.billing_address.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
