export function getCurrentMonthYear(): string {
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();
  return `${month}, ${year}`;
}

export function getMonthYearFromId(monthId: string): string {
  const [year, month] = monthId.split("-").map(Number);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[month - 1];
  return `${monthName}, ${year}`;
}
