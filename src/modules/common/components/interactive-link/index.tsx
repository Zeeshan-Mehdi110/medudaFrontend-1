// import { ArrowUpRightMini } from "@medusajs/icons"
// import { Text } from "@medusajs/ui"
// import LocalizedClientLink from "../localized-client-link"

// type InteractiveLinkProps = {
//   href: string
//   children?: React.ReactNode
//   onClick?: () => void
// }

// const InteractiveLink = ({
//   href,
//   children,
//   onClick,
//   ...props
// }: InteractiveLinkProps) => {
//   return (
//     <LocalizedClientLink
//       className="flex gap-x-1 items-center group"
//       href={href}
//       onClick={onClick}
//       {...props}
//     >
//       <Text className="text-ui-fg-interactive">{children}</Text>
//       <ArrowUpRightMini
//         className="group-hover:rotate-45 ease-in-out duration-150"
//         color="var(--fg-interactive)"
//       />
//     </LocalizedClientLink>
//   )
// }

// export default InteractiveLink
import { ArrowUpRightMini, ArrowDownLeftMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "../localized-client-link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
  textColor?: string
  locale?: string
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  textColor,
  locale,
  ...props
}: InteractiveLinkProps) => {
  const isRtl = locale === "ar" || locale === "he"
  
  const directionClass = isRtl ? "rtl" : "ltr";

  return (
    <LocalizedClientLink
      className={`flex gap-x-1 items-center group ${directionClass}`}
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text className={`text-ui-fg-interactive ${textColor}`}>{children}</Text>
      
      <span className={textColor}>
        <ArrowUpRightMini
          className={`ease-in-out duration-150 rotate-on-hover ${isRtl ? "rotate-270" : ""}`}
        />
      </span>
    </LocalizedClientLink>
  );
};

export default InteractiveLink
