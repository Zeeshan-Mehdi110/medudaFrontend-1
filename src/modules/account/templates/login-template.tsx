"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import ResetPassword from "@modules/account/components/reset-password"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  RESET_PASSWORD = "reset-password",
  CHOOSE_NEW_PASSWORD = "choose-new-password"
}

const LoginTemplate = () => {
   
  
  const [currentView, setCurrentView] = useState('sign-in')

  return (
    <div className="w-full flex justify-center px-8 py-8">
    {currentView === "sign-in" ? (
      <Login setCurrentView={setCurrentView} />
    ) : currentView === "reset-password" ? (
      <ResetPassword setCurrentView={setCurrentView} />
    ) : currentView === "register" ? (
      <Register setCurrentView={setCurrentView} />
    ) : null}
    </div>
  )
}

export default LoginTemplate
