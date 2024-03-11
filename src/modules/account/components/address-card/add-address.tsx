"use client"

import { Region } from "@medusajs/medusa"
import { Plus } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useFormState } from "react-dom"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { addCustomerShippingAddress } from "@modules/account/actions"
import{ useTranslation } from "react-i18next"
const AddAddress = ({ region }: { region: Region }) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)
const { t } = useTranslation();
  const [formState, formAction] = useFormState(addCustomerShippingAddress, {
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <button
        className="border border-ui-border-base rounded-rounded p-5 min-h-[220px] h-full w-full flex flex-col justify-between"
        onClick={open}
      >
        <span className="text-base-semi">{t("new-address")}</span>
        <Plus />
      </button>

      <Modal isOpen={state} close={close}>
        <Modal.Title>
          <Heading className="mb-2">{t("add-address")}</Heading>
        </Modal.Title>
        <form action={formAction}>
          <Modal.Body>
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
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
              </div>
              <Input
                label={t("company")}
                name="company"
                autoComplete="organization"
              />
              <Input
                label={t("address")}
                name="address_1"
                required
                autoComplete="address-line1"
              />
              <Input
                label={t("apartment-suite-etc")}
                name="address_2"
                autoComplete="address-line2"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label={t("postal")}
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                />
                <Input
                  label={t("city")}
                  name="city"
                  required
                  autoComplete="locality"
                />
              </div>
              <Input
                label={t("state/province")}
                name="province"
                autoComplete="address-level1"
              />
              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
              />
              <Input label={t("phone")} name="phone" autoComplete="phone" />
            </div>
            {formState.error && (
              <div className="text-rose-500 text-small-regular py-2">
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10"
              >
                {t("cancel")}
              </Button>
              <SubmitButton>{t("save")}</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress
