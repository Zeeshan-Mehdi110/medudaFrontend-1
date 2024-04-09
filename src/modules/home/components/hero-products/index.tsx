"use client";
import { medusaClient } from "@lib/config";
import { useEffect, useState } from "react";
import ProductSlider from "./products";


export default function HeroProducts({locale}:{locale:string}) {
    const [products, setProducts] = useState<any[]>([])

    const getProducts = async () => {
      try {
        const results = await medusaClient.products.list();
        setProducts(results.products)
      } catch (error) {
        console.log(error)
      }
    }
    
    useEffect(() => {
     getProducts()
    }, []);

    return(
        <ProductSlider locale={locale} products={products}/>
    )
}
