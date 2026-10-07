export const ORDER_TRANSITIONS = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};
export const nextOrderStatuses = (order) => (ORDER_TRANSITIONS[order.status] || []).filter(status => !(status === "Cancelled" && order.isPaid));
