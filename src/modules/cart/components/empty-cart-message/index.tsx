import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import initTranslations from 'app/i18n';
import { getLang } from '@lib/data';
export default async function EmptyCartMessage({locale} : {locale:string}): Promise<JSX.Element> {
  const { t } = await initTranslations(locale, ['common']);
  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start">
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {t("cart")}
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
      {t("empty-cart")}
      </Text>
      <div>
        <InteractiveLink locale={locale} href="/store">{t("explore-products")}</InteractiveLink>
      </div>
    </div>
  )
}


