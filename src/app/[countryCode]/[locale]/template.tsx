// "use client";

// import {motion} from "framer-motion";

// export default function Template({children} : {children: React.ReactNode}) {
//   return (
//     <motion.div
//       initial={{y:15, opacity: 0 }}
//       animate={{y:0, opacity: 1 }}
//       transition={{ease:'easeInOut', duration: 0.8}}
//     >
//      {children}
//     </motion.div>
//   );
// }

// "use client"


// import { Medusa } from "@medusajs/icons"
// import { motion } from "framer-motion"
// import { createContext, useContext, useState, useEffect } from "react"
// import { getCustomer } from "@lib/data"

// export const customerContext = createContext(null)

// export default function Template({ children }: { children: React.ReactNode }) {
//   const [customer, setCustomer] = useState<any>(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       const customerRetrieved = await getCustomer().catch(() => null)
//       if (customerRetrieved) {
//         // console.log("customer", customerRetrieved)
//         setCustomer(customerRetrieved)
//         return;
//       }
//     }

//     fetchData()
//     return
//   }, [])

//   return (
//     <customerContext.Provider value={customer}>
//       <motion.div
//         initial={{ y: 15, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ ease: "easeInOut", duration: 0.8 }}
//       >
//         {children}
//       </motion.div>
//     </customerContext.Provider>
//   )
// }




"use client"

import { Medusa } from "@medusajs/icons"
import { motion } from "framer-motion"
import { createContext, useContext, useState, useEffect } from "react"
import { getCustomer } from "@lib/data"

export const customerContext = createContext(null)

export default function Template({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<any>(null)

  // Initial fetch to get customer data
  useEffect(() => {
    const fetchData = async () => {
      const customerRetrieved = await getCustomer().catch(() => null)
      if (customerRetrieved) {
        console.log("customerRetrieved", customerRetrieved)
        setCustomer(customerRetrieved)
      }
    }

    fetchData()
  }, [])

  // Event listener for wishlist changes
  useEffect(() => {
    const handleWishlistChange = (event: CustomEvent<{ product: any; action: string }>) => {
      const { product, action } = event.detail
      console.log("product", product, "action", action)
      
      // Fetch and update customer when wishlist changes
      const fetchUpdatedCustomer = async () => {
        const customerRetrieved = await getCustomer().catch(() => null)
        if (customerRetrieved) {
          setCustomer(customerRetrieved)
        }
      }

      fetchUpdatedCustomer()
    }

    document.addEventListener('wishlistChange', handleWishlistChange as EventListener)

    return () => {
      document.removeEventListener('wishlistChange', handleWishlistChange as EventListener)
    }
  }, [])

  return (
    <customerContext.Provider value={customer}>
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.8 }}
      >
        {children}
      </motion.div>
    </customerContext.Provider>
  )
}