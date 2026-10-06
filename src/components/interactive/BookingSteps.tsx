import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import ChoiceSelect from "./ChoiceSelect";
import BookingDate from "./BookingDate";
import { petOptions, serviceOptions, timeOptions, type BookingValues, type BookingErrors, type BookingPreset } from "./booking-model";

interface Props { step: number; values: BookingValues; errors: BookingErrors; preset: BookingPreset; setField: (name: keyof BookingValues, value: string) => void }

export default function BookingSteps({ step, values, errors, preset, setField }: Props) {
  if (step === 0) return <fieldset data-booking-step>
    <legend>Tell us about your companion</legend>
    <ChoiceSelect id="booking-pet" label="Type of pet" value={values.pet} placeholder="Choose a pet" options={petOptions} error={errors.pet} onChange={value => setField("pet", value)} />
    <ChoiceSelect id="booking-service" label="Service" value={values.service} placeholder="Choose a service" options={serviceOptions} error={errors.service} onChange={value => setField("service", value)} />
    {(preset.plan || preset.context) && <p className="field-hint">{preset.plan || preset.context}</p>}
    {values.service === "emergency" && <p className="field-hint">For urgent concerns, <a href="tel:+861815785051">call +86 181 578 5051</a> directly.</p>}
  </fieldset>;
  if (step === 1) return <fieldset data-booking-step>
    <legend>Your preferred schedule</legend>
    <BookingDate value={values.date} error={errors.date} onChange={value => setField("date", value)} />
    <ChoiceSelect id="booking-time" label="Preferred time of day" value={values.time} placeholder="Choose a preference" options={timeOptions} error={errors.time} onChange={value => setField("time", value)} />
    <p className="field-hint">This is a preference, not a reserved slot. The team will confirm a suitable time with you.</p>
  </fieldset>;
  return <fieldset data-booking-step>
    <legend>How can we reach you?</legend>
    {([
      { name: "name", label: "Your name", type: "text", autoComplete: "name", max: 80 },
      { name: "email", label: "Email address", type: "email", autoComplete: "email", max: 120 },
      { name: "phone", label: "Phone number (optional)", type: "tel", autoComplete: "tel", max: 40 },
    ] as const).map(field => <div key={field.name}>
      <Label htmlFor={`booking-${field.name}`}>{field.label}</Label>
      <Input id={`booking-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} required={field.name !== "phone"} maxLength={field.max} value={values[field.name]} onChange={event => setField(field.name, event.target.value)} aria-invalid={!!errors[field.name]} aria-describedby={`booking-${field.name}-error`} />
      <span className="field-error" id={`booking-${field.name}-error`} aria-live="polite">{errors[field.name]}</span>
    </div>)}
    <Label htmlFor="booking-notes">Anything we should know? (optional)</Label>
    <Textarea id="booking-notes" name="notes" rows={3} maxLength={500} value={values.notes} onChange={event => setField("notes", event.target.value)} placeholder="Pet’s name, special needs, or questions" />
  </fieldset>;
}
