import { useEffect, useRef, useState } from "react";
import { gsap, motionDuration } from "../../scripts/motion";
import { localDate, type BookingPreset, type BookingValues, type BookingErrors } from "./booking-model";
import type { Locale } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";

export function useBooking(preset: BookingPreset, locale: Locale) {
  const { interactive: t } = getMessages(locale);
  const [values, setValues] = useState<BookingValues>({ pet: preset.pet || "", service: preset.service || "", date: "", time: "", name: "", email: "", phone: "", notes: "" });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const setField = (name: keyof BookingValues, value: string) => {
    setValues(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: undefined }));
  };
  const validate = () => {
    const next: BookingErrors = {};
    const required = step === 0 ? ["pet", "service"] : step === 1 ? ["date", "time"] : ["name", "email"];
    required.forEach(name => { if (!values[name as keyof BookingValues].trim()) next[name as keyof BookingValues] = t.required; });
    if (step === 1 && values.date && values.date < localDate()) next.date = t.futureDate;
    const email = formRef.current?.querySelector<HTMLInputElement>("#booking-email");
    if (step === 2 && email && !email.validity.valid) next.email = t.invalidEmail;
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`#booking-${first}`)?.focus());
    return !first;
  };
  useEffect(() => {
    const panel = formRef.current?.querySelector<HTMLElement>("[data-booking-step]");
    if (!panel) return;
    const animation = gsap.fromTo(panel, { opacity: 0, x: 8 }, { opacity: 1, x: 0, duration: motionDuration(0.2), clearProps: "opacity,transform" });
    formRef.current?.closest("[data-slot='scroll-area-viewport']")?.scrollTo({ top: 0 });
    panel.querySelector<HTMLElement>("[role='combobox'], input, #booking-date, pre")?.focus({ preventScroll: true });
    return () => { animation.revert(); };
  }, [step]);
  return { values, errors, setField, step, setStep, validate, formRef };
}
