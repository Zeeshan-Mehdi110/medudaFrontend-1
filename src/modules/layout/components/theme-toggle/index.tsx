"use client"
import { useEffect, useState } from "react"
import { Moon, MoonSolid, SunSolid } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Theme() {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    // Apply the memoized theme value to the document element
  
    setTheme(localStorage.getItem("theme") || "light")
    document.documentElement.setAttribute("data-mode", theme)

    const backgroundContainer = document.getElementById("background-image");
    if (backgroundContainer) {
      backgroundContainer.style.backgroundImage =
        theme === "light" ? "url('/lightTheme.jpg')" : "url('/2363.jpg')";
    }
    document.cookie = `theme=${theme}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  }, [theme]) // This effect depends on theme state for applying the theme to the document

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.cookie = `theme=${newTheme}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
  }

  return (
<>
{theme === "light" ? (
        <MoonSolid onClick={toggleTheme} className="h-6 w-6" />
      ) : (
        <SunSolid onClick={toggleTheme} className="h-6 w-6" />
      )}
</>
    
    
  )
}
