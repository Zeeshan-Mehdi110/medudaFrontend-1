// "use client"

// import { useCallback, useEffect, useMemo, useState, useRef } from "react"
// import { usePathname, useRouter, useSearchParams } from "next/navigation"
// import { RadioGroup } from "@headlessui/react"
// import ErrorMessage from "@modules/checkout/components/error-message"
// import { Cart } from "@medusajs/medusa"
// import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
// import { Button, Container, Heading, Text, Tooltip, clx } from "@medusajs/ui"
// import { CardElement } from "@stripe/react-stripe-js"
// import { StripeCardElementOptions } from "@stripe/stripe-js"
// import Divider from "@modules/common/components/divider"
// import Spinner from "@modules/common/icons/spinner"
// import PaymentContainer from "@modules/checkout/components/payment-container"
// import { setPaymentMethod } from "@modules/checkout/actions"
// import { paymentInfoMap } from "@lib/constants"
// import headers from '../../../../lib/util/getTranzillaTokenHeaders';

// const Payment = ({
//   cart,
// }: {
//   cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
// }) => {
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [cardBrand, setCardBrand] = useState<string | null>(null)
//   const [cardComplete, setCardComplete] = useState(false)

//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const pathname = usePathname()
//   const buttonRef = useRef(null)
//   const isOpen = searchParams.get("step") === "payment"

//   const isStripe = cart?.payment_session?.provider_id === "stripe"

//   const paymentReady =
//     cart?.payment_session && cart?.shipping_methods.length !== 0

//   const useOptions: StripeCardElementOptions = useMemo(() => {
//     return {
//       style: {
//         base: {
//           fontFamily: "Inter, sans-serif",
//           color: "#424270",
//           "::placeholder": {
//             color: "rgb(107 114 128)",
//           },
//         },
//       },
//       classes: {
//         base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
//       },
//     }
//   }, [])

//   const createQueryString = useCallback(
//     (name: string, value: string) => {
//       const params = new URLSearchParams(searchParams)
//       params.set(name, value)

//       return params.toString()
//     },
//     [searchParams]
//   )

//   const set = async (providerId: string) => {
//     setIsLoading(true)
//     await setPaymentMethod(providerId)
//       .catch((err) => setError(err.toString()))
//       .finally(() => {
//         if (providerId === "paypal") return
//         setIsLoading(false)
//       })
//   }

//   const handleChange = (providerId: string) => {
//     setError(null)
//     set(providerId)
//   }

//   const handleEdit = () => {
//     router.push(pathname + "?" + createQueryString("step", "payment"), {
//       scroll: false,
//     })
//   }


//   const handleSubmit = () => {
//     setIsLoading(true)
//     router.push(pathname + "?" + createQueryString("step", "review"), {
//       scroll: false,
//     })
//   }
  
//   useEffect(() => {
//     setIsLoading(false)
//     setError(null)
//   }, [isOpen])


 

//   const [amount, setAmount] = useState((Number(cart?.total) / 100).toFixed(2)) 
// const [isChecked, setIsChecked] = useState(false)




// const [cardData, setCardData] = useState({
//   name: '',
//   number: '',
//   expiration: '',
//   cvv: '',
// });

// const handleChange1 = (event: any) => {
//   setCardData({ ...cardData, [event.target.name]: event.target.value });
// };




//   const handleSubmit1 = async (e:any) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
    
//     try {
      
    
//       const response = await fetch("https://api.tranzila.com/v1/transaction/credit_card/create"
//       , {
//         method: 'POST',
//         headers: headers,
//         mode:'cors',
//         redirect:'follow',
//         body: JSON.stringify({
        
           
//             "terminal_name": "artifex",
//             "txn_currency_code": "ILS",
//             "txn_type": "debit",
//             "card_number" : "12312312",
//             "expire_month" : 3,
//             "expire_year": 24,
//             "payment_plan": 1,
//             "items": [
//             {
//             "code": "1",
//             "name": "",
//             "unit_price": 1,
//             "type": "I",
//             "units_number": 1,
//             "unit_type": 1,
//             "price_type": "G",
//             "currency_code": "ILS"
//             }
//             ]
           
          
//         }),
//       });

//       if (!response.ok) {
//         console.log(response)
//         throw new Error('Payment failed');
    
//       }
     
//       // Handle successful payment response
//       console.log('Payment successful:', await response.json());
//     } catch (error) {
//       console.log(error)
//       setError('Payment failed: Please check your details and try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white dark:text-white dark:bg-black">
//       <div className="flex flex-row items-center justify-between mb-6">
//         <Heading
//           level="h2"
//           className={clx(
//             "flex flex-row text-3xl-regular gap-x-2 items-baseline",
//             {
//               "opacity-50 pointer-events-none select-none":
//                 !isOpen && !paymentReady,
//             }
//           )}
//         >
//           Payment
//           {!isOpen && paymentReady && <CheckCircleSolid />}
//         </Heading>
//         {!isOpen && paymentReady && (
//           <Text>
//             <button
//               onClick={handleEdit}
//               className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
//             >
//               Edit
//             </button>
//           </Text>
//         )}
//       </div>
//       <div>
//         {cart?.payment_sessions?.length ? (
//           // <div className={isOpen ? "block" : "hidden"}>
//           //   <main className="min-h750">
//           //     <div className="container">
//           //       <section id="main-content">
//           //         <div className="row mt-5">
//           //           <div className="col-md-6">
//           //             <form
//           //               action="https://direct.tranzila.com/artifex/iframenew.php"
//           //               target="tranzila"
//           //               method="POST"
//           //               noValidate={true}
//           //               autoComplete="off"
                        
//           //             >
//           //               <input type="hidden" name="buttonLabel" value="Pay" />
//           //               <input
//           //                 name="sum"
//           //                 value={amount}
//           //                 type="number"
//           //                 style={{ width: "1px", height: "1px" }}
//           //                 id="sum"
//           //                 className="form-control"
//           //                 readOnly
//           //               />
//           //               <input type="hidden" name="bit_pay" value="1" />
//           //               <input type="hidden" name="maxpay" value="6" />
//           //               <input type="hidden" name="cred_type" value="8" />
//           //               {/* <input type="hidden" name="notify_url_address" value={"http://localhost:8000/api/tranzilla"} /> */}
//           //               <input type="hidden" name="currency" value="1" />

//           //               {/* <Button
//           //               ref={buttonRef}
//           //     size="large"
//           //     className="mt-6"
//           //     type="submit" name="submit" value="pay"
//           //     isLoading={isLoading}
//           //     disabled={(isStripe && !cardComplete) || !cart.payment_session}
//           //   >
//           //     Pay with Credit Card
//           //   </Button> */}

//           //               <Button
//           //               style={{ width: "1px", height: "1px",opacity:0 }}
//           //                 ref={buttonRef}
//           //                 type="submit"
//           //                 name="submit"
//           //                 value="pay"
//           //                 isLoading={isLoading}
//           //                 disabled={
//           //                   (isStripe && !cardComplete) || !cart.payment_session
//           //                 }
//           //               >
//           //                 Pay with Credit Card
//           //               </Button>
//           //               <input
//           //                 type="checkbox"
//           //                 name="paymentOption"
//           //                 value="creditCard"
//           //                 disabled={
//           //                   (isStripe && !cardComplete) || !cart.payment_session
//           //                 }
//           //                 onChange={(e) => {
//           //                   if (e.target.checked) {
//           //                     buttonRef.current.click();
//           //                     setIsChecked(true)
//           //                   }
//           //                   else{
//           //                     setIsChecked(false);
//           //                   }
//           //                 }}
//           //               />
//           //               <label htmlFor="paymentOption">
//           //                 Pay with Credit Card
//           //               </label>
//           //             </form>
//           //           </div>
//           //         </div>
//           //         <div className="row mt-5">
//           //           <div className="col-md-6">
//           //             <div
//           //               className=""
//           //               style={{ width: isChecked?  "800px" : '0px', height: isChecked?  "800px": '0px' }}
//           //             >
//           //               <iframe
//           //                 id="tranzila-frame"
//           //                 allowpaymentrequest="true"
//           //                 name="tranzila"
//           //                 src=""
//           //                 style={{ width: "100%", height: "100%" }}
//           //               ></iframe>
//           //             </div>
//           //           </div>
//           //         </div>
//           //       </section>
//           //     </div>
//           //   </main>
//           //   {isStripe && (
//           //     <div className="mt-5 transition-all duration-150 ease-in-out">
//           //       <Text className="txt-medium-plus text-ui-fg-base mb-1">
//           //         Enter your card details:
//           //       </Text>

//           //       <CardElement
//           //         options={useOptions as StripeCardElementOptions}
//           //         onChange={(e) => {
//           //           setCardBrand(
//           //             e.brand &&
//           //               e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
//           //           )
//           //           setError(e.error?.message || null)
//           //           setCardComplete(e.complete)
//           //         }}
//           //       />
//           //     </div>
//           //   )}

//           //   <ErrorMessage error={error} />

//           //   <Button
//           //     size="large"
//           //     className="mt-6"
//           //     onClick={handleSubmit}
//           //     isLoading={isLoading}
//           //     disabled={(isStripe && !cardComplete) || !cart.payment_session}
//           //   >
//           //     Continue to review
//           //   </Button>
//           // </div>




//           <form onSubmit={handleSubmit1}>
//           <fieldset>
//             <legend>Credit Card Information</legend>
//             <div>
//               <label htmlFor="name">Name on Card:</label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={cardData.name}
//                 onChange={handleChange1}
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="number">Card Number:</label>
//               <input
//                 type="text"
//                 id="number"
//                 name="number"
//                 value={cardData.number}
//                 onChange={handleChange1}
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="expiration">Expiration Date (MM/YY):</label>
//               <input
//                 type="text"
//                 id="expiration"
//                 name="expiration"
//                 value={cardData.expiration}
//                 onChange={handleChange1}
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="cvv">CVV:</label>
//               <input
//                 type="text"
//                 id="cvv"
//                 name="cvv"
//                 value={cardData.cvv}
//                 onChange={handleChange1}
//                 required
//               />
//             </div>
//             <button type="submit">Submit Payment</button>
//           </fieldset>
//         </form>



//         ) : (
//           <div className="flex flex-col items-center justify-center px-4 py-16 text-ui-fg-base">
//             <Spinner />
//           </div>
//         )}

//         <div className={isOpen ? "hidden" : "block"}>
//           {cart && paymentReady && cart.payment_session && (
//             <div className="flex items-start gap-x-1 w-full">
//               <div className="flex flex-col w-1/3">
//                 <Text className="txt-medium-plus text-ui-fg-base mb-1">
//                   Payment method
//                 </Text>
//                 <Text className="txt-medium text-ui-fg-subtle">
//                   {paymentInfoMap[cart.payment_session.provider_id]?.title ||
//                     cart.payment_session.provider_id}
//                 </Text>
//                 {process.env.NODE_ENV === "development" &&
//                   !Object.hasOwn(
//                     paymentInfoMap,
//                     cart.payment_session.provider_id
//                   ) && (
//                     <Tooltip content="You can add a user-friendly name and icon for this payment provider in 'src/modules/checkout/components/payment/index.tsx'" />
//                   )}
//               </div>
//               <div className="flex flex-col w-1/3">
//                 <Text className="txt-medium-plus text-ui-fg-base mb-1">
//                   Payment details
//                 </Text>
//                 <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
//                   <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
//                     {paymentInfoMap[cart.payment_session.provider_id]?.icon || (
//                       <CreditCard />
//                     )}
//                   </Container>
//                   <Text>
//                     {cart.payment_session.provider_id === "stripe" && cardBrand
//                       ? cardBrand
//                       : "Another step will appear"}
//                   </Text>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <Divider className="mt-8" />
//     </div>
//   )
// }

// export default Payment

"use client"

import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { RadioGroup } from "@headlessui/react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { Cart } from "@medusajs/medusa"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, Tooltip, clx } from "@medusajs/ui"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"

import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import PaymentContainer from "@modules/checkout/components/payment-container"
import { setPaymentMethod } from "@modules/checkout/actions"
import { paymentInfoMap } from "@lib/constants"
import { StripeContext } from "@modules/checkout/components/payment-wrapper"
import Form from "../credit-card-form"
import { medusaClient } from "@lib/config"
import Paypal from "../paypal"
const Payment = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [isPaidSuccessfully, setIsPaidSuccessfully] = useState(cart?.payment_authorized_at !== null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [providerId, setProviderId] = useState<string | null>(null)
  const isOpen = searchParams.get("step") === "payment" && !isPaidSuccessfully

  const isStripe = cart?.payment_session?.provider_id === "stripe"
  const stripeReady = useContext(StripeContext)

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (cart?.payment_session && cart?.shipping_methods.length !== 0) ||
    paidByGiftcard

    console.log(cart)
    console.log(paymentReady)
    
  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  // const set = async (providerId: string) => {
  //   setIsLoading(true)
  //   await setPaymentMethod(providerId)
  //     .catch((err) => setError(err.toString()))
  //     .finally(() => {
  //       if (providerId === "paypal") return
  //       setIsLoading(false)
  //     })
  // }

  // const handleChange = (providerId: string) => {
  //   setError(null)
  //   console.log(providerId)
  //   set(providerId)
  // }

  useEffect(() => {
    const setPayment = async () => {
      if (providerId) {
        setIsLoading(true)
        await setPaymentMethod(providerId)
          .catch((err) => setError(err.toString()))
          .finally(() => {
            if (providerId !== "paypal") {
             setIsLoading(false)
             return;
            }
            setIsLoading(false)
          })
      }
    }

    setPayment()
  }, [providerId])

  const handleChange = (providerId: string) => {
    setError(null)
    setProviderId(providerId)
  }

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = () => {
    setIsLoading(true)
    router.push(pathname + "?" + createQueryString("step", "review"), {
      scroll: false,
    })
  }

  useEffect(() => {
    setIsLoading(false)
    setError(null)
   
  }, [isOpen])

  useEffect(() => {
    if(isPaidSuccessfully){
      handleSubmit();
    }
  }, [isPaidSuccessfully])


  const handleTransactionComplete = (result: { success: boolean; data?: any }) => {
    if (result.success) {
      console.log('Transaction was successful!', result.data);
      medusaClient.carts.complete((cart && cart.id) ? cart.id :  "")
      .then((cart) => {
        setIsPaidSuccessfully(true)
      })
    } else {
      console.log('Transaction failed!', result.data);
      // Handle failure (e.g., display error message, log details, etc.)
    }
  };


  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={ isOpen ? "block" : "hidden"}>
          { !paidByGiftcard && cart?.payment_sessions?.length ? (
            <>
              <RadioGroup
                value={cart.payment_session?.provider_id || ""}
                onChange={(value: string) => handleChange(value)}
              >
                {cart.payment_sessions
                  .sort((a, b) => {
                    return a.provider_id > b.provider_id ? 1 : -1
                  })
                  .map((paymentSession) => {
                    return (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentSession={paymentSession}
                        key={paymentSession.id}
                        selectedPaymentOptionId={
                          cart.payment_session?.provider_id || null
                        }
                      />
                    )
                  })}
              </RadioGroup>
              {isStripe && stripeReady && (
                <div className="mt-5 transition-all duration-150 ease-in-out">
                  <Text className="txt-medium-plus text-ui-fg-base mb-1">
                    Enter your card details:
                  </Text>

                  <CardElement
                    options={useOptions as StripeCardElementOptions}
                    onChange={(e) => {
                      setCardBrand(
                        e.brand &&
                          e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                      )
                      setError(e.error?.message || null)
                      setCardComplete(e.complete)
                    }}
                  />
                </div>
              )}
               {cart.payment_session?.provider_id === "manual" &&(
                <div className="mt-5 transition-all duration-150 ease-in-out">
                <Form onTransactionComplete={handleTransactionComplete} items={cart.items} shippingTotal={(((cart.shipping_total ?? 0) + (cart.shipping_tax_total ?? 0)) / 100) ?? 0} />
                </div>
              )}
                  {cart.payment_session?.provider_id === "paypal" &&(
                <div className="mt-5 transition-all duration-150 ease-in-out">
                <Paypal cart={cart}/>
                </div>
              )}
            </>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) 
          :  (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-ui-fg-base">
              <Spinner />
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripe && !cardComplete) ||
              (!cart?.payment_session && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            Continue to review
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && cart.payment_session ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[cart.payment_session.provider_id]?.title ||
                    cart.payment_session.provider_id}
                </Text>
                {process.env.NODE_ENV === "development" &&
                  !Object.hasOwn(
                    paymentInfoMap,
                    cart.payment_session.provider_id
                  ) && (
                    <Tooltip content="You can add a user-friendly name and icon for this payment provider in 'src/modules/checkout/components/payment/index.tsx'" />
                  )}
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[cart.payment_session.provider_id]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {cart.payment_session.provider_id === "stripe" && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment