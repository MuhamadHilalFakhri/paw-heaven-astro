import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { localDate } from "./booking-model";
import { id as indonesian, enUS } from "react-day-picker/locale";
import { dateLocale, type LocaleProps } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";

export default function BookingDate({ value, error, onChange, locale }: LocaleProps & { value: string; error?: string; onChange: (value: string) => void }) {
  const { booking: t } = getMessages(locale);
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return <div className="choice-field">
    <Label htmlFor="booking-date">{t.date}</Label>
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button id="booking-date" variant="outline" className="choice-trigger date-trigger" aria-invalid={!!error} aria-describedby="booking-date-error"><CalendarIcon />{selected ? selected.toLocaleDateString(dateLocale(locale), { dateStyle: "medium" }) : t.chooseDate}</Button></PopoverTrigger>
      <PopoverContent className="calendar-popover" align="start" collisionPadding={8}>
        <Calendar mode="single" locale={locale === "id" ? indonesian : enUS} aria-label={t.calendarLabel} labels={{ labelNext: () => t.nextMonth, labelPrevious: () => t.previousMonth }} selected={selected} defaultMonth={selected || today} disabled={{ before: today }} onSelect={date => { if (date) { onChange(localDate(date)); setOpen(false); } }} autoFocus />
      </PopoverContent>
    </Popover>
    <span className="field-error" id="booking-date-error" aria-live="polite">{error}</span>
  </div>;
}
