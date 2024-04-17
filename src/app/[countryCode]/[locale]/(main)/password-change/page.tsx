"use client"
import React, { useState } from 'react';
import UnderlineLink from "@modules/common/components/interactive-link"
import Input from "@modules/common/components/input"
import { SubmitButton } from "@modules/checkout/components/submit-button";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@medusajs/ui';

export default function PasswordChange() {
  const { t } = useTranslation();
  const searchParams = useSearchParams() 
  const token = searchParams.get('token')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isErr, setIsErr] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsErr(true);
      return;
    }


    fetch(`https://medudabackend-production.up.railway.app/store/customers/password-reset`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim(),
        token,
      }),
    })
    .then(response => {
      if (response.ok) {
        setMessage("Password successfully changed. Please log in with your new password.");
        setIsErr(false);
        setIsSuccess(true);
      } else {
        setMessage("Failed to change password. Please try again or contact support.");
        setIsErr(true);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage("An error occurred. Please try again later.");
      setIsErr(true);
    });
  };

  return (
    <>
    <div className="w-full flex justify-center">
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4 mb-6">
      <h1 className="text-xl font-semibold mt-9">{t("password_choose")}:</h1>
      <label htmlFor="email">{t("email")}:</label>
      <Input
       id="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       label={t("email")}
       name="Email"
       type="email"
       title="Email"
       autoComplete="Email"
       required
      />
      <label htmlFor="new-password">{t("password_new")}:</label>
      <Input
       id="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       label={t("password_new")}
       name="New password"
       type="password"
       title="New password"
       autoComplete="password"
       required
      />
       <label htmlFor="new-password">{t("password_confirm")}:</label>
      <Input
        id="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label={t("password_confirm")}
        name="Confirm new password"
        type="password"
        title="Confirm new password"
        autoComplete="password"
        required
      />
       {message && (
  <p className={isErr ? "text-red-500" : "text-green-500"} style={{maxWidth:'224px',textAlign:'center'}}>{message}</p>
)}
      {isSuccess ? (
        // <a className="bg-black text-white w-full mt-6 pt-3 pb-3 rounded-md text-center" href='/account'>Go to Homepage</a>
       
        <Button onClick={() => router.push('/account')} variant={"primary"}>{t("back-to-login-page")}</Button>
      ) : (
        <SubmitButton variant={"primary"} onClick={() => setMessage('')} disabled={isSuccess} className="w-full mt-6">Reset Password</SubmitButton>
      )}
    </form>
 
    </div>
    <section className="w-full flex justify-center">
    <div className="flex w-2/4  flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4">{t("got-questions")}</h3>
            <span className="txt-medium">
            {t("frequently-asked-questions")}
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
            {t("customer-service")}
            </UnderlineLink>
          </div>
        </div>
        </section>
    </>
  );
}


