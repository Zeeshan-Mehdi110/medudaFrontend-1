//@ts-nocheck
"use client"
import { GetProductsByArtistId } from "@lib/util/get-products-with-artist"
import ProductPreview from "@modules/products/components/product-preview"
import RefinementList from "@modules/store/components/refinement-list"
import { useEffect, useState } from "react"

const ArtistTemplate = (params) => {
  let {artistId , locale , region } = params 
  const [products, setProducts] = useState([])
  useEffect(()=>{
    const fetchData = async () => {
      const data = await GetProductsByArtistId(artistId)
      setProducts(data)
    }
    fetchData()
  },[])
  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container">
      <RefinementList sortBy={"created_at"} />
      <div className="w-full">
        <ul className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
          {products && products.map((p) => {
            return (
              <li key={p.id}>
                <ProductPreview productPreview={p} region={region} locale={locale} />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default ArtistTemplate