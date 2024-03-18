"use client"

import { ChangeEvent } from "react"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import { useTranslation } from "react-i18next"
export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
}



const SortProducts = ({ sortBy, setQueryParams }: SortProductsProps) => {
  const handleChange = (e: ChangeEvent<HTMLButtonElement>) => {
    const newSortBy = e.target.value as SortOptions
    setQueryParams("sortBy", newSortBy)
  }
  const {t} = useTranslation()
  const sortOptions = [
    {
      value: "created_at",
      label: t("latest-arrivals"),
    },
    {
      value: "price_asc",
      label: t("price-low-high"),
    },
    {
      value: "price_desc",
      label: t("price-high-low"),
    },
  ]
  return (
    <FilterRadioGroup
      title={t("sort-by")}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
    />
  )
}

export default SortProducts
