import { Colors } from "@/constants/Colors";

export function getExpenseColor(
  remaining: number,
  limit: number
): { percent: number; color: string } {
  const percent = Math.max(0, Math.min(100, (remaining / limit) * 100));

  let color = Colors.colorCritical;
  if (percent >= 70) color = Colors.colorPlentyLeft;
  else if (percent >= 50) color = Colors.colorModerate;
  else if (percent >= 25) color = Colors.colorLowFunds;

  return { percent, color };
}
