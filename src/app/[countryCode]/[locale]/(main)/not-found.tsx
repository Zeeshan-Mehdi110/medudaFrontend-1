import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"
import initTranslations from "app/i18n"
import { getLang } from "@lib/data";
export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default async function NotFound({params}: {params: any}) {
  const {locale} = params;
  const { t } = await initTranslations(locale, ['common']);
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">{t("page-not-found")}</h1>
      <p className="text-small-regular text-ui-fg-base">
      {t("page-not-found-info")}
      </p>
      <InteractiveLink href="/">{t("go-to-homepage")}</InteractiveLink>
    </div>
  )
}
