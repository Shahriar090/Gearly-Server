import { TItems } from './order.interface';

export const generateOrderTrackingId = () => {
  return `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// get the tax rate
const getTaxRate = (price: number): number => {
  if (price > 1500) return 0.05; //5% tax
  if (price > 1000) return 0.04; //4% tax
  if (price > 500) return 0.03; //3% tax
  return 0.01;
};

// utility function to calculate order (price, tax etc.)
export const calculateOrder = (items: TItems[]) => {
  const calculatedItems = items.map((item) => {
    const taxRate = getTaxRate(item.price);
    const tax = item.price * taxRate * item.quantity;
    const shippingCharge = 20;
    const total = item.price * item.quantity + tax + shippingCharge;

    return {
      ...item,
      tax,
      shippingCharge,
      total,
    };
  });

  const totalAmount = calculatedItems.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  return { items: calculatedItems, totalAmount };
};
