// import { useFormState } from "react-dom"

// import { LOGIN_VIEW } from "@modules/account/templates/login-template"
// import Input from "@modules/common/components/input"
// import { logCustomerIn } from "@modules/account/actions"
// import ErrorMessage from "@modules/checkout/components/error-message"
// import { SubmitButton } from "@modules/checkout/components/submit-button"
// import { useTranslation } from "react-i18next"

// type Props = {
//   setCurrentView: (view: LOGIN_VIEW) => void
// }

// const Login = ({ setCurrentView }: Props) => {
//   const [message, formAction] = useFormState(logCustomerIn, null)
// const {t} = useTranslation()

//   return (
//     <div className="max-w-sm w-full flex flex-col items-center">
//       <h1 className="text-large-semi uppercase mb-6">{t("profile:title")}</h1>
//       <p className="text-center text-base-regular text-ui-fg-base mb-8">
//       {t("profile:subtitle")}
//       </p>
//       <form className="w-full" action={formAction}>
//         <div className="flex flex-col w-full gap-y-2">
//           <Input
//             label={t("email")}
//             name="email"
//             type="email"
//             title={t("enter-a-valid-email-address")}
//             autoComplete="email"
//             required
//           />
//           <Input
//             label={t("password")}
//             name="password"
//             type="password"
//             autoComplete="current-password"
//             required
//           />
//         </div>
//         <ErrorMessage error={message} />
//         <SubmitButton className="w-full mt-6">{t("sign-in")}</SubmitButton>
//       </form>
//       <span className="text-center w-full text-lg mt-4">{t("or")}</span>
//       <a
//         type="button"
//         href="https://backend.pixelsjourney.com/store/auth/google"
//         className="text-white w-full justify-center ml-0 mr-0 mt-4 bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mb-2"
//       >
//         <svg
//           className="mr-2 -ml-1 w-4 h-4"
//           aria-hidden="true"
//           focusable="false"
//           data-prefix="fab"
//           data-icon="google"
//           role="img"
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 488 512"
//         >
//           <path
//             fill="currentColor"
//             d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
//           ></path>
//         </svg>
//         {t("sign-in-with-google")}
//       </a>
//       <span className="text-center text-ui-fg-base text-small-regular mt-6">
//        {t("password_forgot")}{" "}
//         <button
//           onClick={() => setCurrentView(LOGIN_VIEW.RESET_PASSWORD)}
//           className="underline"
//         >
//           {t("password_reset")}
//         </button>
//         .
//       </span>
//       <span className="text-center text-ui-fg-base text-small-regular mt-6">
//         {t("new-member")}{" "}
//         <button
//           onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
//           className="underline"
//         >
//           {t("join-us")}
//         </button>
//         .
//       </span>
//     </div>
//   )
// }

// export default Login
"use client";
import { useFormState } from "react-dom";
import { LOGIN_VIEW } from "@modules/account/templates/login-template";
import Input from "@modules/common/components/input";
import { logCustomerIn } from "@modules/account/actions";
import ErrorMessage from "@modules/checkout/components/error-message";
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@medusajs/ui";
import React from "react";
import { useFormStatus } from "react-dom";
import axios from "axios";
import { Toaster,toast } from "react-hot-toast";
import { useParams } from "next/navigation";

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void;
};

const Login = ({ setCurrentView }: Props) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "undefined"}>
      <LoginWithReCaptcha setCurrentView={setCurrentView} />
    </GoogleReCaptchaProvider>
  );
};

const LoginWithReCaptcha = ({ setCurrentView }: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  if (!executeRecaptcha) {
    return <div>Loading...</div>;
  }

  return <LoginForm setCurrentView={setCurrentView} executeRecaptcha={executeRecaptcha} />;
};

const LoginForm = ({ setCurrentView, executeRecaptcha }: Props & { executeRecaptcha: any }) => {
  const [message, formAction] = useFormState(logCustomerIn, null);
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { pending } = useFormStatus();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
  const {locale} = useParams();
  const isRtl = locale === "he" || locale === "ar"
  const handleVerify = async () => {
    try {
      const gRecaptchaToken = await executeRecaptcha("loginSubmit");
      if(gRecaptchaToken){
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/contactUs`,
            {
              gRecaptchaToken: gRecaptchaToken,
            },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
    
          if (response.data.status === "success") {
            toast.success("success!");
            setRecaptchaToken(gRecaptchaToken);
            setSubmitEnabled(true);
          } else {
            console.error(`Registration failure with score: ${response.data.score}`);
            setError("Something went wrong, please try again later");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
        }

      } // Enable the submit button
    } catch (error) {
      setError("ReCAPTCHA validation failed. Please try again.");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setError("Please verify the reCAPTCHA.");
      return;
    }

    // Add the token to the form data before submitting
    const formData = new FormData(e.target);
    formData.append('gRecaptchaToken', recaptchaToken);

    try {
      await formAction(formData);
    } catch (err) {
      setError("Something went wrong, please try again later");
    }
  };

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
        <Toaster
        toastOptions={{
          className: "",
          style: {
            border: "1px solid black",
            padding: "16px",
            width: "250px",
            height: "auto",
            backgroundColor: "white-smoke",
            textAlign: isRtl ? "right" : "left",
          },
        }}
        position={`bottom-${isRtl ? "right" : "left"}`}
      />
      <h1 className="text-large-semi uppercase mb-6">{t("profile:title")}</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {t("profile:subtitle")}
      </p>
      <form className="w-full" onSubmit={handleSubmit}>
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
        <ErrorMessage error={message || error} />
        {!submitEnabled && <DummyReCaptcha onVerify={handleVerify} />}
        <SubmitButton className="w-full mt-6" disabled={!submitEnabled}>
          {t("sign-in")}
        </SubmitButton>
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
  );
};

type DummyReCaptchaProps = {
  onVerify: () => void;
};

const DummyReCaptcha: React.FC<DummyReCaptchaProps> = ({ onVerify }) => {
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
    onVerify();
  };

  return (
    <div style={{ position: 'relative', height: '78px', margin: '10px 0' }}>
      {verified ? (
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, background: '#f9f9f9', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4caf50' }}>
          Verified!
        </div>
      ) : (
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, background: '#fff', border: '1px solid #ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleVerify}>
          <div style={{ display: 'flex', alignItems: 'center',gap:'17px' }}>
            <input type="checkbox" style={{ marginRight: '10px',width:'1rem',height:'1rem' }} />
            <span style={{ color: '#555', fontSize: '14px' }}>I&apos;m not a robot</span>
            <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA logo" style={{ marginLeft: '10px' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export function SubmitButton({
  children,
  variant = "primary",
  className,
  onClick,
  disabled // Added onClick prop here
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "transparent" | "danger" | null;
  className?: string;
  onClick?: () => void;
  disabled?: boolean // Define onClick as an optional prop that is a function returning void
}) {
  const { pending } = useFormStatus();
  
  return (
    <Button
      size="large"
      className={className}
      type="submit"
      isLoading={pending}
      variant={variant}
      onClick={onClick}
      disabled={disabled}// Pass onClick prop to Button component
    >
      {children}
    </Button>
  );
}

export default Login;