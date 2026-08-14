// Format price to currency
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return "$0.00";
  return `$${Number(amount).toFixed(2)}`;
};

// Format date
export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format order status
export const formatStatus = (status) => {
  const statusMap = {
    Pending: "Pending",
    Processing: "Processing",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
  };
  return statusMap[status] || status || "Pending";
};

// Get status color
export const getStatusColor = (status) => {
  const colorMap = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

// Format currency for charts
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "$0";
  return `$${Number(amount).toFixed(0)}`;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Get initials
export const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Format order ID
export const formatOrderId = (id) => {
  if (!id) return "N/A";
  return `#${id.slice(-6).toUpperCase()}`;
};
