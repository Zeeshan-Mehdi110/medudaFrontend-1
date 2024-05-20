import { Metadata, ResolvingMetadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import initTranslations from "app/i18n";
import { getSession } from "@lib/data";

type Props = {
  params: { locale: string }

}
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { t } = await initTranslations(params.locale, ['common']);
 const session = await getSession();
  
  return {
    title: session ? t("my-account") :  t("sign-in"),
    description: session ? t("overview-of-your-account-activity") :  t("sign-in-to-view-your-pixels-journey-account"),
  }
}

export default function Login() {

  return <LoginTemplate/>
}
