export type CourierProvider = "SHIPROCKET" | "MOCK";
export type CourierAccountStatus = "PENDING" | "CONNECTED" | "ERROR" | "DISABLED";

export interface CourierAccountSafe {
  id: string;
  provider: CourierProvider;
  status: CourierAccountStatus;
  isEnabled: boolean;
  hasCredentials: boolean;
  pickupLocationNickname?: string | null;
  webhookConfigured: boolean;
  lastError?: string | null;
  lastTestedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MyCourierAccountsData {
  myCourierAccounts: CourierAccountSafe[];
}

export interface ConnectCourierAccountInput {
  provider: CourierProvider;
  email: string;
  password: string;
  webhookSecret?: string;
}

export interface CourierPickupLocation {
  id: string;
  nickname: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface CourierPickupLocationsData {
  courierPickupLocations: CourierPickupLocation[];
}

export interface CourierOption {
  courierId: string;
  courierName: string;
  rate: number;
  estimatedDays?: number | null;
  codAvailable: boolean;
  recommended: boolean;
}

export interface CourierOptionsResult {
  couriers: CourierOption[];
  selectedCourierId?: string | null;
  selectedCourierName?: string | null;
}

export interface CourierOptionsForOrderData {
  courierOptionsForOrder: CourierOptionsResult;
}

export interface CourierWebhookUrlData {
  courierWebhookUrl: string;
}
