"use client"

import { Order } from "@medusajs/medusa"
import { XMark } from "@medusajs/icons"
import React from "react"

import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type OrderDetailsTemplateProps = {
  order: Order,
  params: any
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
  params,
}) => {
  const {locale} = params;
  const isGiftCardOnly= order.items.every((item) => item.is_giftcard) 
  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center">
        <h1 className="text-2xl-semi">Order details</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
        >
          <XMark /> Back to overview
        </LocalizedClientLink>
      </div>
      <div className="flex flex-col gap-4 h-full bg-white w-full">
        <OrderDetails order={order} showStatus />
        <Items locale={locale} items={order.items} region={order.region} />
        {!isGiftCardOnly &&  <ShippingDetails order={order} />}
        <OrderSummary locale={locale} order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
