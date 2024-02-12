"use client"

import { Button } from "@medusajs/ui"
import React from "react"
import { useFormStatus } from "react-dom"

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
  const { pending } = useFormStatus()

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
  )
}
