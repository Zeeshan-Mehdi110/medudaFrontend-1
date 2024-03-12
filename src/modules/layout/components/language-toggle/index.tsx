// "use client"

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// // Assuming setCookie and getCookie functions are defined as before

// const setCookie = (name: string, value: string, days: number) => {
//   const expires = new Date(Date.now() + days * 864e5).toUTCString();
//   document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
// };

// // Utility function to get cookie by name
// const getCookie = (name: string): string | null => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
//   return null;
// };


// export default function LanguageToggle() {
//   const [lang, setLang] = useState<string>(() => {
//     // Try to get the language preference from a cookie first, then localStorage, default to 'en'
//     return getCookie('lang') || localStorage.getItem('lang') || 'he';
//   });


//   const router = useRouter();

//   const changeLanguage = (e: any) => {
//     const newLocale = e.target.value;
//     const currentUrl = new URL(window.location.href);
//     const pathnameParts = currentUrl.pathname.split('/').filter(part => part.trim() !== '');
  
//     // Check if there's at least one segment in the path (for the locale)
//     if (pathnameParts.length > 0) {
//       // Replace the first segment (current locale) with the new locale
//       pathnameParts[0] = newLocale;
//     } else {
//       // If there are no segments, just add the new locale as the first segment
//       pathnameParts.unshift(newLocale);
//     }
  
//     // Construct the new pathname
//     const newPathname = `/${pathnameParts.join('/')}`;
  
//     // Use the Next.js router to navigate to the new locale path
//     router.push(newPathname);
//   };

//   useEffect(() => {
//     localStorage.setItem('lang', lang);
//     setCookie('lang', lang, 365)
//     setCookie('NEXT_LOCALE', lang, 365); // Set cookie to expire in 365 days
//   }, [lang]);



//   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newLang = e.target.value;
//     setLang(newLang);
//     // No need to set localStorage or cookie here directly since useEffect will handle it
//   };

//   return (
//     <div className="language-selector hover:text-ui-fg-base">
//       <select className=" dark:text-white dark:bg-black" onChange={(e) => {
//                                                                                   handleLanguageChange(e);
//                                                                                   changeLanguage(e);
//                                                                                 }} value={lang}>
//         <option value="en">English</option>
//         <option value="he">עברית</option>
//         <option value="ru">Русский</option>
//       </select>
//     </div>
//   );
// }

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
    return getCookie('lang') || localStorage.getItem('lang') || 'en';
  });


  const router = useRouter();

  const changeLanguage = (e: any) => {
    const newLocale = e.target.value; // The selected new locale from the event
    const currentUrl = new URL(window.location.href); // Current full URL
    let pathnameParts = currentUrl.pathname.split('/').filter(part => part.trim() !== ''); // Splits and filters out empty parts
  
    // Check if the path includes at least a countryCode (and optionally a current locale)
    if (pathnameParts.length >= 1) {
      // Ensure the pathname has space for the newLocale. If it only has one part (countryCode), add another segment for the newLocale
      if (pathnameParts.length === 1) {
        pathnameParts.push(newLocale); // Adds newLocale as the second segment
      } else {
        pathnameParts[1] = newLocale; // Replaces whatever is in the second segment with newLocale
      }
    } else {
      // Handle edge case where the URL doesn't even have a countryCode
      console.warn("Attempting to change locale on a URL without a countryCode. This should be handled differently.");
      return; // Exit the function as this case might require a different handling logic
    }
  
    // Reconstruct the URL with the updated language code
    const newPathname = `/${pathnameParts.join('/')}`;
    const newUrl = `${currentUrl.origin}${newPathname}${currentUrl.search}`; // Preserves query parameters
  
    // Use the Next.js router to navigate to the updated URL
    router.push(newUrl);
  };

  useEffect(() => {
    localStorage.setItem('lang', lang);
    setCookie('lang', lang, 365)
    setCookie('NEXT_LOCALE', lang, 365); // Set cookie to expire in 365 days
  }, [lang]);



  // useEffect(() => {
  //   const countryCode = new URL(window.location.href).pathname.split('/')[2]; // Assumes country code is the second segment

  //   if (countryCode) {
  //     setCookie('countryCode', countryCode, 365);
  //   }
  // }, [window.location.pathname]); // Depend on asPath to trigger on route changes


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
