
"use client"
import React, { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation" // Correct import for useRouter
import { useTranslation } from "react-i18next"

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie =
    name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/"
}


export default function LanguageToggle({locale} : {locale: string}) {
  const searchParams = useSearchParams().toString()
  const locales = ["en", "he", "ru"];
  const { t } = useTranslation()
  const pathname = usePathname()
  const pathnameParts = pathname
  .split("/")
  .filter((part) => part.trim() !== "")
  const [lang, setLang] = useState(locale)
  const router = useRouter()
  
  useEffect(() => {
    localStorage.setItem("lang", lang)
    setCookie("lang", lang, 365)
    setCookie("NEXT_LOCALE", lang, 365)
  }, [lang])

  // Pre-calculate URLs for language change links
  const createLocaleChangeUrl = (newLocale: string) => {
    pathnameParts[1] = newLocale;
    const newUrl = `/${pathnameParts.join("/")}`;
    return searchParams ? `${newUrl}?${searchParams}` : newUrl; // Concatenate searchParams if not empty
  }

  const handleLanguageChange = (newLocale: any) => {
    setLang(newLocale)
    router.replace(createLocaleChangeUrl(newLocale))
  }



  return (
    <div className="language-selector hover:text-ui-fg-base">
      <label htmlFor="language-select" className="sr-only">{t("choose-language")}</label>
    <select id="language-select" className=" dark:text-white bg-transparent dark:bg-black" onChange={(e) => {
                                                                                handleLanguageChange(e.target.value);
                                                                                
                                                                              }} value={lang}>
      <option value="en">English</option>
      <option value="he">עברית</option>
      <option value="ru">Русский</option>
    </select>
  </div>


  )
}




