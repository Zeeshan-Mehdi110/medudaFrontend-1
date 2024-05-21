"use client"

import { medusaClient } from "@lib/config"
import { Dialog } from "@headlessui/react"
import { ArrowUpMini, FaceSmile, ShoppingBag, Trash } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { useParams } from "next/navigation"
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback,
  useRef,
} from "react"
import { Button, Text } from "@medusajs/ui"
import { Toaster, toast } from "react-hot-toast"
import CustomSpinner from "@modules/common/icons/custom-spinner"
import { deleteLineItem, getOrSetCart, retrieveCart } from "@modules/cart/actions"
import { formatAmount } from "@lib/util/prices"
import { addToCart as addToCartMedusaFn } from "@modules/cart/actions"
import { getSession } from "@lib/data"
import { useRouter } from "next/navigation"
import { set } from "lodash"
import { getRegion } from "app/actions"


interface MyImagesComponentProps {
  customer: any
  locale: string,
  countryCode: string
}

const MyImagesComponent: React.FC<MyImagesComponentProps> = ({
  customer,
  locale,
  countryCode,
}) => {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [cart, setCart] = useState<any>({})
  const [base64String, setBase64String] = useState<string | null>(null)
  const [images, setImages] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [deleteFileLoading, setDeleteFileLoading] = useState(false)
  const [uploadFileLoading, setUploadFileLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const fileInputRef = useRef(null)
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [currentImageForVariant, setCurrentImageForVariant] = useState("")
  const { t } = useTranslation()
  const [variants, setVariants] = useState<any[]>([])
  const [inputKey, setInputKey] = useState(Date.now())
  const isRtl = locale === "he" || locale === "ar"
  const [loadedImages, setLoadedImages] = useState({});
  const [region, setRegion] = useState<string>("")

  const handleImageLoad = (index : any) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };
  const openModal = (image: string) => {
    setSelectedImage(image)
    setIsOpen(true)
  }
  const closeModal = () => {
    setIsOpen(false)
  }

  const getProducts = async () => {
    try {
      let { products } = await medusaClient.products.list()
      const variants = products
        .filter((product: any) => product.handle === "custom-print")
        .at(0)?.variants
      setVariants(variants || [])
    } catch (error) {}
  }

  const getMedusaSession = async () => {
    try {
      const session = await getSession().catch(() => null)
      return session
    } catch (error) {
      console.error(error)
    }
  }

  const getCarts = async () => {
    try {
      let cart = await retrieveCart().catch(() => null)
      if (cart) {
        setCart(cart)
      }
    } catch (error) {}
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getMedusaSession()
        if (!session) router.push(`/${countryCode}/${locale}/account`)
        await getCarts()
        await getProducts()
        let region = await getRegion(countryCode as string).catch((err) => {console.error(err)})
        region ? setRegion(region.id) : setRegion("")
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  async function checkImageExists(id: string) {
    try {
      const t = (await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/get-images`,
        {
          body: JSON.stringify({ imageId: id }),
          method: "POST",
        }
      )) as any
      if (t.ok) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false 
    }
  }

  const fetchData = useCallback(async () => {
    setInitialLoading(true)
    const newImages = []
    const ids = customer.metadata?.userImages ? Object.values(customer.metadata.userImages) : [];
    if(ids.length > 0){
    for (const id of ids) {
      const url = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${id}/public`
      const exists = await checkImageExists(id as string)
      if (exists) {
        newImages.push(url)
      } else {
        delete customer.metadata.userImages[id as string]
        await medusaClient.customers.update({
          metadata: customer.metadata,
        })
      }
    }
  } 
    setImages(newImages)
    setInitialLoading(false)
  }, [])

  useEffect(() => {
    fetchData().catch(console.error)
  }, [fetchData])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          const base64 = reader.result
            .toString()
            .replace(/^data:.+;base64,/, "")
          setBase64String(base64)
        }
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSelectVariant = (variant: any) => {
    setSelectedVariant(variant)
  }

  const addToCart = async (variant: any, image: string) => {
    if (cart) {
      await addToCartMedusaFn({
        variantId: variant.id,
        quantity: 1,
        metadata: { variant: variant.title, image: image } as any,
        countryCode: countryCode as string,
      })
    }
      getCarts()
    // } else {
    //     try{
    //         let newlyCreatedCart = await getOrSetCart(countryCode as string);
    //         setCart(newlyCreatedCart);
    //         await addToCartMedusaFn({
    //             variantId: variant.id,
    //             quantity: 1,
    //             metadata: { variant: variant.title, image: image } as any,
    //             countryCode: countryCode as string,
    //           })
    //           getCarts()
    //     }
    //     catch(error){
    //         console.error(error)
    //         toast.error(t("failed-to-add-item-to-cart"))
    //     }
        
    // }
  }


  const extractImageId = (url: string) => {
    if (!url) return ""
    const parts = url.split("/")
    return parts[parts.length - 2]
  }

  const uploadImage = async (event: FormEvent) => {
    event.preventDefault()

    if (!base64String) {
      alert(`${t("please-select-a-file-first")}!`)
      return
    }
    setUploadFileLoading(true)
    try {
      const body = {
        image: base64String,
        metadata: JSON.stringify({ name: file?.name }),
        requireSignedURLs: "false",
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/post-images`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      if (fileInputRef.current) {
        ;(fileInputRef.current as HTMLInputElement).value = "" // Add type assertion to specify the type as HTMLInputElement
      }
      const data = await response.json()
      const id = data.result?.id // Ensure there's an ID in the response

      if (id) {
        if (!customer.metadata) {
          customer.metadata = {}
        }
        if (!customer.metadata.userImages) {
          customer.metadata.userImages = {}
        }
        customer.metadata.userImages[id] = id

        medusaClient.customers
          .update({
            metadata: customer.metadata,
          })
          .then(({ customer }) => {})
          .catch((error) => {
            toast.error(t("failed-to-update-customer"))
          })

        const newImageUrl = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${id}/public`
        setImages([...images, newImageUrl])
        setFile(null)
        toast.success(`${t("image-uploaded-successfully")}!`)
      }
      setUploadFileLoading(false)
    } catch (error) {
      console.error("Failed to upload image:", error)
      toast.error(t("failed-upload-image"))
      setUploadFileLoading(false)
    }
  }

  return (
    <div>
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
        position={`bottom-${
          isRtl ? "right" : "left"
        }`}
      />
      {images.length > 0 ? (
        <div>
          <ul className="flex flex-wrap gap-4 justify-center sm:justify-normal">
          {images.map((image, index) => (
        <div key={index} className="relative group">
          <a href={image} className="block relative z-10">
            <img
              className="max-w-[250px] max-h-[250px] shadow-md"
              src={image}
              alt={`User image ${index}`}
              onLoad={() => handleImageLoad(index)}
            />
          </a>
          {loadedImages[index as keyof typeof loadedImages] && (
            <div className="flex gap-2 absolute top-1 right-1 z-20">
              <Button
              variant={"transparent"}
                onClick={(event) => {
                  event.stopPropagation();
                  openModal(image);
                }}
                className="bg-gray rounded-sm"
                style={{ opacity: 0.7, transition: "opacity 0.3s ease" }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "0.5")}
              >
                <Trash className="opacity-100" />
              </Button>
              <Button
                className="bg-gray rounded-sm"
                variant={"transparent"}
                style={{ opacity: 0.7, transition: "opacity 0.3s ease" }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "0.5")}
                onClick={async (event) => {
                  event.stopPropagation(); // Prevents triggering other click events
                  let newlyCreatedCart = await getOrSetCart(countryCode as string);
                  setCart(newlyCreatedCart);
                  setCurrentImageForVariant(image);
                  setIsVariantModalOpen(true);
                }}
              >
                {isVariantModalOpen ? <ShoppingBag className="opacity-100" /> : <CustomSpinner/>}
              </Button>
            </div>
          )}
        </div>
      ))}
          </ul>
        </div>
      ) : (
        initialLoading && (
          <CustomSpinner
            size={32}
            attributes={JSON.stringify({ top: "-54%", left: "-10%" })}
          />
        )
      )}
      {images.length === 0 && !initialLoading && <div className="w-full flex justify-center"><Text weight="plus" size="xlarge">{t("prompt-upload-first-image")}<b>{" :) "}</b> </Text></div>}
      {
        <Dialog
          open={isOpen}
          onClose={closeModal}
          className="fixed inset-0 z-30 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="flex flex-col relative bg-gray p-6 rounded max-w-sm mx-auto text-center gap-2 ">
              <Dialog.Title className="font-bold">
                {t("confirm-deletion")}
              </Dialog.Title>
              <Dialog.Description>
                {t("confirm-delete-image-action")}
              </Dialog.Description>
              <div className="flex justify-center gap-3">
                <Button className="mt-4 mr-2" onClick={closeModal}>
                  {t("cancel")}
                </Button>
                <Button
                  variant="danger"
                  className="mt-4 min-w-14"
                  onClick={async () => {
                    try {
                      setDeleteFileLoading(true)
                      const imageId = extractImageId(selectedImage)
                      const response = await fetch(
                        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/delete-images`,
                        {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ imageId }),
                        }
                      )
                      if (!response.ok) {
                        throw new Error(t("failed-to-delete-the-image"))
                      }
                      let item = cart?.items?.find(
                        (item: any) => extractImageId(item?.metadata?.image) === extractImageId(selectedImage)
                      )
                      let itemId = item?.id
                      if (itemId) {
                        await deleteLineItem(itemId).catch((err) => {toast.error(t( "failed-to-delete-item-from-cart"))})
                      }

                      delete customer.metadata.userImages[imageId]
                      setImages(images.filter((img) => !img.includes(imageId)))
                      await medusaClient.customers.update({
                        metadata: customer.metadata,
                      })
                      setDeleteFileLoading(false)
                      toast.success(`${t("image-deleted")}!`)
                      closeModal() // Close the modal
                    } catch (error) {
                      console.error("Error deleting image:", error)
                    }
                  }}
                >
                  {deleteFileLoading ? (
                    <CustomSpinner loading={deleteFileLoading} />
                  ) : (
                    t("delete")
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      }
      {
        <Dialog
          open={isVariantModalOpen}
          onClose={() => setIsVariantModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

            <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto z-50">
              <Dialog.Title className="font-bold text-lg">
              {t("please-select-a-variant")}
              </Dialog.Title>
              <div className="mt-4 flex gap-2">
                {variants.map((variant, index) => (
                  <button
                    key={index}
                    className={`block ${
                      variant === selectedVariant ? "bg-sky-100" : ""
                    } w-full text-center p-2 hover:bg-gray-100 rounded truncate`}
                    onClick={(event) => {
                      event.preventDefault()
                      handleSelectVariant(variant)
                    }}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <div className="mt-4 flex flex-col text-center">
                  {formatAmount({
                    amount:
                      selectedVariant.prices.find(
                        (price: any) =>
                          price.currency_code === cart?.region?.currency_code
                      )?.amount || 0,
                    region: cart?.region ?? region,
                    includeTaxes: true,
                  })}{" "}
                  <Text>{`(${t("prices-are-tax-inclusive")})`}</Text>
                </div>
              )}
              <div className="mt-4 flex justify-center gap-3">
                <Button
                  onClick={() => {
                    setSelectedVariant(null)
                    setIsVariantModalOpen(false)
                  }}
                >
                  {t("cancel")}
                </Button>
                <Button
                  disabled={!selectedVariant}
                  onClick={() => {
                    addToCart(selectedVariant, currentImageForVariant)
                    setIsVariantModalOpen(false)
                    toast.success(`${t("added-to-cart")}!`)
                  }}
                >
                   {t("confirm")}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      }
      <form
        onSubmit={uploadImage}
        className="flex flex-col gap-4 p-4 border rounded-lg shadow-lg max-w-sm mx-auto mt-12"
      >
        <input
          ref={fileInputRef}
          id="file-upload"
          name="image"
          accept="image/*"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          key={inputKey}
        />
        <label
          htmlFor="file-upload"
          style={{ fontSize: "1rem" }}
          className="cursor-pointer w-full text-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200 flex items-center justify-center gap-2"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <ArrowUpMini className="animate-flicker w-5 h-5 text-blue-800" />
          </div>
          <span>{file ? file.name : t("select-image")}</span>
        </label>
        <div className="w-full flex justify-center items-center">
          <Button
            type="submit"
            className="py-2 px-4 min-w-full min-h-6 bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            {uploadFileLoading ? (
              <CustomSpinner loading={uploadFileLoading} />
            ) : 
              t("upload-image")
            }
          </Button>
        </div>
      </form>
    </div>
  )
}

export default MyImagesComponent
