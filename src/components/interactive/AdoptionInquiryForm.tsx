import { useState, type SubmitEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogClose } from "../ui/dialog";
import ChoiceSelect from "./ChoiceSelect";
import { emailDraft } from "../../scripts/form-utils";
import type { LocaleProps } from "../../i18n/config";
import { getMessages, formatMessage } from "../../i18n/messages";

interface Props extends LocaleProps { pet?: string; context?: string }

export default function AdoptionInquiryForm({ pet, context, locale }: Props) {
  const { adoption: t, booking, interactive: ui } = getMessages(locale);
  const speciesOptions = (["Cat", "Dog"] as const).map(value => ({ value, label: t.filters[value] }));
  const [species, setSpecies] = useState(pet === "Cat" || pet === "Dog" ? pet : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({ name: "", email: "", phone: "", question: "" });
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");
  const speciesLabel = speciesOptions.find(option => option.value === species)?.label || "";

  const update = (key: keyof typeof values, value: string) => {
    setValues(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: "" }));
    setSummary(""); setStatus("");
  };
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!species) next.pet = t.chooseSpecies;
    event.currentTarget.querySelectorAll<HTMLInputElement>("input").forEach(field => {
      if (field.required && !field.value.trim()) next[field.name] = ui.required;
      else if (!field.checkValidity()) next[field.name] = field.type === "email" ? ui.invalidEmail : ui.required;
    });
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) { document.getElementById(`adoption-inquiry-${first}`)?.focus(); return; }
    const labels = t.summaryLabels;
    setSummary([
      t.summaryTitle, `${labels.interest}: ${speciesLabel}`,
      context ? `${labels.context}: ${context}` : "",
      `${labels.name}: ${values.name.trim()}`, `${labels.email}: ${values.email.trim()}`,
      values.phone.trim() ? `${labels.phone}: ${values.phone.trim()}` : "",
      values.question.trim() ? `${labels.question}: ${values.question.trim()}` : "",
    ].filter(Boolean).join("\n"));
    setStatus(t.ready);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setStatus(t.copied); }
    catch { setStatus(t.copyUnavailable); }
  };
  const error = (name: string) => <span id={`adoption-inquiry-${name}-error`} className="field-error" aria-live="polite">{errors[name]}</span>;

  return <form className="adoption-inquiry-form" noValidate onSubmit={submit}>
    <fieldset>
      <legend>{t.legend}</legend>
      <ChoiceSelect id="adoption-inquiry-pet" label={t.interest} value={species} placeholder={t.choose} options={speciesOptions} error={errors.pet} onChange={value => { setSpecies(value); setErrors(previous => ({ ...previous, pet: "" })); setSummary(""); setStatus(""); }} />
      <Label htmlFor="adoption-inquiry-name">{booking.name}</Label>
      <Input id="adoption-inquiry-name" name="name" autoComplete="name" required maxLength={80} value={values.name} onChange={event => update("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby="adoption-inquiry-name-error" />{error("name")}
      <Label htmlFor="adoption-inquiry-email">{booking.email}</Label>
      <Input id="adoption-inquiry-email" name="email" type="email" autoComplete="email" required maxLength={120} value={values.email} onChange={event => update("email", event.target.value)} aria-invalid={!!errors.email} aria-describedby="adoption-inquiry-email-error" />{error("email")}
      <Label htmlFor="adoption-inquiry-phone">{booking.phone}</Label>
      <Input id="adoption-inquiry-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} value={values.phone} onChange={event => update("phone", event.target.value)} />
      <Label htmlFor="adoption-inquiry-question">{t.question}</Label>
      <Textarea id="adoption-inquiry-question" name="question" rows={3} maxLength={500} value={values.question} onChange={event => update("question", event.target.value)} placeholder={t.placeholder} />
    </fieldset>
    <p className="field-hint">{t.hint}</p>
    {!summary ? <div className="booking-actions"><Button type="submit" className="paw-button">{t.prepare}</Button></div> : <>
      <pre className="request-summary" tabIndex={0}>{summary}</pre>
      <div className="dialog-actions">
        <Button asChild className="paw-button"><a href={emailDraft(formatMessage(t.subject, { species: speciesLabel }), summary)} onClick={() => setStatus(t.sendStatus)}>{ui.emailDraft}</a></Button>
        <Button type="button" className="paw-button secondary-action" onClick={copy}>{t.copy}</Button>
        <DialogClose asChild><Button type="button" className="paw-button secondary-action">{ui.done}</Button></DialogClose>
      </div>
    </>}
    <p className="form-status" role="status" aria-live="polite">{status}</p>
  </form>;
}
