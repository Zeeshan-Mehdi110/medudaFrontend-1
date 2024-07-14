"use client"
import ProductPreview from "@modules/products/components/product-preview"
import React, { useEffect, useState } from "react"

interface WishListProps {
  items?: string[]
  customer: any
  locale?: string
  countryCode?: string
  region?: any
}

const WishList: React.FC<WishListProps> = ({
  items,
  customer,
  locale,
  region,
}) => {


    const [wishlist, setWishlist] = useState<any[]>(customer?.metadata?.wishlist || []);

    useEffect(() => {
  
      setWishlist(customer?.metadata?.wishlist || []);
    }, [customer?.metadata?.wishlist]);



    useEffect(() => {
        const handleWishlistChange = (event: CustomEvent<{ product: any; action: string }>) => {
          const { product, action } = event.detail;
          setWishlist(prevWishlist => {
            if (action === 'add') {
              return [...prevWishlist, product];
            } else {
              return prevWishlist.filter(item => item.id !== product.id);
            }
          });
        };
    
        document.addEventListener('wishlistChange', handleWishlistChange as EventListener);
    
        return () => {
          document.removeEventListener('wishlistChange', handleWishlistChange as EventListener);
        };
      }, []);


  if (!wishlist || wishlist.length === 0) {
    return <div>Your wishlist is empty.</div>
  }

  return (
    <div className="flex flex-col gap-3">
      <h2>Wish List</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4">
        {wishlist.map((item, index) => (
          <div className="w-[180px]"  key={item.id}>
            {" "}
            <ProductPreview
              textColor=""
              productPreview={item}
              region={region as any}
              locale={locale as string}
              
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WishList
