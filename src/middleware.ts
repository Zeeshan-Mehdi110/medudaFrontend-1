// import { Region } from "@medusajs/medusa"
// import { NextRequest, NextResponse } from "next/server"
// import createMiddleware from "next-intl/middleware"

// const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
// const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

// /**
//  * Fetches regions from Medusa and sets the region cookie.
//  * @param request
//  * @param response
//  */

// const locales = ["en", "he", "ru"]

// const nextIntl = createMiddleware({
//   locales: locales,

//   defaultLocale: "en",
// })

// async function getCountryCode(
//   request: NextRequest,
//   regionMap: Map<string, Region>
// ) {
//   try {
//     let countryCode

//     const vercelCountryCode = request.headers
//       .get("x-vercel-ip-country")
//       ?.toLowerCase()

//     const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

//     if (urlCountryCode && regionMap.has(urlCountryCode)) {
//       countryCode = urlCountryCode
//     } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
//       countryCode = vercelCountryCode
//     } else if (regionMap.has(DEFAULT_REGION)) {
//       countryCode = DEFAULT_REGION
//     } else if (regionMap.keys().next().value) {
//       countryCode = regionMap.keys().next().value
//     }

//     return countryCode
//   } catch (error) {
//     if (process.env.NODE_ENV === "development") {
//       console.error(
//         "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
//       )
//     }
//   }
// }

// async function listCountries() {
//   try {
//     // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
//     const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
//       next: {
//         revalidate: 3600,
//         tags: ["regions"],
//       },
//     }).then((res) => res.json())

//     // Create a map of country codes to regions.
//     const regionMap = new Map<string, Region>()

//     regions.forEach((region: Region) => {
//       region.countries.forEach((c) => {
//         regionMap.set(c.iso_2, region)
//       })
//     })

//     return regionMap
//   } catch (error) {
//     if (process.env.NODE_ENV === "development") {
//       console.error(
//         "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
//       )
//     }
//   }
// }

// /**
//  * Middleware to handle region selection and onboarding status.
//  */
// export async function middleware(request: NextRequest) {
//   let t = nextIntl(request)
//   const searchParams = request.nextUrl.searchParams
//   const isOnboarding = searchParams.get("onboarding") === "true"
//   const onboardingCookie = request.cookies.get("_medusa_onboarding")

//   const regionMap = await listCountries()

//   let countryCode = regionMap && (await getCountryCode(request, regionMap))
//   const isDiffCountryCode = request.nextUrl.pathname
//     .split("/")
//     .filter(Boolean)[1]
//     ?.toLowerCase()
//   countryCode =
//     isDiffCountryCode &&
//     regionMap?.has(isDiffCountryCode) &&
//     isDiffCountryCode !== countryCode
//       ? isDiffCountryCode
//       : countryCode
//   const locale = request.cookies.get("NEXT_LOCALE")?.value ?? "he"
//   const urlHasCountryCode =
//     countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)
//   const urlHasLocale = locale && request.nextUrl.pathname?.split("/")[2]?.length

//   if (
//     urlHasCountryCode &&
//     urlHasLocale &&
//     (!isOnboarding || onboardingCookie)
//   ) {
//     return NextResponse.next()
//   }

//   let response = NextResponse.redirect(request.nextUrl, 307)

//   if (!urlHasLocale || !urlHasCountryCode) {
//     const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean)

//     const hasCorrectStructure =
//       pathSegments.length >= 2 &&
//       pathSegments[0] === countryCode &&
//       pathSegments[1] === locale

//     if (!hasCorrectStructure) {
//       if (pathSegments[0] !== countryCode) {
//         pathSegments.unshift(countryCode)
//       }

//       if (pathSegments[1] !== locale) {
//         pathSegments.splice(1, 0, locale) // This removes the need to check separately for urlHasLocale and urlHasCountryCode
//       }
//       // If extra locale or countryCode are present beyond their initial correct positions, consider removing or adjusting the logic to prevent duplication

//       // Reconstruct the pathname
//       const newPathname = `/${pathSegments.join("/")}`

//       // Redirect to the new URL with correct countryCode and locale
//       response = NextResponse.redirect(
//         `${request.nextUrl.origin}${newPathname}`,
//         307
//       )
//     }
//   }

//   // Set a cookie to indicate that we're onboarding. This is used to show the onboarding flow.
//   if (isOnboarding) {
//     response.cookies.set("_medusa_onboarding", "true", { maxAge: 60 * 60 * 24 })
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     // Exclude specific paths
//     // "/((?!api|_next/static|favicon.ico).*)",
//     "/((?!api|static|.*\\..*|_next).*)",
//     // Include root and paths starting with specific locales
//      "/"
//     // "/(en|he|ru)/:path*"
//   ],
// }

import { Region } from "@medusajs/medusa"
import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */

const locales = ["en", "he", "ru"]

const nextIntl = createMiddleware({
  locales: locales,

  defaultLocale: "en",
})

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, Region>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

async function listCountries() {
  try {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      next: {
        revalidate: 3600,
        tags: ["regions"],
      },
    }).then((res) => res.json())

    // Create a map of country codes to regions.
    const regionMap = new Map<string, Region>()

    regions.forEach((region: Region) => {
      region.countries.forEach((c) => {
        regionMap.set(c.iso_2, region)
      })
    })

    return regionMap
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error fetching regions. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

// const getCountryFromIP = async () => {
//   try {
//     const response = await axios.get('https://ipapi.co/json/');
//     return response.data.country.toLowerCase(); // or response.data.country_code
//   } catch (error) {
//     console.error('Error fetching geolocation data:', error);
//     return null;
//   }
// };
/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  let t = nextIntl(request)
  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get("onboarding") === "true"
  const onboardingCookie = request.cookies.get("_medusa_onboarding")

  const regionMap = await listCountries()
  let countryCode = regionMap && (await getCountryCode(request, regionMap))
  const isDiffCountryCode = request.nextUrl.pathname
    .split("/")
    .filter(Boolean)[1]
    ?.toLowerCase()
  countryCode =
    isDiffCountryCode &&
    regionMap?.has(isDiffCountryCode) &&
    isDiffCountryCode !== countryCode
      ? isDiffCountryCode
      : countryCode
  const locale = (request.cookies.get("NEXT_LOCALE")?.value && locales.includes(request.cookies.get("NEXT_LOCALE")?.value as string)) ? request.cookies.get("NEXT_LOCALE")?.value as string :  "he";
  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)
  const urlHasLocale = locale && request.nextUrl.pathname?.split("/")[2]?.length

  if (
    urlHasCountryCode &&
    urlHasLocale &&
    (!isOnboarding || onboardingCookie)
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.redirect(request.nextUrl, 307)

  if (!urlHasLocale || !urlHasCountryCode) {
    const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean)

    const hasCorrectStructure =
      pathSegments.length >= 2 &&
      pathSegments[0] === countryCode &&
      pathSegments[1] === locale

    if (!hasCorrectStructure) {
      if (pathSegments[0] !== countryCode) {
        pathSegments.unshift(countryCode)
      }

      if (pathSegments[1] !== locale) {
        pathSegments.splice(1, 0, locale) // This removes the need to check separately for urlHasLocale and urlHasCountryCode
      }
      // If extra locale or countryCode are present beyond their initial correct positions, consider removing or adjusting the logic to prevent duplication

      // Reconstruct the pathname
      const queryParamsString = searchParams.toString();

      // Reconstruct the pathname with the query parameters
      const newPathname = `/${pathSegments.join("/")}${queryParamsString ? `?${queryParamsString}` : ''}`;

      // Redirect to the new URL with correct countryCode and locale
      response = NextResponse.redirect(
        `${request.nextUrl.origin}${newPathname}`,
        307
      )
    }
  }

  // Set a cookie to indicate that we're onboarding. This is used to show the onboarding flow.
  if (isOnboarding) {
    response.cookies.set("_medusa_onboarding", "true", { maxAge: 60 * 60 * 24 })
  }

  return response
}

export const config = {
  matcher: [
    // Exclude specific paths
    // "/((?!api|_next/static|favicon.ico).*)",
    "/((?!api|static|.*\\..*|_next).*)",
    // Include root and paths starting with specific locales
    // "/(en|he|ru)/:path*"
  ],
}
