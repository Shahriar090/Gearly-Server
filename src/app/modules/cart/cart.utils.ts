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
  const shippingCharge = 30;

  const updatedItems = cartItems.map((item) => {
    const taxRate = getTaxRate(item.price);
    const tax = item.price * taxRate * item.quantity;
    const totalPrice = item.price * item.quantity + tax;

    // accumulate total
    totalAmount += totalPrice;
    totalTax += tax;
    totalDiscount += (item.discount ?? 0) * item.quantity;
    totalSaved += item.saved;
    return {
      ...item,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      discount: parseFloat(((item.discount ?? 0) * item.quantity).toFixed(2)),
      saved: parseFloat(item.saved.toFixed(2)),
    };
  });

  return {
    items: updatedItems,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    tax: parseFloat(totalTax.toFixed(2)),
    discount: parseFloat(totalDiscount.toFixed(2)),
    totalSaved: parseFloat(totalSaved.toFixed(2)),
    shippingCharge,
    grandTotal: parseFloat((totalAmount + shippingCharge).toFixed(2)),
  };
};

export const mergeCartItems = (
  existingItems: TCartItems[],
  newItems: TCartItems[],
) => {
  const itemMap = new Map(
    existingItems.map((item) => [item.product.toString(), item]),
  );

  newItems.forEach((newItem) => {
    if (itemMap.has(newItem.product.toString())) {
      const existingItem = itemMap.get(newItem.product.toString())!;

      existingItem.quantity += newItem.quantity;
      existingItem.price = newItem.price;
      existingItem.discount = newItem.discount;
    } else {
      // add new item
      itemMap.set(newItem.product.toString(), { ...newItem, totalPrice: 0 });
    }
  });

  return Array.from(itemMap.values()) as TCartItems[];
};
