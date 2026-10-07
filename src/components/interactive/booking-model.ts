import { getSiteContent } from "../../data/site-content";
import { dateLocale, type Locale } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";

export interface BookingPreset { service?: string; pet?: string; plan?: string; context?: string }
export interface BookingValues {
  pet: string; service: string; date: string; time: string;
  name: string; email: string; phone: string; notes: string;
}
export type BookingErrors = Partial<Record<keyof BookingValues, string>>;
export function getBookingOptions(locale: Locale) {
  const { booking: t } = getMessages(locale);
  const { services } = getSiteContent(locale);
  return {
    petOptions: Object.entries(t.petLabels).map(([value, label]) => ({ value, label })),
    serviceOptions: [...services.map(service => ({ value: service.image, label: service.title })), { value: "adoption", label: t.adoptionService }],
    timeOptions: Object.entries(t.timeLabels).map(([value, label]) => ({ value, label })),
  };
}
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function bookingSummary(values: BookingValues, preset: BookingPreset, locale: Locale) {
  const { booking: t } = getMessages(locale);
  const options = getBookingOptions(locale);
  const labels = t.summaryLabels;
  const pet = options.petOptions.find(option => option.value === values.pet)?.label || "";
  const service = options.serviceOptions.find(option => option.value === values.service)?.label || "";
  const time = options.timeOptions.find(option => option.value === values.time)?.label || "";
  const date = values.date ? new Date(`${values.date}T00:00:00`).toLocaleDateString(dateLocale(locale), { dateStyle: "long" }) : "";
  return [
    t.summaryTitle,
    `${labels.pet}: ${pet}`, `${labels.service}: ${service}`,
    preset.plan ? `${labels.plan}: ${preset.plan}` : "", preset.context ? `${labels.context}: ${preset.context}` : "",
    `${labels.date}: ${date}`, `${labels.time}: ${time}`,
    `${labels.name}: ${values.name.trim()}`, `${labels.email}: ${values.email}`, values.phone ? `${labels.phone}: ${values.phone}` : "",
    values.notes ? `${labels.notes}: ${values.notes}` : "",
  ].filter(Boolean).join("\n");
}
