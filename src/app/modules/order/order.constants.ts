export const ORDER_STATUS = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
} as const;

export const PAYMENT_STATUS = {
  Pending: 'Pending',
  Paid: 'Paid',
  Failed: 'Failed',
} as const;

export const PAYMENT_METHODS = {
  Card: 'Card',
  Paypal: 'Paypal',
  Online_Banking: 'Online_Banking',
};
