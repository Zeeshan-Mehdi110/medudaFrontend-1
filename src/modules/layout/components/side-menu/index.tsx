"use client"

import { Popover, Transition } from "@headlessui/react"
import { ArrowRightMini, BarsThree, EllipsePurpleSolid, XMark } from "@medusajs/icons"
import { Region } from "@medusajs/medusa"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"

const SideMenu = ({ regions, locale, session }: { regions: Region[] | null, locale:string, session :any }) => {
  const toggleState = useToggleState()
  const { t } = useTranslation()
const isRtl = locale === 'ar' || locale === 'he'
const SideMenuItems = {
  Home: "/",
  Account: "/account",
  Cart: "/cart",
  Store: "/store",
  Search: "/search",
  GiftCards: "/products/pixels-journey-gift-card",
  WishList: session ? "/account/my-images" : "/account",
  Blog: "/blog",
  CustomerService: "/customer-service",
}

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base">
                <div className="relative">
                    <EllipsePurpleSolid className={`customEllipsePurple absolute w-[15px] h-[15px] top-[-6px] ${isRtl? "left-[6px]" : "right-[6px]"} `}/>
                    <BarsThree></BarsThree>
                    {t("menu")}
                  </div>
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <Popover.Panel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl">
                  <div className="flex flex-col h-full bg-white-smoke rounded-rounded justify-between p-6 text-gray-300">
                    <div className="flex justify-end" id="xmark">
                      <button onClick={close}>
                        <XMark />
                      </button>
                    </div>
                    <div className="w-full flex justify-center items-center relative">
                      {" "}
                      <img
                        className="absolute bottom-0 sm:scale-100 scale-80 max-w-[150px] min-w-[150px] "
                        alt="navigation bar logo"
                        id="nav-logo"
                        src="/rr.svg"
                      ></img>
                    </div>
                    <ul className="flex flex-col gap-6 items-start justify-start pb-6 ">
                      {Object.entries(SideMenuItems).map(
                        ([name, href], ind) => {
                          return (
                            <li
                              key={name}
                              className="w-full border-b border-gray-300"
                            >
                              <LocalizedClientLink
                                href={href}
                                className={`text-2xl leading-10 hover:text-ui-fg-disabled`}
                                onClick={close}
                              >
                                {t(name.toLowerCase())}
                              </LocalizedClientLink>
                            </li>
                          )
                        }
                      )}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      <div
                        className="flex justify-between"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="flex justify-between txt-compact-small">
                        © {new Date().getFullYear()} {t("copyright")}
                      </Text>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
