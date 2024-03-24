"use client"
import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation" // Correct import for useRouter

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie =
    name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/"
}

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

export default function LanguageToggle() {
  
  const locales = ["en", "he", "ru"];
  const pathname = usePathname()
  const pathnameParts = pathname
  .split("/")
  .filter((part) => part.trim() !== "")
  const [lang, setLang] = useState(getCookie("lang") ?? "en")
  const router = useRouter()
  
  useEffect(() => {
    // setLang(getCookie("lang") || localStorage.getItem("lang") || "en")
    // setLang(locales.includes(pathnameParts[1]) ? pathnameParts[1] : null ?? getCookie("lang") ?? localStorage.getItem("lang") ?? "en")
    localStorage.setItem("lang", lang)
    setCookie("lang", lang, 365)
    setCookie("NEXT_LOCALE", lang, 365)
  }, [lang])

  // Pre-calculate URLs for language change links
  const createLocaleChangeUrl = (newLocale: any) => {
  
    pathnameParts[1] = newLocale // Assuming the second segment is the locale
    return `/${pathnameParts.join("/")}`
  }

  const handleLanguageChange = (newLocale: any) => {
    setLang(newLocale)
    // setCookie("lang", newLocale, 365)
    // setCookie("NEXT_LOCALE", newLocale, 365)
    // setIsOpen(false)
    // No router.push here since <Link> handles navigation
    router.replace(createLocaleChangeUrl(newLocale))
  }

  // useEffect(() => {
  //   // Effect for updating state, cookies, or localStorage when lang changes might be placed here
  //   localStorage.setItem("lang", lang)
  // }, [lang])

  return (
    <div className="language-selector hover:text-ui-fg-base">
    <select className=" dark:text-white bg-transparent dark:bg-black" onChange={(e) => {
                                                                                handleLanguageChange(e.target.value);
                                                                                
                                                                              }} value={lang}>
      <option value="en">English</option>
      <option value="he">עברית</option>
      <option value="ru">Русский</option>
    </select>
  </div>


  )
}



