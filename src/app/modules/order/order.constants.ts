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
	CashOnDelivery: 'Cash On Delivery',
	OnlinePayment: 'Online Payment',
	POSonDelivery: 'POS On Delivery',
} as const;

export const DELIVERY_METHODS = {
	HomeDelivery: 'Home Delivery',
	StorePickup: 'Store Pickup',
	RequestExpress: 'Request Express',
};
