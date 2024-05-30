"use server"

import {
  addShippingAddress,
  authenticate,
  createCustomer,
  deleteShippingAddress,
  getToken,
  updateCustomer,
  updateShippingAddress,
} from "@lib/data"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import {
  Customer,
  StorePostCustomersCustomerAddressesAddressReq,
  StorePostCustomersCustomerAddressesReq,
  StorePostCustomersCustomerReq,
  StorePostCustomersReq,
} from "@medusajs/medusa"
import axios from "axios"

// export async function signUp(_currentState: unknown, formData: FormData) {
//   const customer = {
//     email: formData.get("email"),
//     password: formData.get("password"),
//     first_name: formData.get("first_name"),
//     last_name: formData.get("last_name"),
//     phone: formData.get("phone"),
//   } as StorePostCustomersReq

//   try {
//     await createCustomer(customer)
//     await getToken({ email: customer.email, password: customer.password }).then(
//       () => {
//         revalidateTag("customer")
//       }
//     )
//   } catch (error: any) {
//     return error.toString()
//   }
// }
export async function signUp(_currentState: unknown, formData: FormData) {
  const customer = {
    email: formData.get("email"),
    password: formData.get("password"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    phone: formData.get("phone"),
  } as StorePostCustomersReq

  const gRecaptchaToken = formData.get("gRecaptchaToken") as any


  if (gRecaptchaToken) {
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
      )

      if (response.data.status === "success") {
        try {
          await createCustomer(customer)
          await getToken({ email: customer.email, password: customer.password }).then(
            () => {
              revalidateTag("customer")
            }
          )
        } catch (error: any) {
          return error.toString()
        }
      } else {
        console.error(`Registration failure with score: ${response.data.score}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }
}
// export async function logCustomerIn(
//   _currentState: unknown,
//   formData: FormData
// ) {
//   const email = formData.get("email") as string
//   const password = formData.get("password") as string

//   try {
//     await getToken({ email, password }).then(() => {
//       revalidateTag("customer")
//     })
//   } catch (error: any) {
//     return error.toString()
//   }
// }


export async function logCustomerIn(
  _currentState: unknown,
  formData: FormData,
) {

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const gRecaptchaToken = formData.get("gRecaptchaToken") as any


  if (gRecaptchaToken) {
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
      )

      if (response.data.status === "success") {
        try {
          await getToken({ email, password }).then(() => {
            revalidateTag("customer")
          })
        } catch (error: any) {
          console.log(error.toString())
          return error.toString()
        }
      } else {
        console.error(`Registration failure with score: ${response.data.score}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }
}

export async function updateCustomerName(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
  } as StorePostCustomersCustomerReq

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag("customer")
    })
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function updateCustomerEmail(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    email: formData.get("email"),
  } as StorePostCustomersCustomerReq

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag("customer")
    })
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function updateCustomerPhone(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    phone: formData.get("phone"),
  } as StorePostCustomersCustomerReq

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag("customer")
    })
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function updateCustomerPassword(
  currentState: {
    customer: Omit<Customer, "password_hash">
    success: boolean
    error: string | null
  },
  formData: FormData
) {
  const email = currentState.customer.email as string
  const new_password = formData.get("new_password") as string
  const old_password = formData.get("old_password") as string
  const confirm_password = formData.get("confirm_password") as string

  const isValid = await authenticate({ email, password: old_password })
    .then(() => true)
    .catch(() => false)

  if (!isValid) {
    return {
      customer: currentState.customer,
      success: false,
      error: "Old password is incorrect",
    }
  }

  if (new_password !== confirm_password) {
    return {
      customer: currentState.customer,
      success: false,
      error: "Passwords do not match",
    }
  }

  try {
    await updateCustomer({ password: new_password }).then(() => {
      revalidateTag("customer")
    })

    return {
      customer: currentState.customer,
      success: true,
      error: null,
    }
  } catch (error: any) {
    return {
      customer: currentState.customer,
      success: false,
      error: error.toString(),
    }
  }
}

export async function addCustomerShippingAddress(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    address: {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      company: formData.get("company") as string,
      address_1: formData.get("address_1") as string,
      address_2: formData.get("address_2") as string,
      city: formData.get("city") as string,
      postal_code: formData.get("postal_code") as string,
      province: formData.get("province") as string,
      country_code: formData.get("country_code") as string,
      phone: formData.get("phone") as string,
    },
  } as StorePostCustomersCustomerAddressesReq

  try {
    await addShippingAddress(customer).then(() => {
      revalidateTag("customer")
    })
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function updateCustomerShippingAddress(
  currentState: Record<string, unknown>,
  formData: FormData
) {
  const addressId = currentState.addressId as string

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    company: formData.get("company") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
  } as StorePostCustomersCustomerAddressesAddressReq

  try {
    await updateShippingAddress(addressId, address).then(() => {
      revalidateTag("customer")
    })
    return { success: true, error: null, addressId }
  } catch (error: any) {
    return { success: false, error: error.toString(), addressId }
  }
}

export async function deleteCustomerShippingAddress(addressId: string) {
  try {
    await deleteShippingAddress(addressId).then(() => {
      revalidateTag("customer")
    })
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function updateCustomerBillingAddress(
  _currentState: Record<string, unknown>,
  formData: FormData
) {
  const customer = {
    billing_address: {
      first_name: formData.get("billing_address.first_name"),
      last_name: formData.get("billing_address.last_name"),
      company: formData.get("billing_address.company"),
      address_1: formData.get("billing_address.address_1"),
      address_2: formData.get("billing_address.address_2"),
      city: formData.get("billing_address.city"),
      postal_code: formData.get("billing_address.postal_code"),
      province: formData.get("billing_address.province"),
      country_code: formData.get("billing_address.country_code"),
      phone: formData.get("billing_address.phone"),
    },
  } as StorePostCustomersCustomerReq

  try {
    await updateCustomer(customer).then(() => {
      revalidateTag("customer")
    })
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function signOut() {
  cookies().set("_medusa_jwt", "", {
    maxAge: -1,
  })
  
  const countryCode = headers().get("next-url")?.split("/")[1] || ""
  const locale = headers().get("next-url")?.split("/")[2] || ""
  revalidateTag("auth")
  revalidateTag("customer")
  redirect(`/${countryCode}/${locale}/account`)
}
// export async function signOut(): Promise<void> {
//   // Specify the same domain and path as when the cookie was set
//   const cookieOptions = {
//     domain: ".pixelsjourney.com", // Use the common root domain
//     path: "/", // Ensure the cookie is valid for all paths
//     secure: true, // Ensure the cookie is only sent over HTTPS
//     sameSite: "strict" as "strict" | "lax" | "none", // Adjust SameSite attribute to lowercase
//   };

//   // Delete the cookie with the specified options by setting its expiry date in the past
//   cookies().set("_medusa_jwt", "", {
//     ...cookieOptions,
//     expires: new Date(0), // Expire the cookie immediately
//   });

//   // Alternatively, use the delete method with the specified options
//   cookies().delete("_medusa_jwt");

//   const nextUrl = headers().get("next-url");
//   const countryCode = nextUrl?.split("/")[1] || "";
//   const locale = nextUrl?.split("/")[2] || "";

//   // Revalidate tags related to authentication and customer
//   revalidateTag("auth");
//   revalidateTag("customer");

//   // Redirect the user to the account page
//   redirect(`/${countryCode}/${locale}/account`);
// }

// export async function signOut(): Promise<void> {
// console.log("removing cookie" , cookies().get("_medusa_jwt"));
//   // Delete the cookie with the specified options by setting its expiry date in the past
//   cookies().set("_medusa_jwt", "", {
//         maxAge: -1,
//       })

//       console.log("removed cookie" , cookies().get("_medusa_jwt"));

//   const nextUrl = headers().get("next-url");
//   const countryCode = nextUrl?.split("/")[1] || "";
//   const locale = nextUrl?.split("/")[2] || "";

//   // Revalidate tags related to authentication and customer
//   revalidateTag("auth");
//   revalidateTag("customer");

//   // Redirect the user to the account page
//   redirect(`/${countryCode}/${locale}/account`);
// }

// export async function signOut(): Promise<void> {
//   const cookieOptions = {
//     domain: ".pixelsjourney.com", // Ensure the domain matches
//     path: "/", // Ensure the path matches
//     secure: true, // Ensure the secure attribute matches
//     sameSite: "strict" as "strict" | "lax" | "none", // Ensure the SameSite attribute matches
//   };

//   console.log("Removing cookie:", cookies().get("_medusa_jwt"));

//   // Expire the cookie immediately
//   cookies().set("_medusa_jwt", "", {
//     ...cookieOptions,
//     expires: new Date(0), // Set the expiry date to a past date to remove the cookie
//   });

//   console.log("Removed cookie:", cookies().get("_medusa_jwt"));

//   const nextUrl = headers().get("next-url");
//   const countryCode = nextUrl?.split("/")[1] || "";
//   const locale = nextUrl?.split("/")[2] || "";

//   revalidateTag("auth");
//   revalidateTag("customer");

//   redirect(`/${countryCode}/${locale}/account`);
// }