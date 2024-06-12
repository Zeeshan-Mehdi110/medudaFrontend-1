"use client"
import { ProductOption } from "@medusajs/medusa"
import { clx } from "@medusajs/ui"
import React from "react"
import { onlyUnique } from "@lib/util/only-unique"
import { useTranslation } from "react-i18next"
import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"
import TextConvertor from "../text-convertor"



type OptionSelectProps = {
  option: ProductOption
  current: string
  updateOption: (option: Record<string, string>) => void
  title: string,
  locale: string,
  productVariants: PricedVariant[];
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  locale,
  productVariants
}) => {
  productVariants.forEach((pv) => {
    if (pv.metadata != null) {
      //@ts-ignore
      pv.options[0].metadata = pv.metadata;
    }
  });
   //@ts-ignore
   const options = productVariants.map(pv => pv.options[0]);
   option.values = options;
  const filteredOptions = option.values.map((v) => v).filter(onlyUnique)
 const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">{t("select")} {title}</span>
      <div className="flex flex-wrap justify-between gap-2">
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption({ [option.id]: v.value })}
              key={v.value}
              className={clx(
                "border-ui-border-base bg-ui-bg-subtle dark:text-white border text-small-regular h-10 rounded-rounded p-2 flex-1 ",
                {
                  "border-ui-border-interactive": v.value === current,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                    v.value !== current,
                }
              )}
            >
              <TextConvertor locale={locale} title={v.value} metadata={v.metadata && v.metadata["name"] ? JSON.stringify(v.metadata["name"]) as any : null} ></TextConvertor>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
