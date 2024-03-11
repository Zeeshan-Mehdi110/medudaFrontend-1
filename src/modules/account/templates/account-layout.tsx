"use client"
import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { Customer } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
interface AccountLayoutProps {
  customer: Omit<Customer, "password_hash"> | null
  children: React.ReactNode,
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {

const { t } = useTranslation();
  return (
    <div className="flex-1 small:py-12 dark:text-white">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto dark:bg-black bg-white flex flex-col">
        <div className="grid grid-cols-1  small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4"> {t("got-questions")}</h3>
            <span className="txt-medium">
            {t("frequently-asked-questions")}
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
            {t("customer-service")}
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout