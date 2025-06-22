export function sanitizeCurrencyInput(input: string): string {
  // Remove all characters except digits and dot
  let cleaned = input.replace(/[^0-9.]/g, "");

  // If there are multiple dots, keep only the first
  const firstDotIndex = cleaned.indexOf(".");
  if (firstDotIndex !== -1) {
    const beforeDot = cleaned.slice(0, firstDotIndex + 1);
    const afterDot = cleaned.slice(firstDotIndex + 1).replace(/\./g, "");
    cleaned = beforeDot + afterDot;
  }

  // Split into whole and decimal parts
  const [whole, decimal] = cleaned.split(".");

  // Clean leading zeros from whole number (except "0")
  const cleanedWhole = whole.replace(/^0+(?!$)/, "");

  // Limit decimal to 2 digits
  if (decimal !== undefined) {
    return `${cleanedWhole || "0"}.${decimal.slice(0, 2)}`;
  } else {
    return cleanedWhole;
  }
}
