import { getLang } from "@lib/data";
import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import initTranslations from "app/i18n"
export default async function SignInPrompt({locale} : {locale:string}): Promise<JSX.Element> {

  const { t } = await initTranslations(locale, ['common']);
  return (
    <div className="bg-white dark:bg-black flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
        {t("already-have-an-account")}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
        {t("sign-in-for-a-better-experience")}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10">
          {t("sign-in")}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}


