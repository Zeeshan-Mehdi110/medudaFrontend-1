import { 
    PayPalButtons, 
    PayPalScriptProvider,
  } from "@paypal/react-paypal-js"
  import { useEffect, useState } from "react"
  
  import Medusa from "@medusajs/medusa-js"
  import { medusaClient } from "@lib/config"
import { Order } from "@medusajs/medusa"
  function Paypal(cartObj: any) {
    const {cart} = cartObj
    const [errorMessage, setErrorMessage] = useState("")
    const [processing, setProcessing] = useState(false)

    const handlePayment = async (data: any, actions: any): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        actions.order.authorize().then(async (authorization: any) => {
          if (authorization.status !== "COMPLETED") {
            setErrorMessage(
              `An error occurred, status: ${authorization.status}`
            );
            setProcessing(false);
            reject();
            return;
          }
    
          const response = await medusaClient.carts.setPaymentSession(cart.id, {
            provider_id: "paypal",
          });
    
          if (!response.cart) {
            setProcessing(false);
            reject();
            return;
          }
    
          await medusaClient.carts.updatePaymentSession(cart.id, "paypal", {
            data: {
              data: {
                ...authorization,
              },
            },
          });
    
          const { type } = await medusaClient.carts.complete(cart.id);
    
          if (!type || type !== "order") {
            setProcessing(false);
            reject();
            return;
          }
    
          // order successful
          alert("success");
          resolve();
        });
      });
    };
    // const handlePayment = (data: any, actions: any) => {
    //   actions.order.authorize().then(async (authorization: any) => {
    //     if (authorization.status !== "COMPLETED") {
    //       setErrorMessage(
    //         `An error occurred, status: ${authorization.status}`
    //       )
    //       setProcessing(false)
    //       return
    //     }
  
    //     const response = await medusaClient
    //       .carts
    //       .setPaymentSession(cart.id, {
    //         "provider_id": "paypal",
    //       })
  
    //     if (!response.cart) {
    //       setProcessing(false)
    //       return
    //     }
  
    //     await medusaClient
    //       .carts
    //       .updatePaymentSession(cart.id, "paypal", {
    //       data: {
    //         data: {
    //           ...authorization,
    //         },
    //       },
    //     })
  
    //     const { data } = await medusaClient.carts.complete(cart.id)
  
    //     if (!data || data.object !== "order") {
    //       setProcessing(false)
    //       return
    //     }
        
    //     // order successful
    //     alert("success")
    //   })
    // }
  
    return (
      <div style={{ marginTop: "10px", marginLeft: "10px" }}>
        {cart !== undefined && (
          <PayPalScriptProvider options={{ 
            "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
            "currency": "ILS",
            "intent": "authorize",
          }}>
              {errorMessage && (
                <span className="text-rose-500 mt-4">
                  {errorMessage}
                </span>
              )}
              <PayPalButtons 
                style={{ layout: "horizontal" }}
                createOrder={async () =>
                cart.payment_session.data.id as string}
                onApprove={handlePayment}
                disabled={processing}
              />
          </PayPalScriptProvider>
        )}
      </div>
    )
  }
  
  export default Paypal