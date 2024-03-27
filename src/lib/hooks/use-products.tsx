import api from "@lib/api-client";
import { Product } from "@medusajs/client-types";
import useSWR, { Fetcher } from "swr";

const fetcher: Fetcher<
  { products: Product[]; count: number },
  Record<string, unknown>
> = (params) =>
    api
      .get(`store/products`, {
        params,
      })
      .then((res) => res.data);

export const PRODUCTS_KEY = `store/products`;

export const useProducts = (params: Record<string, unknown>) => {
  const { data, error, isLoading } = useSWR(
    [PRODUCTS_KEY, params],
    ([_, params]) => fetcher(params)
  );

  return {
    products: data?.products,
    count: data?.count,
    error,
    isLoading,
  };
};