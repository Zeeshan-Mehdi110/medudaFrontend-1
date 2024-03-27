//@ts-nocheck
import React from "react";
import { useProductFilters } from "@lib/context/product-filter-context";
import { useAttributes } from "@lib/hooks/use-attributes";
import { Checkbox } from "@medusajs/ui";

export const AttributeFilters = React.memo((props: ProductFiltersProps) => {
  const { className } = props;
  const {
    setAttributes,
    attributes,
    intAttributes,
    setIntAttributes,
  } = useProductFilters; 

  // Custom hook to fetch "/store/attributes" route
  const { attributes: customAttributes } = useAttributes();

  return (
    <VStack
      className={classnames(cls.AttributeFilters, {}, [className])}
      gap="32"
    >
      {customAttributes?.map((attribute) => {
        if (attribute.type === "boolean") {
          const checked = attributes?.[attribute.handle] ?? false;

          return (
            <Checkbox
              key={attribute.id}
              name={attribute.name}
              checked={!!checked}
              onChange={() => {
                if (checked) {
                  const newAttributes = { ...attributes };
                  delete newAttributes[attribute.handle];
                  setAttributes?.(newAttributes);
                } else {
                  setAttributes?.((prev) => ({
                    ...prev,
                    [attribute.handle]: [attribute.values[0].id],
                  }));
                }
              }}
            >
              {attribute.name}
            </Checkbox>
          );
        }

        if (attribute.type === "range") {
          return (
            <Range
              name={attribute.name}
              maxValue={100}
              minValue={0}
              key={attribute.id}
              setValues={(value) => {
                setIntAttributes?.((prev) => ({
                  ...prev,
                  [attribute.id]: value,
                }));
              }}
              values={[
                intAttributes?.[attribute.id]?.[0] ?? 0,
                intAttributes?.[attribute.id]?.[1] ?? 100,
              ]}
            />
          );
        }

        return (
          <CheckboxList
            key={attribute.id}
            checked={attributes?.[attribute.handle] ?? []}
            label={attribute.name}
            options={attribute.values.map((value) => ({
              value: value.id,
              label: value.value,
            }))}
            onChange={(values) =>
              setAttributes?.((prev) => ({
                ...prev,
                [attribute.handle]: values,
              }))
            }
          />
        );
      })}
    </VStack>
  );
});