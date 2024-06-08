// "use client"

// import { Region } from "@medusajs/medusa"
// import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
// import { Button } from "@medusajs/ui"
// import { isEqual } from "lodash"
// import { useParams } from "next/navigation"
// import { useEffect, useMemo, useRef, useState } from "react"

// import { useIntersection } from "@lib/hooks/use-in-view"
// import { addToCart } from "@modules/cart/actions"
// import Divider from "@modules/common/components/divider"
// import OptionSelect from "@modules/products/components/option-select"

// import MobileActions from "../mobile-actions"
// import ProductPrice from "../product-price"

// type ProductActionsProps = {
//   product: PricedProduct
//   region: Region
// }

// export type PriceType = {
//   calculated_price: string
//   original_price?: string
//   price_type?: "sale" | "default"
//   percentage_diff?: string
// }

// export default function ProductActions({
//   product,
//   region,
// }: ProductActionsProps): JSX.Element {
//   const [options, setOptions] = useState<Record<string, string>>({})
//   const [isAdding, setIsAdding] = useState(false)

//   const countryCode = useParams().countryCode as string

//   const variants = product.variants

//   // initialize the option state
//   useEffect(() => {
//     const optionObj: Record<string, string> = {}

//     for (const option of product.options || []) {
//       Object.assign(optionObj, { [option.id]: undefined })
//     }

//     setOptions(optionObj)
//   }, [product])

//   // memoized record of the product's variants
//   const variantRecord = useMemo(() => {
//     const map: Record<string, Record<string, string>> = {}

//     for (const variant of variants) {
//       if (!variant.options || !variant.id) continue

//       const temp: Record<string, string> = {}

//       for (const option of variant.options) {
//         temp[option.option_id] = option.value
//       }

//       map[variant.id] = temp
//     }

//     return map
//   }, [variants])

//   // memoized function to check if the current options are a valid variant
//   const variant = useMemo(() => {
//     let variantId: string | undefined = undefined

//     for (const key of Object.keys(variantRecord)) {
//       if (isEqual(variantRecord[key], options)) {
//         variantId = key
//       }
//     }

//     return variants.find((v) => v.id === variantId)
//   }, [options, variantRecord, variants])

//   // if product only has one variant, then select it
//   useEffect(() => {
//     if (variants.length === 1 && variants[0].id) {
//       setOptions(variantRecord[variants[0].id])
//     }
//   }, [variants, variantRecord])

//   // update the options when a variant is selected
//   const updateOptions = (update: Record<string, string>) => {
//     setOptions({ ...options, ...update })
//   }

//   // check if the selected variant is in stock
//   const inStock = useMemo(() => {
//     if (variant && !variant.inventory_quantity) {
//       return false
//     }

//     if (variant && variant.allow_backorder === false) {
//       return true
//     }
//   }, [variant])

//   const actionsRef = useRef<HTMLDivElement>(null)

//   const inView = useIntersection(actionsRef, "0px")

//   // add the selected variant to the cart
//   const handleAddToCart = async () => {
//     if (!variant?.id) return
//     setIsAdding(true)
//     await addToCart({
//       variantId: variant.id,
//       quantity: 1,
//       countryCode: countryCode,
//     })
//     setIsAdding(false)
//   }

//   return (
//     <>
//       <div className="flex flex-col gap-y-2" ref={actionsRef}>
//         <div>
//           {product.variants.length > 1 && (
//             <div className="flex flex-col gap-y-4 dark:text-white">
//                  {product.variants.map(function (productVar, index) {
//                 return (
//                   variant?.id === productVar.id && (productVar.length && productVar.width) && <div key={index}>{`${productVar.length ?? 0}cm x ${
//                     productVar.width ?? 0
//                   }cm`}</div>
//                 )
//               })}
//               {(product.options || []).map((option) => {
//                 return (
//                   <div key={option.id}>
//                     <OptionSelect
//                       option={option}
//                       current={options[option.id]}
//                       updateOption={updateOptions}
//                       title={option.title}
//                     />
//                   </div>
//                 )
//               })}
//               <Divider />
//             </div>
//           )}
//         </div>

//         <ProductPrice product={product} variant={variant} region={region} />

//         <Button
//           onClick={handleAddToCart}
//           disabled={!inStock || !variant}
//           variant="primary"
//           className="w-full h-10 dark:text-white"
//           isLoading={isAdding}
//         >
//           {!variant
//             ? "Select variant"
//             : !inStock
//             ? "Out of stock"
//             : "Add to cart"}
//         </Button>
//         <MobileActions
//           product={product}
//           variant={variant}
//           region={region}
//           options={options}
//           updateOptions={updateOptions}
//           inStock={inStock}
//           handleAddToCart={handleAddToCart}
//           isAdding={isAdding}
//           show={!inView}
//         />
//       </div>
//     </>
//   )
// }

"use client"

import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import { addToCart } from "@modules/cart/actions"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/option-select"
import { useTranslation } from "react-i18next"
import MobileActions from "../mobile-actions"
import ProductPrice from "../product-price"

type ProductActionsProps = {
  product: PricedProduct
  region: Region,
  locale: string
}

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}

export default function ProductActions({
  product,
  region,
  locale,
}: ProductActionsProps): JSX.Element {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const { t } = useTranslation()
  const countryCode = useParams().countryCode as string
  const metadata = product.metadata;
  const variants = product.variants
  const titles = variants.map(variant => variant.title);
  const imageToRescale = document.getElementById('scalable-image');
  // initialize the option state
  useEffect(() => {
    const optionObj: Record<string, string> = {}

    for (const option of product.options || []) {
      Object.assign(optionObj, { [option.id]: undefined })
    }
    setOptions(optionObj)
  }, [product])

  // memoized record of the product's variants
  const variantRecord = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}

    for (const variant of variants) {
      if (!variant.options || !variant.id) continue

      const temp: Record<string, string> = {}

      for (const option of variant.options) {
        temp[option.option_id] = option.value
      }

      map[variant.id] = temp
    }

    return map
  }, [variants])

  // memoized function to check if the current options are a valid variant
  const variant = useMemo(() => {
    let variantId: string | undefined = undefined

    for (const key of Object.keys(variantRecord)) {
      if (isEqual(variantRecord[key], options)) {
        variantId = key
      }
    }

    return variants.find((v) => v.id === variantId)
  }, [options, variantRecord, variants])

  // if product only has one variant, then select it
  useEffect(() => {
    if (variants.length === 1 && variants[0].id) {
      setOptions(variantRecord[variants[0].id])
    }
  }, [variants, variantRecord])


  const sizes: Record<string, number> = {
    'S': 35, // base size
    'M': 40,
    'L': 60,
    'XL': 80
  };
  
  // Assuming 'M' is the default and calculating from there
  const defaultWidth = 40; // Default width corresponding to 'M'
  let baseWidthPercentage = 30;

  // update the options when a variant is selected
  const updateOptions = (update: Record<string, string>) => {
    if (imageToRescale) {
      const dataHeightAttribute = imageToRescale.getAttribute('data-width');
      baseWidthPercentage = dataHeightAttribute ? Number(dataHeightAttribute) : baseWidthPercentage;
      const newVal = Object.values(update)[0]; // The new size selected, e.g., 'XL'
      const newWidthCm = sizes[newVal]; // The width in cm for the new size
      const scaleRatio = newWidthCm / defaultWidth; // Direct ratio of new size to 'M'
  
      // Apply a non-linear scale to reduce extremity, you might need to adjust this
      const adjustedScaleRatio = Math.sqrt(scaleRatio); // Using square root for smoother scaling
  
      // Calculate new width percentage based on the adjusted scale
      const newWidthPercentage = baseWidthPercentage * adjustedScaleRatio;
  
      // Ensure the width doesn't exceed a maximum percentage to avoid unrealistic scaling
      const finalWidthPercentage = Math.min(newWidthPercentage, 50); // Adjust max as needed
  
      
      // Here you would apply finalWidthPercentage to your imageToRescale's width
      // This is just a conceptual step, adapt it to how you actually apply styles in your code
      imageToRescale.style.width = `${finalWidthPercentage}%`;
      imageToRescale.style.left = `${(50 - (finalWidthPercentage / 2))}%`;
      imageToRescale.style.height = `${finalWidthPercentage * 1.2}%`
    }
  
    setOptions({ ...options, ...update })
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (variant && !variant.inventory_quantity) {
      return false
    }

    if (variant && variant.allow_backorder === false) {
      return true
    }
  }, [variant])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variant?.id) return
    setIsAdding(true)
    await addToCart({
      variantId: variant.id,
      quantity: 1,
      countryCode: countryCode,
      metadata : metadata
    })
    setIsAdding(false)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {product.variants.length > 1 && (
            <div className="flex flex-col gap-y-4 dark:text-white">
                 {product.variants.map(function (productVar, index) {
                return (
                  variant?.id === productVar.id && (productVar.length && productVar.width) && <div key={index}>{`${productVar.length ?? 0}cm x ${
                    productVar.width ?? 0
                  }cm`}</div>
                )
              })}
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title}
                      locale={locale}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={variant} region={region} />

        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !variant}
          variant="primary"
          className="w-full h-10 dark:text-white"
          isLoading={isAdding}
        >
          {!variant
            ? t("select-variant")
            : !inStock
            ? t("out-of-stock")
            : t("add-to-cart")}
        </Button>
        <MobileActions
          product={product}
          variant={variant}
          region={region}
          options={options}
          updateOptions={updateOptions}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          locale={locale}
        />
      </div>
    </>
  )
}
