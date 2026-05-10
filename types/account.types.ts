/**
 * Account types — customer self-serve. Profile is the same shape the
 * admin page uses (`AdminCustomer`) since the GraphQL schema reuses the
 * type — but the customer can only edit a subset of fields here.
 */

import type { AdminCustomer } from "./customer.types";

export type CustomerProfile = AdminCustomer;

export const ADDRESS_TYPES = ["billing", "shipping", "both"] as const;
export type AddressType = (typeof ADDRESS_TYPES)[number];

export const ADDRESS_TYPE_LABEL: Record<AddressType, string> = {
  billing: "Billing",
  shipping: "Shipping",
  both: "Billing & Shipping",
};

// GraphQL enum is uppercase; we serialize on the wire and lowercase locally.
// (Hand-rolled mappers since the resolver maps the lowercase string into
// the AddressType GraphQL enum value via the enum's value-strings.)
export const ADDRESS_TYPE_TO_GQL: Record<AddressType, string> = {
  billing: "BILLING",
  shipping: "SHIPPING",
  both: "BOTH",
};

export const ADDRESS_TYPE_FROM_GQL: Record<string, AddressType> = {
  BILLING: "billing",
  SHIPPING: "shipping",
  BOTH: "both",
};

export interface Address {
  id: string;
  userId: string;
  type: AddressType | string; // server returns enum string
  label?: string | null;
  firstName: string;
  lastName: string;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  isDefault: boolean;
}

export interface UpdateMyProfileInput {
  name?: string;
  phone?: string;
  marketingOptIn?: boolean;
  preferredCurrency?: string;
}

export interface CreateAddressInput {
  type: string; // GraphQL enum value (BILLING/SHIPPING/BOTH)
  label?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {
  id: string;
}

// ---- Apollo response shapes ----
export interface MyProfileData {
  myProfile: CustomerProfile;
}
export interface UpdateMyProfileData {
  updateMyProfile: CustomerProfile;
}
export interface MyAddressesData {
  myAddresses: Address[];
}
export interface AddMyAddressData {
  addMyAddress: Address;
}
export interface UpdateMyAddressData {
  updateMyAddress: Address;
}
export interface SetMyDefaultAddressData {
  setMyDefaultAddress: Address;
}
export interface RemoveMyAddressData {
  removeMyAddress: Address;
}
