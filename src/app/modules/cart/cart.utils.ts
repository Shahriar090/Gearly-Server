import { TCartItems } from './cart.interface';

export const getTaxRate = (price: number): number => {
  if (price > 1500) return 0.05; // 5% tax
  if (price > 1000) return 0.04; // 4% tax
  if (price > 500) return 0.03; // 3% tax
  return 0.01; // 1% tax
};

export const calculateCartTotals = (cartItems: TCartItems[]) => {
  let totalAmount = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let totalSaved = 0;
  const shippingCharge = 20;

  const updatedItems = cartItems.map((item) => {
    const taxRate = getTaxRate(item.price);
    const tax = item.price * taxRate * item.quantity;
    const discount = item.discount ? item.discount * item.quantity : 0;

    // calculating how much is saved per item
    const originalPrice = item.price * item.quantity;

    const saved = originalPrice - item.totalPrice;

    const totalPrice = item.price * item.quantity + tax;

    totalAmount += totalPrice;
    totalTax += tax;
    totalDiscount += discount;
    totalSaved += saved;

    return {
      ...item,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
    };
  });

  return {
    items: updatedItems,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    totalTax: parseFloat(totalTax.toFixed(2)),
    totalDiscount: parseFloat(totalDiscount.toFixed(2)),
    totalSaved: parseFloat(totalSaved.toFixed(2)),
    shippingCharge,
    grandTotal: parseFloat((totalAmount + shippingCharge).toFixed(2)),
  };
};
