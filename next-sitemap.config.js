/** @type {import('next-sitemap').IConfig} */

const excludedPaths = ["/checkout", "/account/*"]
const fs = require('fs');
const path = require('path');
const urlsPath = path.join(__dirname, 'sitemap-urls.json');
const paths = JSON.parse(fs.readFileSync(urlsPath, 'utf-8'));

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
  generateRobotsTxt: true,
  exclude: [...excludedPaths, "/[sitemap]"],
  additionalPaths: async (config) => {
    return paths.map((path) => ({
      loc: path.href,
      changefreq: 'daily',
      priority: 0.7,
      hreflang: path.hreflang,
    }));
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: excludedPaths,
      },
    ],
  },
}
