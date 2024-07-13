"use client"
import { getCustomer } from "@lib/data"
import { Heart } from "@medusajs/icons"
import React, { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import { ProductPreviewType } from "types/global"
import { medusaClient } from "@lib/config"
import { Toaster, toast } from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { customerContext } from "../../../../app/[countryCode]/[locale]/template"

interface LoveButtonProps {
  initialCount: number
  productPreview: ProductPreviewType
  locale?: string
}
function getCookieValue(name: any) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()
    if (cookieValue) {
      return cookieValue.split(";").shift()
    }
  }
}

const LoveButton: React.FC<LoveButtonProps> = ({ productPreview, locale }) => {
  const customer = useContext(customerContext) as any
  let wishlist = customer?.metadata?.wishlist as any[] | undefined
  const [isInWishlist, setIsInWishlist] = useState(
    wishlist?.find((item) => item.id === productPreview.id)
  )
  useEffect(() => {
    if (customer) {
      const wishlistItem = customer?.metadata?.wishlist?.find(
        (item: any) => item.id === productPreview.id
      )
      setIsInWishlist(!!wishlistItem)
    }
  }, [customer?.metadata?.wishlist, productPreview.id])
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isRtl = locale === "ar" || locale === "he"
  const getMedusaSession = async (event: React.MouseEvent) => {
    event.stopPropagation() // Prevents the click event from bubbling up to the parent
    let session = false
    setIsLoading(true)
    try {
      //   const response = await medusaClient.customers.retrieve()
      const customer = await getCustomer().catch(() => null)
      if (customer) {
        session = true

        let message
        // Initialize the wishlist if it does not exist
        if (!wishlist) {
          wishlist = []
        }

        // Clone the current wishlist
        let newWishlist = [...wishlist]

        // Check if the product exists in the wishlist
        const productExists = wishlist.find(
          (item) => item.id === productPreview.id
        )

        if (productExists) {
          // Remove the product if it exists
          message = "Product removed from wishlist"
          setIsInWishlist(false)
          newWishlist = wishlist.filter((item) => item.id !== productPreview.id)
        } else {
          message = "Product added to wishlist"
          setIsInWishlist(true)
          newWishlist.push(productPreview)
        }

        const event = new CustomEvent("wishlistChange", {
          detail: {
            product: productPreview,
            action: isInWishlist ? "remove" : "add",
          },
          bubbles: true,
        })
        document.dispatchEvent(event)
        // Update the customer's metadata with the new wishlist
        customer.metadata.wishlist = newWishlist

        await medusaClient.customers
          .update(
            {
              metadata: customer.metadata,
            },
            { Authorization: `Bearer ${getCookieValue("_medusa_jwt")}` }
          )
          .then(({ customer }) => {
            toast.success(message)
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              toast.error(
                "No session found, please login again, redirected to login..."
              ) // Customize the message as needed
              // signOut();
            } else {
              console.error(error)
              toast.error(t("failed-to-update-customer"))
            }
          })
      } else {
        setIsOpen(true)
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // toast.error("No session found, please login again, redirected to login...",{duration:3000});
        setTimeout(() => {
          alert("No session found, please login again, please login again")
          //   signOut()
        }, 3000)
      } else {
        console.error(error)
      }
    }
    setIsLoading(false)
    return session
  }

  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            border: "1px solid black",
            padding: "16px",
            width: "250px",
            height: "auto",
            backgroundColor: "white-smoke",
            textAlign: isRtl ? "right" : "left",
          },
        }}
        position={`bottom-${isRtl ? "right" : "left"}`}
      />
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
          <dialog
            className="bg-white-smoke rounded-lg p-6 shadow-lg flex flex-col text-center gap-3"
            open
          >
            <h5>Custom overlay</h5>
            <div>
              Please login to your account in order to save images to wishlist
            </div>
            <nav className="flex justify-center gap-4">
              <Button
                onClick={() => setIsOpen(false)}
                className="transparent link"
                variant={"danger"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => router.push("/account")}
                variant={"primary"}
              >
                Login
              </Button>
            </nav>
          </dialog>
        </div>
      )}
      <button
        onClick={getMedusaSession}
        className="relative top-[31px] right-[4px] z-10 p-[1px] text-red-600 bg-white rounded-md shadow-lg"
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <Heart fill={isInWishlist ? "red" : "whitesmoke"} />
        )}
      </button>
    </>
  )
}

export default LoveButton
