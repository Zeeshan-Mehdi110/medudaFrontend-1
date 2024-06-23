// import React, { useState } from "react"
// import {
//   Grid,
//   Typography,
//   Container,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   FormHelperText,
// } from "@mui/material"
// import { Button } from "@medusajs/ui"
// import CustomSpinner from "@modules/common/icons/custom-spinner"
// import { useTranslation } from "react-i18next"
// import Input from "@modules/common/components/input"
// import NativeSelect from "@modules/common/components/native-select"
// import { CheckCircleSolid, XCircleSolid } from "@medusajs/icons"

// interface CardFormState {
//   cardNumber: string
//   cardName: string
//   expDate: string
//   cvc: string
//   payments: number
// }

// interface TaxLine {
//   rate: number
//   name: string
//   code: string
//   item_id: string
// }

// interface Variant {
//   id: string
//   created_at: string
//   updated_at: string
//   deleted_at: string | null
//   title: string
//   product_id: string
//   sku: string | null
//   barcode: string | null
//   ean: string | null
//   upc: string | null
//   variant_rank: number
//   inventory_quantity: number
//   allow_backorder: boolean
//   manage_inventory: boolean
//   hs_code: string | null
//   origin_country: string | null
//   mid_code: string | null
//   material: string | null
//   weight: number | null
//   length: number | null
//   height: number | null
//   width: number | null
//   metadata: any | null
//   product: Product
// }

// interface Product {
//   id: string
//   created_at: string
//   updated_at: string
//   deleted_at: string | null
//   title: string
//   subtitle: string | null
//   description: string
//   handle: string
//   is_giftcard: boolean
//   status: string
//   thumbnail: string
//   weight: number
//   length: number | null
//   height: number | null
//   width: number | null
//   hs_code: string | null
//   origin_country: string | null
//   mid_code: string | null
//   material: string | null
//   collection_id: string
//   type_id: string | null
//   discountable: boolean
//   external_id: string | null
//   metadata: any | null
//   profiles: ShippingProfile[]
//   profile: ShippingProfile
//   profile_id: string
// }

// interface Item {
//   id: string
//   created_at: string
//   updated_at: string
//   cart_id: string
//   order_id: string | null
//   swap_id: string | null
//   claim_order_id: string | null
//   original_item_id: string | null
//   order_edit_id: string | null
//   title: string
//   description: string
//   thumbnail: string
//   is_return: boolean
//   is_giftcard: boolean
//   should_merge: boolean
//   allow_discounts: boolean
//   has_shipping: boolean
//   unit_price: number
//   variant_id: string
//   quantity: number
//   fulfilled_quantity: number | null
//   returned_quantity: number | null
//   shipped_quantity: number | null
//   metadata: any
//   adjustments: any[]
//   tax_lines: TaxLine[]
//   variant: Variant
//   subtotal: number
//   discount_total: number
//   total: number
//   original_total: number
//   original_tax_total: number
//   tax_total: number
//   raw_discount_total: number
// }

// interface ShippingProfile {
//   id: string
//   created_at: string
//   updated_at: string
//   deleted_at: string | null
//   name: string
//   type: string
//   metadata: any | null
// }

// interface CreditCardFormProps {
//   items: any
//   shippingTotal: number | null
//   onTransactionComplete: (result: { success: boolean; data?: any }) => void
// }

// const CreditCardForm: React.FC<CreditCardFormProps> = ({
//   items,
//   shippingTotal,
//   onTransactionComplete,
// }) => {
//   const [cardDetails, setCardDetails] = useState<CardFormState>({
//     cardNumber: "",
//     cardName: "",
//     expDate: "",
//     cvc: "",
//     payments: 1, // default payment option is 1
//   })

//   const [errors, setErrors] = useState<Partial<CardFormState>>({})
//   const [isLoading, setIsLoading] = useState(false)
//   const [isProcessingError, setIsProcessingError] = useState(false)
//   const [transactionMessage, setTransactionMessage] = useState<string | null>(null) // New state for transaction message
//   const { t } = useTranslation()

//   const validate = () => {
//     let tempErrors: Partial<CardFormState> = {}
//     let formIsValid = true

//     // Card Number Validation: Basic check for length
//     if (cardDetails.cardNumber.replace(/\D/g, "").length !== 16) {
//       tempErrors.cardNumber = "Card number is invalid"
//       formIsValid = false
//     }

//     // Card Name Validation: Basic check for non-empty
//     if (!cardDetails.cardName || /\d/.test(cardDetails.cardName)) {
//       tempErrors.cardName = "Cardholder name is required and can't contain numbers"
//       formIsValid = false
//     }

//     // Expiration Date Validation: Basic format check
//     if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardDetails.expDate)) {
//       tempErrors.expDate = "Expiration date must be MM/YY"
//       formIsValid = false
//     }

//     // CVC Validation: Basic check for 3 digits
//     if (cardDetails.cvc.length !== 3) {
//       tempErrors.cvc = "CVC must be 3 digits"
//       formIsValid = false
//     }

//     setErrors(tempErrors)
//     return formIsValid
//   }

//   const handleChange = (e: any) => {
//     const { name, value } = e.target as {
//       name: keyof CardFormState
//       value: string // Assuming all inputs are expected to be string types for simplicity.
//     }

//     if (name === "expDate") {
      
//       // Automatically add a slash for expiration date inputs.
//       let formattedValue = value
//         .replace(
//           /[^0-9]/g,
//           "" // Remove non-numeric characters.
//         )
//         .substring(0, 4) // Limit length to 4 characters (MMYY).

//       // Insert slash after the first two digits (MM) if more digits are typed.
//       if (formattedValue.length > 2) {
//         formattedValue = `${formattedValue.substring(
//           0,
//           2
//         )}/${formattedValue.substring(2)}`
//       }

//       setCardDetails((prev) => ({
//         ...prev,
//         [name]: formattedValue, // Update specifically the expDate field.
//       }))
//     } 
//     else if(name === "cardNumber"){
//       // Limiting card number input to 16 digits and inserting hyphen after every 4 digits
//       const formattedCardNumber = value.replace(/[^0-9]/g, "").replace(/(\d{4})(?=\d)/g, "$1-").substring(0, 19);
//       setCardDetails((prev) => ({
//         ...prev,
//         [name]: formattedCardNumber,
//       }))
//     }
//     else if (name === "cvc") {
//       // Limiting CVC input to 3 digits
//       const formattedCVC = value.replace(/[^0-9]/g, "").substring(0, 3)
//       setCardDetails((prev) => ({
//         ...prev,
//         [name]: formattedCVC,
//       }))
//     } else {
//       // Handle other inputs normally.
//       setCardDetails((prev) => ({
//         ...prev,
//         [name]: value,
//       }))
//     }
//   }

//   let itemsArray = items.map((item: Item) => {
//     return {
//       code: item.id,
//       name: item.title,
//       unit_price: item.total / 100,
//       type: "I",
//       units_number: item.quantity,
//       unit_type: 1,
//       price_type: "G",
//       currency_code: "ILS",
//     }
//   })
//   itemsArray.push({
//     code: "shipping",
//     name: "shipping",
//     unit_price: shippingTotal ?? 0 / 100,
//     type: "I",
//     units_number: 1,
//     unit_type: 1,
//     price_type: "G",
//     currency_code: "ILS",
//   })
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (validate()) {
//       setIsLoading(true)
//       setTransactionMessage(null) // Clear previous messages
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/tranzilla`,
//           {
//             method: "POST",
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               terminal_name: "artifex",
//               txn_currency_code: "ILS",
//               txn_type: "debit",
//               verify_mode: 5,
//               reference_txn_id: null,
//               authorization_number: null,
//               card_number: cardDetails.cardNumber,
//               expire_month: parseInt(cardDetails.expDate.split("/")[0], 10),
//               expire_year: parseInt(cardDetails.expDate.split("/")[1], 10),
//               payment_plan: cardDetails.payments,
//               cvv: cardDetails.cvc,
//               items: itemsArray,
//             }),
//           }
//         )

//         if (!response.ok) {
//           setIsProcessingError(true)
//           throw new Error(`HTTP error! status: ${response.status}`)
//         }

//         const { data } = await response.json()

//         if (Number(data.error_code) === 0) {
//           setTransactionMessage("Payment successful!")
//           onTransactionComplete({ success: true, data })
//         } else {
//           setIsProcessingError(true)
//           setTransactionMessage(`${t("payment-failed")}: ${data.error_message}`)
//           onTransactionComplete({ success: false, data })
//         }
//       } catch (e) {
//         setIsProcessingError(true)
//         setTransactionMessage("An error occurred during the transaction.")
//         console.error(e)
//         onTransactionComplete({ success: false, data: e })
//       }
//     } else {
//       console.log("Form is invalid")
//     }
//     setIsLoading(false)
//   }

//   return (
//     <Container style={{ margin: 0 }} className="dark:text-white">
//       <Typography variant="h6" gutterBottom>
//       {t("credit-card-details")}
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <Input
//               required
//               label={t("card-number")}
//               name="cardNumber"
//               value={cardDetails.cardNumber}
//               onChange={handleChange}
//               errors={errors.cardNumber ? { cardNumber: errors.cardNumber } : {}}
//               touched={{ cardNumber: true }}
//               // topLabel={t("enter-the-16-digit-card-number")}
//             />
//             {errors.cardNumber && <FormHelperText error>{errors.cardNumber}</FormHelperText>}
//           </Grid>
//           <Grid item xs={12}>
//             <Input
//               required
//               label={t("card-name")}
//               name="cardName"
//               value={cardDetails.cardName}
//               onChange={handleChange}
//               errors={errors.cardName ? { cardName: errors.cardName } : {}}
//               touched={{ cardName: true }}
//               // topLabel={t("enter-the-name-on-the-card")}
//               type="text"
//             />
//             {errors.cardName && <FormHelperText error>{errors.cardName}</FormHelperText>}
//           </Grid>
//           <Grid item xs={6}>
//             <Input
//               required
//               label={`${t("expiration-date")}`}
//               name="expDate"
//               value={cardDetails.expDate}
//               onChange={handleChange}
//               errors={errors.expDate ? { expDate: errors.expDate } : {}}
//               touched={{ expDate: true }}
//               // topLabel={`${t("enter-expiration-date-as")} MM/YY`}
//             />
//             {errors.expDate && <FormHelperText error>{errors.expDate}</FormHelperText>}
//           </Grid>
//           <Grid item xs={6}>
//             <Input
//               required
//               label={t("cvc")}
//               name="cvc"
//               value={cardDetails.cvc}
//               onChange={handleChange}
//               errors={errors.cvc ? { cvc: errors.cvc } : {}}
//               touched={{ cvc: true }}
//               // topLabel={`${t("enter-the-3-digit-CVC")}`}
//             />
//             {errors.cvc && <FormHelperText error>{errors.cvc}</FormHelperText>}
//           </Grid>
//           <Grid item xs={12}>
//                  <Grid item xs={12}>
//             <NativeSelect
//               name="payments"
//               placeholder={t("select-number-of-payments")}
//               value={String(cardDetails.payments)}
//               onChange={handleChange}
//               errors={errors}
//               touched={{ payments: true }}
//               isArrows={false}
//             >
//               {[1, 2, 3, 4, 5, 6].map((option) => (
//                 <option className="dark:text-black" key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </NativeSelect>
//             {errors.payments && <FormHelperText error>{errors.payments}</FormHelperText>}
//           </Grid>
//           </Grid>
//           <Grid item xs={12}>
//             <Button type="submit" variant="primary" className="w-full h-9">
//               {isLoading ? <CustomSpinner /> : t("pay-now")}
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//       {transactionMessage && (
//         <Typography
//           variant="body1"
//           className={`text-center flex justify-center items-center h-12 bg-${
//             isProcessingError ? "red" : "green"
//           }-200`}
//           color={isProcessingError ? "error" : "textPrimary"}
//           style={{ marginTop: "16px", borderRadius: "6px" }}
//         >
//           <span className="flex gap-1 font-semibold items-center">
//             {isProcessingError ? (
//               <XCircleSolid color="red" />
//             ) : (
//               <CheckCircleSolid color="green" />
//             )}
//             {transactionMessage}
//           </span>
//         </Typography>
//       )}
//     </Container>
//   )
// }

// export default CreditCardForm



import React, { useState } from "react"
import {
  Grid,
  Typography,
  Container,
  FormHelperText,
} from "@mui/material"
import { Button } from "@medusajs/ui"
import CustomSpinner from "@modules/common/icons/custom-spinner"
import { useTranslation } from "react-i18next"
import Input from "@modules/common/components/input"
import NativeSelect from "@modules/common/components/native-select"
import { CheckCircleSolid, XCircleSolid } from "@medusajs/icons"
import { Cart } from "@medusajs/medusa"
import { formatAmount } from "@lib/util/prices"
import {Item, CardFormState , TaxLine, Variant , Product, ShippingProfile, CreditCardFormProps} from "../../checkout-types"


const CreditCardForm: React.FC<CreditCardFormProps> = ({
  items,
  shippingTotal,
  onTransactionComplete,
  cart
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
  const { t } = useTranslation()

  const validate = () => {
    let tempErrors: Partial<CardFormState> = {}
    let formIsValid = true

    // Card Number Validation: Basic check for length
    if (cardDetails.cardNumber.replace(/\D/g, "").length !== 16) {
      tempErrors.cardNumber = "Card number is invalid"
      formIsValid = false
    }

    // Card Name Validation: Basic check for non-empty
    if (!cardDetails.cardName || /\d/.test(cardDetails.cardName)) {
      tempErrors.cardName = "Cardholder name is required and can't contain numbers"
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
    } 
    else if(name === "cardNumber"){
      // Limiting card number input to 16 digits and inserting hyphen after every 4 digits
      const formattedCardNumber = value.replace(/[^0-9]/g, "").replace(/(\d{4})(?=\d)/g, "$1-").substring(0, 19);
      setCardDetails((prev) => ({
        ...prev,
        [name]: formattedCardNumber,
      }))
    }
    else if (name === "cvc") {
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

  const numberOfItems = items.reduce((total : number, item : Item) => total + item.quantity, 0)
  let itemsArray = items.map((item: Item) => {
    return {
      code: item.id,
      name: item.title,
      // unit_price: (((cart?.total ?? 0) - (shippingTotal * 100 ?? 0)) / numberOfItems) / 100,
      unit_price: (item.total  - ((cart?.gift_card_total ?? 0) / numberOfItems)) / 100,
      units_number: item.quantity,
      unit_type: 1,
      price_type: "G",
      currency_code: "ILS",
    }
  })

  itemsArray.push({
    code: "shipping",
    name: "shipping",
    unit_price: (shippingTotal || 0) ,
    type: "I",
    units_number: 1,
    unit_type: 1,
    price_type: "G",
    currency_code: "ILS",
  })

  
  const calculateTotalAmount = () => {
    const totalItemAmount = itemsArray.reduce((total : number, item: Item) => total + item.unit_price * item.units_number, 0);
    return (totalItemAmount) ;
  };
 
  const totalAmount = calculateTotalAmount();
  const getAmount = (amount: number | null | undefined, cart: any | null) => {
    return formatAmount({
      amount: (amount ?? 0) * 100 ,
      region: cart.region,
      includeTaxes: false,
    })
  }

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
          setTransactionMessage(`${t("payment-failed")}: ${data.error_message}`)
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

  return (
    <Container style={{ margin: 0 }} className="dark:text-white">
      <Typography variant="h6" gutterBottom>
        {t("credit-card-details")}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Input
              required
              label={t("card-number")}
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleChange}
              errors={errors.cardNumber ? { cardNumber: errors.cardNumber } : {}}
              touched={{ cardNumber: true }}
              // topLabel={t("enter-the-16-digit-card-number")}
            />
            {errors.cardNumber && <FormHelperText error>{errors.cardNumber}</FormHelperText>}
          </Grid>
          <Grid item xs={12}>
            <Input
              required
              label={t("card-name")}
              name="cardName"
              value={cardDetails.cardName}
              onChange={handleChange}
              errors={errors.cardName ? { cardName: errors.cardName } : {}}
              touched={{ cardName: true }}
              // topLabel={t("enter-the-name-on-the-card")}
              type="text"
            />
            {errors.cardName && <FormHelperText error>{errors.cardName}</FormHelperText>}
          </Grid>
          <Grid item xs={6}>
            <Input
              required
              label={`${t("expiration-date")}`}
              name="expDate"
              value={cardDetails.expDate}
              onChange={handleChange}
              errors={errors.expDate ? { expDate: errors.expDate } : {}}
              touched={{ expDate: true }}
              // topLabel={`${t("enter-expiration-date-as")} MM/YY`}
            />
            {errors.expDate && <FormHelperText error>{errors.expDate}</FormHelperText>}
          </Grid>
          <Grid item xs={6}>
            <Input
              required
              label={t("cvc")}
              name="cvc"
              value={cardDetails.cvc}
              onChange={handleChange}
              errors={errors.cvc ? { cvc: errors.cvc } : {}}
              touched={{ cvc: true }}
              // topLabel={`${t("enter-the-3-digit-CVC")}`}
            />
            {errors.cvc && <FormHelperText error>{errors.cvc}</FormHelperText>}
          </Grid>
          <Grid item xs={12}>
            <NativeSelect
              name="payments"
              placeholder={t("select-number-of-payments")}
              value={String(cardDetails.payments)}
              onChange={handleChange}
              errors={errors}
              touched={{ payments: true }}
              isArrows={false}
            >
              {[1, 2, 3, 4, 5, 6].map((option) => (
                <option className="dark:text-black" key={option} value={option}>
                  {option}
                </option>
              ))}
            </NativeSelect>
            {errors.payments && <FormHelperText error>{errors.payments}</FormHelperText>}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="primary" className="w-full h-9">
              {isLoading ? <CustomSpinner /> : t("pay-now")}
            </Button>
          </Grid>
        </Grid>
      </form>
      <div className="total-amount flex justify-center mt-2">
        <Typography variant="h6" gutterBottom>
          {t("total-amount")}: {getAmount(totalAmount, cart)}
        </Typography>
      </div>
      {transactionMessage && (
        <Typography
          variant="body1"
          className={`text-center flex justify-center items-center h-12 bg-${
            isProcessingError ? "red" : "green"
          }-200`}
          color={isProcessingError ? "error" : "textPrimary"}
          style={{ marginTop: "16px", borderRadius: "6px" }}
        >
          <span className="flex gap-1 font-semibold items-center">
            {isProcessingError ? (
              <XCircleSolid color="red" />
            ) : (
              <CheckCircleSolid color="green" />
            )}
            {transactionMessage}
          </span>
        </Typography>
      )}
    </Container>
  )
}

export default CreditCardForm;
