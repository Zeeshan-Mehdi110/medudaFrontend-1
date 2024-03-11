"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Assuming setCookie and getCookie functions are defined as before

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
};

// Utility function to get cookie by name
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
  return null;
};


export default function LanguageToggle() {
  const [lang, setLang] = useState<string>(() => {
    // Try to get the language preference from a cookie first, then localStorage, default to 'en'
    return getCookie('lang') || localStorage.getItem('lang') || 'he';
  });


  const router = useRouter();

  const changeLanguage = (e: any) => {
    const newLocale = e.target.value;
    const currentUrl = new URL(window.location.href);
    const pathnameParts = currentUrl.pathname.split('/').filter(part => part.trim() !== '');
  
    // Check if there's at least one segment in the path (for the locale)
    if (pathnameParts.length > 0) {
      // Replace the first segment (current locale) with the new locale
      pathnameParts[0] = newLocale;
    } else {
      // If there are no segments, just add the new locale as the first segment
      pathnameParts.unshift(newLocale);
    }
  
    // Construct the new pathname
    const newPathname = `/${pathnameParts.join('/')}`;
  
    // Use the Next.js router to navigate to the new locale path
    router.push(newPathname);
  };

  useEffect(() => {
    localStorage.setItem('lang', lang);
    setCookie('lang', lang, 365)
    setCookie('NEXT_LOCALE', lang, 365); // Set cookie to expire in 365 days
  }, [lang]);



  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLang(newLang);
    // No need to set localStorage or cookie here directly since useEffect will handle it
  };

  return (
    <div className="language-selector hover:text-ui-fg-base">
      <select className=" dark:text-white dark:bg-black" onChange={(e) => {
                                                                                  handleLanguageChange(e);
                                                                                  changeLanguage(e);
                                                                                }} value={lang}>
        <option value="en">English</option>
        <option value="he">עברית</option>
        <option value="ru">Русский</option>
      </select>
    </div>
  );
}
