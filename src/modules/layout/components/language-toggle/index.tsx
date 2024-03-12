"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
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
    return getCookie('lang') || localStorage.getItem('lang') || 'en';
  });

  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (e:any) => {
    const newLocale = e.target.value; // The selected new locale from the event
   
    let pathnameParts = pathname.split('/').filter(part => part.trim() !== ''); // Splits and filters out empty parts
  
    // Ensure there's at least a country code in the path
    if (pathnameParts.length >= 1) {
      // If there's only the country code or more, ensure the second segment is the new locale
      pathnameParts[1] = newLocale;
    } else {
      // If the path is somehow empty (which is unusual since there should be at least a country code), handle accordingly
      console.warn("Attempting to change locale on a URL without a country code. This should be handled differently.");
      return; // Exit the function as this case might require different handling
    }
  
    // Reconstruct the URL with the updated language code
    const newPathname = `/${pathnameParts.join('/')}`;
  
    // Use the Next.js router to navigate to the updated URL
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
