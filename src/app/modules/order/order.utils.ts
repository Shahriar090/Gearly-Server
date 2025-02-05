export const generateOrderTrackingId = () => {
  return `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};
