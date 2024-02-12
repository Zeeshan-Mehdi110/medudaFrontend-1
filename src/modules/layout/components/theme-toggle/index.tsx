"use client"
import { useEffect,useState } from "react";
import { Moon,MoonSolid } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Theme() {
 
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
      });

    useEffect(() => {
      console.log(theme)
      // Apply the memoized theme value to the document element
      document.documentElement.setAttribute('data-mode', theme);
    }, [theme]); // This effect depends on theme state for applying the theme to the document

    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    };

  return (
    <LocalizedClientLink href="" onClick={toggleTheme} className="hover:text-ui-fg-base">
    {theme === 'light' ? <MoonSolid className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </LocalizedClientLink>
  )
}