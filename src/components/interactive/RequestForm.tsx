import type { LocaleProps } from "../../i18n/config";
import { getMessages, formatMessage } from "../../i18n/messages";
import { useState, type SubmitEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import newsletterBear from "../../assets/clear/newsletter-polar-bear.webp";

export default function RequestForm({ kind, locale }: LocaleProps & { kind: "newsletter" | "feedback" }) {
  const { forms: t, interactive: ui } = getMessages(locale);
  const newsletter = kind === "newsletter";
  const [values, setValues] = useState({ email: "", name: "", review: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState("");
  const [complete, setComplete] = useState(false);
  const reset = () => { setValues({ email: "", name: "", review: "" }); setConsent(false); setErrors({}); setSummary(""); setComplete(false); };
  const change = (key: keyof typeof values, value: string) => {
    setValues(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: "" })); setSummary("");
  };
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    event.currentTarget.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input,textarea").forEach(field => {
      if (field.required && !field.value.trim()) next[field.name] = ui.required;
      else if (field.value.trim() && !field.checkValidity()) next[field.name] = field.type === "email" ? ui.invalidEmail : ui.required;
    });
    if (!consent) next.consent = t.consentError;
    setErrors(next);
    if (Object.keys(next).length) { document.getElementById(`${kind}-${Object.keys(next)[0]}`)?.focus(); return; }
    setSummary(newsletter ? formatMessage(t.newsletterSummary, { email: values.email }) : formatMessage(t.feedbackSummary, { name: values.name.trim(), review: values.review.trim() }));
    setComplete(true);
    window.setTimeout(() => ScrollTrigger.refresh(), 0);
  };
  const confirmation = <section className="demo-confirmation" aria-labelledby={`${kind}-demo-title`}>
    <Badge className="demo-badge">{ui.demoLabel}</Badge><h4 id={`${kind}-demo-title`}>{t.successTitle}</h4>
    <p role="status" aria-live="polite">{t.successMessage}</p>
    <ScrollArea className="summary-scroll"><pre className="request-summary" tabIndex={0}>{summary}</pre></ScrollArea>
    <Button type="button" className="paw-button secondary-action" onClick={reset}>{t.restartDemo}</Button>
  </section>;
  const content = complete ? confirmation : <form id={`${kind}-form`} className="request-form feedback-form" noValidate onSubmit={submit}>
    {newsletter ? <><Label htmlFor="newsletter-email">{t.email}</Label><Input id="newsletter-email" name="email" type="email" autoComplete="email" required placeholder={t.emailPlaceholder} value={values.email} onChange={event => change("email", event.target.value)} aria-invalid={!!errors.email} aria-describedby="newsletter-email-error" /><span id="newsletter-email-error" className="field-error" aria-live="polite">{errors.email}</span></> : <>
      <Label htmlFor="feedback-name">{t.firstName}</Label><Input id="feedback-name" name="name" autoComplete="given-name" required maxLength={80} value={values.name} onChange={event => change("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby="feedback-name-error" /><span id="feedback-name-error" className="field-error" aria-live="polite">{errors.name}</span>
      <Label htmlFor="feedback-review">{t.experience}</Label><Textarea id="feedback-review" name="review" required rows={4} maxLength={1000} value={values.review} onChange={event => change("review", event.target.value)} aria-invalid={!!errors.review} aria-describedby="feedback-review-error" /><span id="feedback-review-error" className="field-error" aria-live="polite">{errors.review}</span>
    </>}
    <div className="consent-label"><Checkbox id={`${kind}-consent`} checked={consent} onCheckedChange={checked => { setConsent(checked === true); setErrors(previous => ({ ...previous, consent: "" })); setSummary(""); }} aria-invalid={!!errors.consent} aria-describedby={`${kind}-consent-error`} /><Label htmlFor={`${kind}-consent`}>{newsletter ? t.newsletterConsent : t.feedbackConsent}</Label></div>
    <span id={`${kind}-consent-error`} className="field-error" aria-live="polite">{errors.consent}</span>
    {!newsletter && <p className="field-hint">{t.feedbackHint}</p>}
    {newsletter ? <div className="newsletter-action"><img className="newsletter-bear" src={newsletterBear.src} width={newsletterBear.width} height={newsletterBear.height} alt="" aria-hidden="true" /><Button type="submit" className="paw-button">{t.prepareSubscription}</Button></div> : <Button type="submit" className="paw-button">{t.prepareFeedback}</Button>}
  </form>;
  return newsletter ? content : <Accordion type="single" collapsible className="feedback-details" onValueChange={() => window.setTimeout(() => ScrollTrigger.refresh(), 250)}><AccordionItem value="feedback"><AccordionTrigger>{t.share}</AccordionTrigger><AccordionContent>{content}</AccordionContent></AccordionItem></Accordion>;
}
