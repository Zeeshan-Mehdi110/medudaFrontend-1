import { Metadata } from "next"
export const dynamic = "force-dynamic"

import "styles/globals.css"
// import { Next, useMessages } from 'next-intl';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  // const { params } = props;
  // const messages = useMessages();
  return (
    // <html lang="en" data-mode="light">

    //   <body className="dark:bg-black">
    //     <main className="relative ">{props.children}</main>
    //   </body>

    // </html>
    <>{props.children}</>
  )
}
