/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUSINESS_PHONE: process.env.BUSINESS_PHONE,
    NEXT_PUBLIC_BUSINESS_PHONE_INTL: process.env.BUSINESS_PHONE_INTL,
    NEXT_PUBLIC_BUSINESS_EMAIL: process.env.BUSINESS_EMAIL,
  },
}

module.exports = nextConfig