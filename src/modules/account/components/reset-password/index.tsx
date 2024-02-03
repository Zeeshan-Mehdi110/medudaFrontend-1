import React, { useState } from 'react';
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Input from "@modules/common/components/input"
type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}



const ResetPassword = ({ setCurrentView }: Props) => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState(false);

    const handleResetPassword = () => {
        fetch(`https://pixelsjourney/store/customers/password-token`, {
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
        <div className='flex flex-col gap-6 w-3/4 '>
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
            {isSent && !error && <p className='h-14 text-center mt-6 bg-green-200 items-center justify-center flex rounded-lg'>Check your email for the reset link.</p>}
            {!isSent && error && <p className='h-14 text-center mt-6 bg-red-200 items-center justify-center flex rounded-lg'>There was an error, try again later or contact us.</p>}
          
            <button disabled={isSent && !error} className='bg-black text-white w-full mt-6 pt-3 pb-3 rounded-md' onClick={handleResetPassword}>Reset Password</button>
           
         
        </div>
    );
};

export default ResetPassword;
