import { Cart } from "@medusajs/medusa"

export interface CardFormState {
    cardNumber: string
    cardName: string
    expDate: string
    cvc: string
    payments: number
  }
  
  export interface TaxLine {
    rate: number
    name: string
    code: string
    item_id: string
  }
  
  export interface Variant {
    id: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    title: string
    product_id: string
    sku: string | null
    barcode: string | null
    ean: string | null
    upc: string | null
    variant_rank: number
    inventory_quantity: number
    allow_backorder: boolean
    manage_inventory: boolean
    hs_code: string | null
    origin_country: string | null
    mid_code: string | null
    material: string | null
    weight: number | null
    length: number | null
    height: number | null
    width: number | null
    metadata: any | null
    product: Product
  }
  
  export interface Product {
    id: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    title: string
    subtitle: string | null
    description: string
    handle: string
    is_giftcard: boolean
    status: string
    thumbnail: string
    weight: number
    length: number | null
    height: number | null
    width: number | null
    hs_code: string | null
    origin_country: string | null
    mid_code: string | null
    material: string | null
    collection_id: string
    type_id: string | null
    discountable: boolean
    external_id: string | null
    metadata: any | null
    profiles: ShippingProfile[]
    profile: ShippingProfile
    profile_id: string
  }
  
  export interface Item {
    id: string
    created_at: string
    updated_at: string
    cart_id: string
    order_id: string | null
    swap_id: string | null
    claim_order_id: string | null
    original_item_id: string | null
    order_edit_id: string | null
    title: string
    description: string
    thumbnail: string
    is_return: boolean
    is_giftcard: boolean
    should_merge: boolean
    allow_discounts: boolean
    has_shipping: boolean
    unit_price: number
    units_number: number
    variant_id: string
    quantity: number
    fulfilled_quantity: number | null
    returned_quantity: number | null
    shipped_quantity: number | null
    metadata: any
    adjustments: any[]
    tax_lines: TaxLine[]
    variant: Variant
    subtotal: number
    discount_total: number
    total: number
    original_total: number
    original_tax_total: number
    tax_total: number
    raw_discount_total: number
  }
  
  export interface ShippingProfile {
    id: string
    created_at: string
    updated_at: string
    deleted_at: string | null
    name: string
    type: string
    metadata: any | null
  }
  
  export interface CreditCardFormProps {
    items: any
    shippingTotal: any | null
    onTransactionComplete: (result: { success: boolean; data?: any }) => void,
    cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null,
  }
  
  