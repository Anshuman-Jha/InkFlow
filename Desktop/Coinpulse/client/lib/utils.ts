import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OHLCData } from "@/app/type"
import { Time } from "lightweight-charts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency: string = 'USD', locale: string = 'en-US') {

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);

}

export function formatPercentage(value: number, locale: string = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function convertOHLCData(data: OHLCData[]) {

  return data.map((d) => ({
    time: d[0] as Time,
    open: d[1],
    high: d[2],
    low: d[3],
    close: d[4],
  })).filter((item, index, arr) => index === 0 || item.time !== arr[index - 1].time);
}