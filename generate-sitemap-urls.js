const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });
// const { locales } = require('../newmedusastore-storefront/config/config');

const locales = ["en", "he", "ru"];


async function listRegions() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/regions`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const {regions} = await response.json();
      return regions;
    } catch (error) {
      console.error("Error fetching regions:", error);
      return null;
    }
  }

async function generatePaths() {
  const countryCodes = await listRegions().then((regions) =>
    regions?.map((r) => r.countries.map((c) => c.iso_2)).flat()
  ) ?? [];

  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ;

  const paths = [];

  locales.forEach((locale) => {
    countryCodes.forEach((countryCode) => {
      paths.push({
        href: `${baseUrl}/${countryCode}/${locale}`,
        hreflang: locale,
      });
    });
  });

  return paths;
}

generatePaths().then((paths) => {
  const outputPath = path.join(__dirname, 'sitemap-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(paths, null, 2));
  console.log(`Generated ${paths.length} sitemap URLs`);
}).catch(console.error);
