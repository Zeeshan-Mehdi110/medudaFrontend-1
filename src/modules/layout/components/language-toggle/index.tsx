"use client"
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Correct import for useRouter
import Link from "next/link";

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
  const [lang, setLang] = useState(() => getCookie("lang") || localStorage.getItem("lang") || "en");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  // Pre-calculate URLs for language change links
  const createLocaleChangeUrl = (newLocale : any) => {
    const pathnameParts = pathname.split("/").filter(part => part.trim() !== "");
    pathnameParts[1] = newLocale; // Assuming the second segment is the locale
    return `/${pathnameParts.join("/")}`;
  };

  const handleLanguageChange = (newLocale: any) => {
    setLang(newLocale);
    setCookie("lang", newLocale, 365);
    setCookie("NEXT_LOCALE", newLocale, 365);
    localStorage.setItem("lang", newLocale);
    setIsOpen(false);
    // No router.push here since <Link> handles navigation
  };

  useEffect(() => {
    // Effect for updating state, cookies, or localStorage when lang changes might be placed here
  }, [lang]);

  return (
    <div className="language-selector hover:text-ui-fg-base relative">
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
        Change Language
      </button>
      {isOpen && (
        <div className="dropdown-menu absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
          <Link legacyBehavior href={createLocaleChangeUrl('en')} locale={false} passHref>
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleLanguageChange('en')}>English</a>
          </Link>
          <Link legacyBehavior href={createLocaleChangeUrl('he')} locale={false} passHref>
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleLanguageChange('he')}>עברית</a>
          </Link>
          <Link legacyBehavior href={createLocaleChangeUrl('ru')} locale={false} passHref>
            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleLanguageChange('ru')}>Русский</a>
          </Link>
        </div>
      )}
      <style jsx>{`
        .dropdown-menu {
          display: ${isOpen ? "block" : "none"};
        }
      `}</style>
    </div>
  );
}