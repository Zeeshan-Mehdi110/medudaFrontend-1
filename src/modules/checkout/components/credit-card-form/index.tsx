import React, { useState } from "react"
import {
  TextField,
  Grid,
  Typography,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material"
import { Button } from "@medusajs/ui"
import CustomSpinner from "@modules/common/icons/custom-spinner"

interface CardFormState {
  cardNumber: string
  cardName: string
  expDate: string
  cvc: string
  payments: number
}

interface TaxLine {
  rate: number
  name: string
  code: string
  item_id: string
}

interface Variant {
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

interface Product {
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

interface Item {
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

interface ShippingProfile {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  name: string
  type: string
  metadata: any | null
}

interface CreditCardFormProps {
  items: any
  shippingTotal: number | null
  onTransactionComplete: (result: { success: boolean; data?: any }) => void
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  items,
  shippingTotal,
  onTransactionComplete,
}) => {
  const [cardDetails, setCardDetails] = useState<CardFormState>({
    cardNumber: "",
    cardName: "",
    expDate: "",
    cvc: "",
    payments: 1, // default payment option is 1
  })

  const [errors, setErrors] = useState<Partial<CardFormState>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingError, setIsProcessingError] = useState(false)
  const [transactionMessage, setTransactionMessage] = useState<string | null>(null) // New state for transaction message


  const validate = () => {
    let tempErrors: Partial<CardFormState> = {}
    let formIsValid = true

    // Card Number Validation: Basic check for length
    if (cardDetails.cardNumber.replace(/\s+/g, "").length !== 16) {
      tempErrors.cardNumber = "Card number is invalid"
      formIsValid = false
    }

    // Card Name Validation: Basic check for non-empty
    if (!cardDetails.cardName) {
      tempErrors.cardName = "Cardholder name is required"
      formIsValid = false
    }

    // Expiration Date Validation: Basic format check
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expDate)) {
      tempErrors.expDate = "Expiration date must be MM/YY"
      formIsValid = false
    }

    // CVC Validation: Basic check for 3 digits
    if (cardDetails.cvc.length !== 3) {
      tempErrors.cvc = "CVC must be 3 digits"
      formIsValid = false
    }

    setErrors(tempErrors)
    return formIsValid
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target as {
      name: keyof CardFormState
      value: string // Assuming all inputs are expected to be string types for simplicity.
    }

    if (name === "expDate") {
      // Automatically add a slash for expiration date inputs.
      let formattedValue = value
        .replace(
          /[^0-9]/g,
          "" // Remove non-numeric characters.
        )
        .substring(0, 4) // Limit length to 4 characters (MMYY).

      // Insert slash after the first two digits (MM) if more digits are typed.
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.substring(
          0,
          2
        )}/${formattedValue.substring(2)}`
      }

      setCardDetails((prev) => ({
        ...prev,
        [name]: formattedValue, // Update specifically the expDate field.
      }))
    } else if (name === "cvc") {
      // Limiting CVC input to 3 digits
      const formattedCVC = value.replace(/[^0-9]/g, "").substring(0, 3)
      setCardDetails((prev) => ({
        ...prev,
        [name]: formattedCVC,
      }))
    } else {
      // Handle other inputs normally.
      setCardDetails((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  let itemsArray = items.map((item: Item) => {
    return {
      code: item.id,
      name: item.title,
      unit_price: item.total / 100,
      type: "I",
      units_number: item.quantity,
      unit_type: 1,
      price_type: "G",
      currency_code: "ILS",
    }
  })
  itemsArray.push({
    code: "shipping",
    name: "shipping",
    unit_price: shippingTotal ?? 0 / 100,
    type: "I",
    units_number: 1,
    unit_type: 1,
    price_type: "G",
    currency_code: "ILS",
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      setIsLoading(true)
      setTransactionMessage(null) // Clear previous messages
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/tranzilla`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              terminal_name: "artifex",
              txn_currency_code: "ILS",
              txn_type: "debit",
              verify_mode: 5,
              reference_txn_id: null,
              authorization_number: null,
              card_number: cardDetails.cardNumber,
              expire_month: parseInt(cardDetails.expDate.split("/")[0], 10),
              expire_year: parseInt(cardDetails.expDate.split("/")[1], 10),
              payment_plan: cardDetails.payments,
              cvv: cardDetails.cvc,
              items: itemsArray,
            }),
          }
        )

        if (!response.ok) {
          setIsProcessingError(true)
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const { data } = await response.json()

        if (Number(data.error_code) === 0) {
          setTransactionMessage("Payment successful!")
          onTransactionComplete({ success: true, data })
        } else {
          setIsProcessingError(true)
          setTransactionMessage(`Payment failed: ${data.error_message}`)
          onTransactionComplete({ success: false, data })
        }
      } catch (e) {
        setIsProcessingError(true)
        setTransactionMessage("An error occurred during the transaction.")
        console.error(e)
        onTransactionComplete({ success: false, data: e })
      }
    } else {
      console.log("Form is invalid")
    }
    setIsLoading(false)
  }
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if (validate()) {
  //     setIsLoading(true)
  //     try {
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/tranzilla`,
  //         {
  //           method: "POST",
  //           headers: {
  //             Accept: "application/json",
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             terminal_name: "artifex",
  //             txn_currency_code: "ILS",
  //             txn_type: "debit",
  //             verify_mode: 5,
  //             reference_txn_id: null,
  //             authorization_number: null,
  //             card_number: cardDetails.cardNumber,
  //             expire_month: parseInt(cardDetails.expDate.split("/")[0], 10),
  //             expire_year: parseInt(cardDetails.expDate.split("/")[1], 10),
  //             payment_plan: cardDetails.payments,
  //             cvv: cardDetails.cvc,
  //             items: itemsArray,
  //           }),
  //         }
  //       )

  //       if (!response.ok) {
  //         setIsProcessingError(true)
  //         throw new Error(`HTTP error! status: ${response.status}`)
  //       }

  //       const { data } = await response.json()

  //       if (Number(data.error_code) === 0) {
  //         onTransactionComplete({ success: true, data })
  //       } else {
  //         setIsProcessingError(true)
  //         onTransactionComplete({ success: false, data })
  //       }
  //     } catch (e) {
  //       setIsProcessingError(true)
  //       console.error(e)
  //       onTransactionComplete({ success: false, data: e })
  //     }
  //   } else {
  //     console.log("Form is invalid")
  //   }
  //   setIsLoading(false)
  // }

  return (
    <Container style={{ margin: 0 }}>
      <Typography variant="h6" gutterBottom>
        Credit Card Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              label="Card Number"
              name="cardNumber"
              fullWidth
              variant="outlined"
              value={cardDetails.cardNumber}
              onChange={handleChange}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber || "Enter the 16-digit card number"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Card Name"
              name="cardName"
              fullWidth
              variant="outlined"
              value={cardDetails.cardName}
              onChange={handleChange}
              error={!!errors.cardName}
              helperText={errors.cardName || "Enter the name on the card"}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              label="Expiration Date (MM/YY)"
              name="expDate"
              fullWidth
              variant="outlined"
              value={cardDetails.expDate}
              onChange={handleChange}
              error={!!errors.expDate}
              helperText={errors.expDate || "Enter expiration date as MM/YY"}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              label="CVC"
              name="cvc"
              fullWidth
              variant="outlined"
              value={cardDetails.cvc}
              onChange={handleChange}
              error={!!errors.cvc}
              helperText={errors.cvc || "Enter the 3-digit CVC"}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.payments}>
              <InputLabel id="payments-label">Number of Payments</InputLabel>
              <Select
                labelId="payments-label"
                value={cardDetails.payments}
                label="Number of Payments"
                name="payments"
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {errors.payments || "Select the number of payments (up to 6)"}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="primary" className="w-full h-9">
              {isLoading ? <CustomSpinner/> : "Pay Now"}
            </Button>
          </Grid>
        </Grid>
      </form>
      {transactionMessage && (
        <Typography variant="body1" className={`text-center flex justify-end items-center h-12 bg-${isProcessingError ? "red" :"green"}-200`} color={isProcessingError ? "error" : "textPrimary"} style={{ marginTop: '16px',borderRadius:'6px' }}>
          {transactionMessage}
        </Typography>
      )}
    </Container>
  )
}

export default CreditCardForm
