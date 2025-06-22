export function getCurrentMonthYear(): string {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();
  return `${month}, ${year}`;
}
