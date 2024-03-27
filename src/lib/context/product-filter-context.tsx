//@ts-nocheck
"use client"
import React from "react";

interface ProductFiltersContextProps {
  attributes?: Record<string, string[]> | null;
  intAttributes?: Record<string, number[]> | null;
  setAttributes?: React.Dispatch<React.SetStateAction<Record<string, string[]> | null>>
  setIntAttributes?: React.Dispatch<
    React.SetStateAction<Record<string, number[]> | null | undefined>
  >;
}

const ProductFiltersContext = React.createContext<ProductFiltersContextProps>(
  {}
);


interface ProductFiltersProviderProps {
  initialValues: ProductFiltersContextProps;
  children: React.ReactNode;
}

export const ProductFiltersProvider = ({
  children,
  initialValues,
}: ProductFiltersProviderProps) => {
  const {
    attributes: initialAttributes// Range attributes
  } = initialValues;

  const [attributes, setAttributes] = React.useState<Record<
    string,
    string[]
  > | null>(initialAttributes ?? {});

  return (
    <ProductFiltersContext.Provider
      value={{
        attributes,
        setAttributes
      }}
    >
      {children}
    </ProductFiltersContext.Provider>
  );
};

export const useProductFilters = () => {
  const context = React.useContext(ProductFiltersContext);

  return context;
};