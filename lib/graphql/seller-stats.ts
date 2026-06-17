import { gql } from "@apollo/client";

export const GET_MY_SELLER_STATS = gql`
  query MySellerStats {
    mySellerStats {
      netEarningsThisMonth
      netEarningsLastMonth
      netEarningsChangePct
      lifetimeNetEarnings
      grossSalesThisMonth
      lifetimeCommission
      pendingPayoutAmount
      paidPayoutAmount
      ordersThisMonth
      ordersLastMonth
      ordersChangePct
      lifetimeOrders
      avgOrderValue
      pendingOrders
      toShipOrders
      deliveredOrders
      cancelledOrders
      monthlyEarnings {
        label
        value
      }
      bestSellers {
        productId
        name
        unitsSold
        revenue
      }
    }
  }
`;

export interface SellerStatPoint {
  label: string;
  value: number;
}

export interface SellerBestSeller {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

export interface SellerStats {
  netEarningsThisMonth: number;
  netEarningsLastMonth: number;
  netEarningsChangePct: number;
  lifetimeNetEarnings: number;
  grossSalesThisMonth: number;
  lifetimeCommission: number;
  pendingPayoutAmount: number;
  paidPayoutAmount: number;
  ordersThisMonth: number;
  ordersLastMonth: number;
  ordersChangePct: number;
  lifetimeOrders: number;
  avgOrderValue: number;
  pendingOrders: number;
  toShipOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  monthlyEarnings: SellerStatPoint[];
  bestSellers: SellerBestSeller[];
}

export interface MySellerStatsData {
  mySellerStats: SellerStats;
}
