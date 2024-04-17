
"use client"
import React, { useState } from 'react';
import { useFormState } from "react-dom"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Input from "@modules/common/components/input"
import { logCustomerIn } from "@modules/account/actions"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Medusa from "@medusajs/medusa-js"
import { useTranslation } from "react-i18next"
import { Button } from '@medusajs/ui';
type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}



const ResetPassword = ({ setCurrentView }: Props) => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState(false);
    const { t } = useTranslation()
    const handleResetPassword = () => {
        fetch(`https://medudabackend-production.up.railway.app/store/customers/password-token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })
        .then((response) => {
          if (response.ok) {
            setEmail("");
            setIsSent(true);
            setError(false);
          } else {
            throw new Error(t("failed-to-send-reset-email"));
          }
        })
        .catch(() => {
          setIsSent(false);
          setError(true);
        });
    };

    return (
        <div className='flex flex-col gap-6 w-3/4 '>
            <h1 className='text-center font-semibold text-xl'>{t("password_reset")}</h1>
            <h3 className='text-lg'>{t("enter-email-for-password-reset")}</h3>
            <Input
                label={t("email")}
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                title={t("enter-a-valid-email-address")}
                autoComplete="email"
                required
            />
            {isSent && !error && <p className='h-14 text-center mt-6 bg-green-200 items-center justify-center flex rounded-lg'> {t("check-email-reset-link")}</p>}
            {!isSent && error && <p className='h-14 text-center mt-6 bg-red-200 items-center justify-center flex rounded-lg'> {t("error-try-again-contact")}</p>}
          
            <Button variant={"primary"} disabled={isSent && !error} className=' w-full mt-6 pt-3 pb-3 rounded-md' onClick={handleResetPassword}>{t("password_reset")}</Button>
           
         
        </div>
    );
};

export default ResetPassword;
