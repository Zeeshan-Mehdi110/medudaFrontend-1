//@ts-nocheck
import { useProductFilters } from "@lib/context/product-filter-context";
import { useProducts } from "@lib/hooks/use-products";
import React from "react";

export const ProductList = React.memo((props: ProductListProps) => {
  const { className } = props;
  const filters = useProductFilters();

  const representationParams = React.useMemo(
    () => ({
            attributes: Object.values(filters.attributes).flat() ?? null,
            int_attributes: filters.intAttributes ?? null,
          }),
    [filters]
  );

  const { products } = useProducts(representationParams);

  return (
    <div className={classnames(cls.ProductList, {}, [className])}>
      {products?.map((product) => (
        <ProductTile product={product} key={product.id} />
      ))}
    </div>
  );
});