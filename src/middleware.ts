
import { Region } from "@medusajs/medusa"
import { set } from "lodash";
import { NextRequest, NextResponse } from "next/server"
import {i18nRouter} from 'next-i18n-router';
import i18nConfig from '../i18nConfig';
import createMiddleware from 'next-intl/middleware';
import { is } from "cypress/types/bluebird";
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */

const locales = ['en', 'he', 'ru'];

 const nextIntl =  createMiddleware({
  locales: locales,

  defaultLocale: 'en'
});


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

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {

  var t = nextIntl(request);
  const searchParams = request.nextUrl.searchParams
  const isOnboarding = searchParams.get("onboarding") === "true"
  const onboardingCookie = request.cookies.get("_medusa_onboarding")
  const regionMap = await listCountries()
  let s = request.cookies.get("NEXT_LOCALE")?.value ?? "he";
  s = locales.includes(s) ? s : "he";
  let countryCode = regionMap && (await getCountryCode(request, regionMap))
  const isDiffCountryCode = request.nextUrl.pathname.split("/")[2]?.toLowerCase();
  countryCode = isDiffCountryCode && regionMap?.has(isDiffCountryCode) && isDiffCountryCode !== countryCode ? isDiffCountryCode : countryCode;
  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[2]?.includes(countryCode)

  // check if one of the country codes is in the url
  if (urlHasCountryCode && (!isOnboarding || onboardingCookie)) {

    return NextResponse.next()
  }

  let response = NextResponse.redirect(request.nextUrl, 307)

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    const pathSegments = request.nextUrl.pathname.split('/');
    pathSegments.splice(0, 2);
    const newPathname = '/' + pathSegments.join('/');
    const redirectPath =
    newPathname === "/" ? "" : newPathname
 
  

    response = redirectPath === "" ?  NextResponse.redirect(
      `${request.nextUrl.origin}/${s}/${countryCode}`,
      307
    ) : NextResponse.redirect(
      `${request.nextUrl.origin}/${s}/${countryCode}/${redirectPath}`,
      307
    )

  }

  // Set a cookie to indicate that we're onboarding. This is used to show the onboarding flow.
  if (isOnboarding) {
    response.cookies.set("_medusa_onboarding", "true", { maxAge: 60 * 60 * 24 })
  }

  return response;
}

export const config = {
   matcher: [
    // Exclude specific paths
    "/((?!api|_next/static|favicon.ico).*)",
    // Include root and paths starting with specific locales
    "/",
    "/(en|he|ru)/:path*"
  ],
}


