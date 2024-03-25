import { ProductVariant } from "@medusajs/medusa"
import { Text } from "@medusajs/ui"
import initTranslations from 'app/i18n';
import { getLang } from '@lib/data';
type LineItemOptionsProps = { variant: ProductVariant,locale:string | string[] }

const LineItemOptions = async({ variant,locale }: LineItemOptionsProps) => {
  const { t } = await initTranslations(locale, ['common']);
  return (
    <Text className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis">
       {t("variant")}: {variant.title}
    </Text>
  )
}

export default LineItemOptions
