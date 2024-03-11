"use client"

import { useFormState } from "react-dom"

import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { signUp } from "@modules/account/actions"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import{ useTranslation } from "react-i18next"
type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(signUp, null)
const { t } = useTranslation();
  return (
    <div className="max-w-sm flex flex-col items-center">
      <h1 className="text-large-semi uppercase mb-6">
      {t("become-pixels-journey-member")}
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
      {t("create-pixels-journey-profile")}
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t("first-name")}
            name="first_name"
            required
            autoComplete="given-name"
          />
          <Input
            label={t("last-name")}
            name="last_name"
            required
            autoComplete="family-name"
          />
          <Input
            label={t("email")}
            name="email"
            required
            type="email"
            autoComplete="email"
          />
          <Input label={t("phone")} name="phone" type="tel" autoComplete="tel" />
          <Input
            label={t("password")}
            name="password"
            required
            type="password"
            autoComplete="new-password"
          />
        </div>
        <ErrorMessage error={message} />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {t("account-creation-agreement")}{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            {t("privacy-policy")}
          </LocalizedClientLink>{" "}
          {t("and")}{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            {t("terms-of-use")}
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6">{t("join-us")}</SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
      {t("already-have-an-account")}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          {t("sign-in")}
        </button>
        .
      </span>
    </div>
  )
}

export default Register
