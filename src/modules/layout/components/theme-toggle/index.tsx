"use client"
import { useEffect, useState } from "react"
import { Moon, MoonSolid } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Theme() {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    // Apply the memoized theme value to the document element
    setTheme(localStorage.getItem("theme") || "light")
    document.documentElement.setAttribute("data-mode", theme)
  }, [theme]) // This effect depends on theme state for applying the theme to the document

  const toggleTheme = (e:any) => {
    e.preventDefault();
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <LocalizedClientLink
      href=""
      onChange={(e: any) => {
        toggleTheme(e);
      }}
      className="hover:text-ui-fg-base"
    >
      {theme === "light" ? (
        <MoonSolid className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </LocalizedClientLink>
  )
}
