"use client"
import { Disclosure, Transition } from "@headlessui/react"
import { ArrowUpMini, ArrowDownMini } from "@medusajs/icons"
import { useTranslation } from "react-i18next"
import { Fragment } from 'react';
const faqs = [
  {
    id: 1,
    question: "How do I make a return?",
    answer: "To make a return, follow our return process outlined here.",
  },
  {
    id: 2,
    question: "How can I track my order?",
    answer: "You can track your order by logging into your account.",
  },
  {
    id: 3,
    question: "Do you offer international shipping?",
    answer: "Yes, we offer international shipping to select countries.",
  },
]

export default function CustomerServiceComponent() {
  const { t } = useTranslation()

  return (
    <div className="w-full px-4 pt-8">

      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-2">
     
        {faqs.map((faq) => (
          <Disclosure key={faq.id} as="div" className="mt-2">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 text-gray-900 px-4 py-2 text-left text-sm font-medium text-blue-gray hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                  {faq.question}
                  <ArrowUpMini
                    className={`${open ? "rotate-180" : ""} transform transition duration-400 ease-in-out w-5 h-5 text-gray-500`}
                  />
                </Disclosure.Button>
                <Transition
                    as={Fragment}
                    enter="transition-opacity duration-500 ease-in-out"
                    leave="transition-opacity duration-500 ease-in-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                  
                    <div className="px-4 pt-4 pb-2 text-sm text-gray-500">
                      {faq.answer}
                    </div>
                 
                </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  )
}
