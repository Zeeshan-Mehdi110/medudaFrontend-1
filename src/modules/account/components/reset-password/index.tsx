import React, { useState } from 'react';
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Input from "@modules/common/components/input"
import { SubmitButton } from '@modules/checkout/components/submit-button';
type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}



const ResetPassword = ({ setCurrentView }: Props) => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState(false);

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
            throw new Error('Failed to send reset email');
          }
        })
        .catch(() => {
          setIsSent(false);
          setError(true);
        });
    };

    return (
        <div className='w-full flex flex-col gap-8 justify-center lg:mr-60 '>
            <h1 className='text-center font-semibold text-xl'>Reset Password</h1>
            <h3 className='text-lg'>Enter your email to receive a password reset link if you have an existing account.</h3>
            <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                title="Enter a valid email address."
                autoComplete="email"
                required
            />
            {isSent && !error && <p className='h-14 text-center mt-6 pr-2 pl-2 bg-green-200 items-center justify-center flex rounded-lg'>Check your email for the reset link.</p>}
            {!isSent && error && <p className='h-14 text-center mt-6 pr-2 pl-2 bg-red-200 items-center justify-center flex rounded-lg'>There was an error, try again later or contact us.</p>}
          
         
            <SubmitButton onClick={handleResetPassword} disabled={isSent && !error} className="w-full mt-6">Reset Password</SubmitButton>
         
        </div>
    );
};

export default ResetPassword;
