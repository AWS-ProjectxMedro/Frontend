export function formatCurrency(value) {
  if (typeof value !== "number") return "$0.00";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}
