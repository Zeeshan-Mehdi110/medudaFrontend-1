import { Metadata, ResolvingMetadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import initTranslations from "app/i18n";

type Props = {
  params: { locale: string }

}
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { t } = await initTranslations(params.locale, ['common']);
 
  return {
    title: t("sign-in"),
    description: t("sign-in-to-view-your-pixels-journey-account"),
  }
}

export default function Login() {

  return <LoginTemplate/>
}
