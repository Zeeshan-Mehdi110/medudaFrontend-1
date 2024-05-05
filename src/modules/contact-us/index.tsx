// "use client"
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Button } from "@medusajs/ui"

// const ContactUs = () => {
//   const [messageSent, setMessageSent] = useState(false);
//   const { t } = useTranslation();

//   const sendEmail = async (e:any) => {
//     e.preventDefault();

//     const formData = new FormData(e.target);
//     const data = {
//       name: formData.get('name'),
//       email: formData.get('email'),
//       message: formData.get('message'),
//     };

//     // Remember to replace '{yourFormId}' with your actual Formspree form ID
//     const response = await fetch('https://formspree.io/f/meqwpwbb', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       setMessageSent(true);
//     } else {
//       console.error('Error sending message');
//     }

//     e.target.reset();
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 dark:text-white text-black">
//       <h2 className="text-xl font-semibold text-center mb-4">{t('contact-us-title')}</h2>
//       {messageSent ? (
//         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
//           <p>{t('contact-us-success-message')}</p>
//         </div>
//       ) : (
//         <p className="mb-4">{t('contact-us-description')}</p>
//       )}
//       <form onSubmit={sendEmail} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block dark:text-white text-sm font-medium text-gray-700">{t('name')}</label>
//           <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-2 text-gray-900 h-8 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
//         </div>
//         <div>
//           <label htmlFor="email" className="block  dark:text-white text-sm font-medium text-gray-700">{t('email')}</label>
//           <input type="email" name="email" id="email" required className="mt-1 block w-full border-2 rounded-md text-gray-900 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 sm:text-sm"/>
//         </div>
//         <div>
//           <label htmlFor="message" className="block dark:text-white text-sm font-medium text-gray-700">{t('contact-us-message')}</label>
//           <textarea name="message" id="message" rows={3} required className="mt-1 block w-full text-gray-900 border-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
//         </div>
//         {/* <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        
//         </button> */}
//         <div className='w-full flex justify-center items-center'>
//         <Button type='submit' className='min-w-[150px]'>{t('send')}</Button>
//         </div>

//       </form>
//     </div>
//   );
// };

// export default ContactUs;

"use client"
import { useFormState } from "react-dom"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { signUp } from "@modules/account/actions"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "react-i18next"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import axios from "axios"
import { FormEvent, useState } from "react"

interface Props {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(signUp, null)
  const [error, setError] = useState<string | null>(null)
  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formElements = e.currentTarget
      .elements as typeof e.currentTarget.elements & {
      register_first_name: HTMLInputElement
      register_last_name: HTMLInputElement
      register_email: HTMLInputElement
      register_phone: HTMLInputElement
      register_password: HTMLInputElement
    }

    let formData = new FormData() // Initialize the FormData object
    formData.append("first_name", formElements.register_first_name.value)
    formData.append("last_name", formElements.register_last_name.value)
    formData.append("email", formElements.register_email.value)
    formData.append("phone", formElements.register_phone.value)
    formData.append("password", formElements.register_password.value)

    if (!executeRecaptcha) {
      console.error("ReCAPTCHA not available")
      return
    }

    const gRecaptchaToken = await executeRecaptcha("registerSubmit")

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/contactUs`,
        {
          ...formData,
          gRecaptchaToken,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      console.log("Recaptcha response:", response)

      if (response.data.status === "success") {
        console.log(`Registration success with score: ${response.data.score}`)
        formAction(formData) // Now passing formData to formAction
      } else {
        console.error(`Registration failure with score: ${response.data.score}`)
        setError("Something went wrong, please try again later")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const { t } = useTranslation()
  return (
    <div className="max-w-sm flex flex-col items-center">
      <h1 className="text-large-semi uppercase mb-6">
        {t("become-pixels-journey-member")}
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        {t("create-pixels-journey-profile")}
      </p>
      <form className="w-full flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            id="register_first_name"
            label={t("first-name")}
            name="first_name"
            required
            autoComplete="given-name"
          />
          <Input
            id="register_last_name"
            label={t("last-name")}
            name="last_name"
            required
            autoComplete="family-name"
          />
          <Input
            id="register_email"
            label={t("email")}
            name="email"
            required
            type="email"
            autoComplete="email"
          />
          <Input
            id="register_phone"
            label={t("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
          />
          <Input
            id="register_password"
            label={t("password")}
            name="password"
            required
            type="password"
            autoComplete="new-password"
          />
        </div>
        <ErrorMessage error={message} />
        <ErrorMessage error={error} />
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