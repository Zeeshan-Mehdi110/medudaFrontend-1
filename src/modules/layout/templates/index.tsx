import React from "react"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

const Layout: React.FC<{
  children: React.ReactNode,
  params: { locale: string }
}> = ({ children,params }) => {
  const { locale } = params;
  return (
    <div>
      <Nav />
      <main className="relative">{children}</main>
      <Footer locale={locale} />
    </div>
  )
}

export default Layout
