const { withStoreConfig } = require("./store-config")
const store = require("./store.config.json")

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withStoreConfig({
  features: store.features,
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      // {
      //   protocol: "https",
      //   hostname:"https://pixelsjourney.fra1.digitaloceanspaces.com",
      // },
    ],
    domains: [
      'pixelsjourney.fra1.digitaloceanspaces.com','res.cloudinary.com' , 'imagedelivery.net'
    ],
  },
})

console.log("next.config.js", JSON.stringify(module.exports, null, 2))

module.exports = nextConfig
