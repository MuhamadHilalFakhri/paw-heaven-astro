import { CalendarDays, PawPrint } from "lucide-react";
import type { LocaleProps } from "../../i18n/config";
import { bookingSummary, type BookingPreset, type BookingValues } from "./booking-model";
import { Card } from "../ui/card";

export default function BookingReceipt({ values, preset, locale }: LocaleProps & { values: BookingValues; preset: BookingPreset }) {
  const [title, ...rows] = bookingSummary(values, preset, locale).split("\n");
  return <Card className="booking-receipt">
    <h4><CalendarDays aria-hidden="true" />{title}</h4>
    <dl>{rows.map((row, index) => {
      const separator = row.indexOf(":");
      return <div key={index}><dt>{row.slice(0, separator)}</dt><dd>{row.slice(separator + 1).trim()}</dd></div>;
    })}</dl>
    <PawPrint className="receipt-paw" aria-hidden="true" />
  </Card>;
}
