import type { LocaleProps } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import ChoiceSelect from "./ChoiceSelect";
import BookingDate from "./BookingDate";
import { getBookingOptions, type BookingValues, type BookingErrors, type BookingPreset } from "./booking-model";

interface Props extends LocaleProps { step: number; values: BookingValues; errors: BookingErrors; preset: BookingPreset; setField: (name: keyof BookingValues, value: string) => void }

export default function BookingSteps({ step, values, errors, preset, setField, locale }: Props) {
  const { booking: t } = getMessages(locale);
  const { petOptions, serviceOptions, timeOptions } = getBookingOptions(locale);
  if (step === 0) return <fieldset data-booking-step>
    <legend>{t.petLegend}</legend>
    <ChoiceSelect id="booking-pet" label={t.petType} value={values.pet} placeholder={t.choosePet} options={petOptions} error={errors.pet} onChange={value => setField("pet", value)} />
    <ChoiceSelect id="booking-service" label={t.service} value={values.service} placeholder={t.chooseService} options={serviceOptions} error={errors.service} onChange={value => setField("service", value)} />
    {(preset.plan || preset.context) && <p className="field-hint">{preset.plan || preset.context}</p>}
    {values.service === "emergency" && <p className="field-hint">{t.urgentBefore} <a href="tel:+861815785051">{t.urgentCall}</a> {t.urgentAfter}</p>}
  </fieldset>;
  if (step === 1) return <fieldset data-booking-step>
    <legend>{t.scheduleLegend}</legend>
    <BookingDate locale={locale} value={values.date} error={errors.date} onChange={value => setField("date", value)} />
    <ChoiceSelect id="booking-time" label={t.time} value={values.time} placeholder={t.chooseTime} options={timeOptions} error={errors.time} onChange={value => setField("time", value)} />
    <p className="field-hint">{t.scheduleHint}</p>
  </fieldset>;
  return <fieldset data-booking-step>
    <legend>{t.contactLegend}</legend>
    {([
      { name: "name", label: t.name, type: "text", autoComplete: "name", max: 80 },
      { name: "email", label: t.email, type: "email", autoComplete: "email", max: 120 },
      { name: "phone", label: t.phone, type: "tel", autoComplete: "tel", max: 40 },
    ] as const).map(field => <div key={field.name}>
      <Label htmlFor={`booking-${field.name}`}>{field.label}</Label>
      <Input id={`booking-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} required={field.name !== "phone"} maxLength={field.max} value={values[field.name]} onChange={event => setField(field.name, event.target.value)} aria-invalid={!!errors[field.name]} aria-describedby={`booking-${field.name}-error`} />
      <span className="field-error" id={`booking-${field.name}-error`} aria-live="polite">{errors[field.name]}</span>
    </div>)}
    <Label htmlFor="booking-notes">{t.notes}</Label>
    <Textarea id="booking-notes" name="notes" rows={3} maxLength={500} value={values.notes} onChange={event => setField("notes", event.target.value)} placeholder={t.notesPlaceholder} />
  </fieldset>;
}
