import { ArrowUpRightMini, ArrowDownLeftMini, ArrowDownCircle } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "../localized-client-link"
import { Poppins } from "next/font/google"

const poppins = Poppins({subsets:["latin"], weight: "600"})

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
      className={`flex gap-x-1 items-center group ${directionClass} custom-button `}
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text className={`${poppins.className} text-white`}>{children}</Text>
      
      <span  className={`${isRtl ? "rotate-90" : "rotate-270"}`}>
        {/* <ArrowUpRightMini
          className={`ease-in-out duration-150 rotate-on-hover ${isRtl ? "rotate-270" : ""}`}
        /> */}
        <ArrowDownCircle/>
      </span>
    </LocalizedClientLink>
  );
};

export default InteractiveLink
