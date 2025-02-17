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
  let totalAmount = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let totalSaved = 0;
  const shippingCharge = 30;

  const calculatedItems = items.map((item) => {
    const taxRate = getTaxRate(item.price);
    const tax = item.price * taxRate * item.quantity;
    const totalPrice = item.price * item.quantity + tax;

    totalAmount += totalPrice;
    totalTax += tax;
    totalDiscount += (item.discount ?? 0) * item.quantity;
    totalSaved += item.saved * item.quantity;

    return {
      ...item,
      tax,
      totalPrice,
      discount: (item.discount ?? 0) * item.quantity,
      saved: item.saved * item.quantity,
    };
  });

  return {
    items: calculatedItems,
    totalAmount,
    tax: totalTax,
    discount: totalDiscount,
    totalSaved,
    shippingCharge,
    grandTotal: totalAmount + shippingCharge,
  };
};
