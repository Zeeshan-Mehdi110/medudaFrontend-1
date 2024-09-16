"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { Cart } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
const Review = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}) => {
  const searchParams = useSearchParams()
const { t } = useTranslation()
  const isOpen = searchParams.get("step") === "review"
  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  // const previousStepsCompleted =
  //   cart.shipping_address &&
  //   (paidByGiftcard ||cart.items.every((item) => item.is_giftcard) || cart.shipping_methods.length > 0)  &&
  //   cart.payment_session

  const previousStepsCompleted =
  cart.shipping_address &&
  (cart.items.every((item) => item.is_giftcard) || cart.shipping_methods.length > 0)  &&
  (cart.payment_session || paidByGiftcard)

  return (
    <div className="bg-white dark:text-white dark:bg-black">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
            {t("review-order")}
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
              {t("order-confirmation")}
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} />
        </>
      )}
    </div>
  )
}

export default Review
