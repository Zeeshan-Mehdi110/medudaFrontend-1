import { Metadata } from "next"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}
type NavProps = {
  children?: React.ReactNode;
  params: { locale: string }
};
export default async function PageLayout(props: { children: React.ReactNode,params: { locale: string}}) {
  return (
    <>
      <Nav> {props.params.locale}</Nav>
      {props.children}
      <Footer locale={props.params.locale} />
    </>
  )
}
