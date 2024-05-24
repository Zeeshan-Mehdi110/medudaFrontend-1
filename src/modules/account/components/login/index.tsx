import { useFormState } from "react-dom"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Input from "@modules/common/components/input"
import { logCustomerIn } from "@modules/account/actions"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { useTranslation } from "react-i18next"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(logCustomerIn, null)
const {t} = useTranslation()

  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "undefined"}>
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="text-large-semi uppercase mb-6">{t("profile:title")}</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
      {t("profile:subtitle")}
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t("email")}
            name="email"
            type="email"
            title={t("enter-a-valid-email-address")}
            autoComplete="email"
            required
          />
          <Input
            label={t("password")}
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <ErrorMessage error={message} />
        <SubmitButton className="w-full mt-6">{t("sign-in")}</SubmitButton>
      </form>
      <span className="text-center w-full text-lg mt-4">{t("or")}</span>
      <a
        type="button"
        href="https://backend.pixelsjourney.com/store/auth/google"
        className="text-white w-full justify-center ml-0 mr-0 mt-4 bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mb-2"
      >
        <svg
          className="mr-2 ml-2 w-4 h-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        {t("sign-in-with-google")}
      </a>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
       {t("password_forgot")}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.RESET_PASSWORD)}
          className="underline"
        >
          {t("password_reset")}
        </button>
        .
      </span>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {t("new-member")}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
        >
          {t("join-us")}
        </button>
        .
      </span>
    </div>
    </GoogleReCaptchaProvider>
  )
}

export default Login
