import { services } from "../../data/site-content";

export interface BookingPreset { service?: string; pet?: string; plan?: string; context?: string }
export interface BookingValues {
  pet: string; service: string; date: string; time: string;
  name: string; email: string; phone: string; notes: string;
}
export type BookingErrors = Partial<Record<keyof BookingValues, string>>;
export const petOptions = ["Dog", "Cat", "Other — please discuss with the team"].map(label => ({ label, value: label }));
export const serviceOptions = [...services.map(service => ({ value: service.image, label: service.title })), { value: "adoption", label: "Adoption consultation" }];
export const timeOptions = ["Morning", "Afternoon", "Flexible"].map(label => ({ label, value: label }));
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function bookingSummary(values: BookingValues, preset: BookingPreset) {
  return [
    "Appointment request — please confirm availability",
    `Pet: ${values.pet}`, `Service: ${serviceOptions.find(option => option.value === values.service)?.label}`,
    preset.plan ? `Plan: ${preset.plan}` : "", preset.context ? `Enquiry: ${preset.context}` : "",
    `Preferred date: ${values.date}`, `Time preference: ${values.time}`,
    `Name: ${values.name.trim()}`, `Email: ${values.email}`, values.phone ? `Phone: ${values.phone}` : "",
    values.notes ? `Notes: ${values.notes}` : "",
  ].filter(Boolean).join("\n");
}
