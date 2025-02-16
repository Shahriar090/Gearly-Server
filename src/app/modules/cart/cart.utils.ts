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
      totalPrice: totalPrice,
      discount: (item.discount ?? 0) * item.quantity,
      saved: item.saved,
    };
  });

  return {
    items: updatedItems,
    totalAmount: totalAmount,
    tax: totalTax,
    discount: totalDiscount,
    totalSaved,
    shippingCharge,
    grandTotal: totalAmount + shippingCharge,
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

      // calculate saved amount based on quantity
      existingItem.saved +=
        newItem.discount != null
          ? newItem.discount
          : newItem.price * newItem.quantity;
    } else {
      // add new item if it does not already exist in the cart

      newItem.saved = newItem.discount ?? newItem.price * newItem.quantity;

      itemMap.set(newItem.product.toString(), { ...newItem });
    }
  });

  return Array.from(itemMap.values()) as TCartItems[];
};
