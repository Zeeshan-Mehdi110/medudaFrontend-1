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

"use client"


import { Medusa } from "@medusajs/icons"
import { motion } from "framer-motion"
import { createContext, useContext, useState, useEffect } from "react"
import { getCustomer } from "@lib/data"

// export const customerContext = createContext(null)

export const customerContext = createContext({
  customer: null,
  updateCustomer: async () => {},
})

export default function Template({ children }: { children: React.ReactNode }) {
  // const [customer, setCustomer] = useState<any>(null)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const customerRetrieved = await getCustomer().catch(() => null)
  //     if (customerRetrieved) {
  //       // console.log("customer", customerRetrieved)
  //       setCustomer(customerRetrieved)
  //       return;
  //     }
  //   }

  //   fetchData()
  //   return
  // }, [customer?.metadata?.wishlist])

  const [customer, setCustomer] = useState<any>(null)

  const fetchCustomer = async () => {
    const customerRetrieved = await getCustomer().catch(() => null)
    if (customerRetrieved) {
      setCustomer(customerRetrieved)
    }
  }

  useEffect(() => {
    fetchCustomer()
  }, [])


  return (
    <customerContext.Provider value={{ customer, updateCustomer: fetchCustomer }}>
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


