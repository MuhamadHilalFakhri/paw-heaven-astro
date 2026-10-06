import { useState, type SubmitEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { emailDraft } from "../../scripts/form-utils";

export default function RequestForm({ kind }: { kind: "newsletter" | "feedback" }) {
  const newsletter = kind === "newsletter";
  const [values, setValues] = useState({ email: "", name: "", review: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");
  const change = (key: keyof typeof values, value: string) => {
    setValues(previous => ({ ...previous, [key]: value }));
    setErrors(previous => ({ ...previous, [key]: "" })); setSummary(""); setStatus("");
  };
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    event.currentTarget.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input,textarea").forEach(field => {
      if (!field.value.trim() || !field.checkValidity()) next[field.name] = field.type === "email" ? "Please enter a valid email address." : "Please complete this field.";
    });
    if (newsletter && !consent) next.consent = "Please confirm you would like to receive the newsletter.";
    setErrors(next);
    if (Object.keys(next).length) { document.getElementById(`${kind}-${Object.keys(next)[0]}`)?.focus(); return; }
    setSummary(newsletter ? `Please add ${values.email} to the Paw Heaven newsletter.\nI consent to receiving news, updates, and special offers by email.` : `Feedback from ${values.name.trim()}\n\n${values.review.trim()}\n\nPermission to publish with first name: ${consent ? "Yes" : "No"}`);
    setStatus("Your draft is ready. Send it in your email app to share it with the team.");
    window.setTimeout(() => ScrollTrigger.refresh(), 0);
  };
  const content = <form id={`${kind}-form`} className="request-form feedback-form" noValidate onSubmit={submit}>
    {newsletter ? <><Label htmlFor="newsletter-email">Email address</Label><Input id="newsletter-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" value={values.email} onChange={event => change("email", event.target.value)} aria-invalid={!!errors.email} aria-describedby="newsletter-email-error" /><span id="newsletter-email-error" className="field-error" aria-live="polite">{errors.email}</span></> : <>
      <Label htmlFor="feedback-name">Your first name</Label><Input id="feedback-name" name="name" autoComplete="given-name" required maxLength={80} value={values.name} onChange={event => change("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby="feedback-name-error" /><span id="feedback-name-error" className="field-error" aria-live="polite">{errors.name}</span>
      <Label htmlFor="feedback-review">Your experience</Label><Textarea id="feedback-review" name="review" required rows={4} maxLength={1000} value={values.review} onChange={event => change("review", event.target.value)} aria-invalid={!!errors.review} aria-describedby="feedback-review-error" /><span id="feedback-review-error" className="field-error" aria-live="polite">{errors.review}</span>
    </>}
    <div className="consent-label"><Checkbox id={`${kind}-consent`} checked={consent} onCheckedChange={checked => { setConsent(checked === true); setErrors(previous => ({ ...previous, consent: "" })); setSummary(""); setStatus(""); }} aria-invalid={!!errors.consent} aria-describedby={`${kind}-consent-error`} /><Label htmlFor={`${kind}-consent`}>{newsletter ? "I’d like to receive news, updates, and special offers by email." : "You may publish my review with my first name."}</Label></div>
    <span id={`${kind}-consent-error`} className="field-error" aria-live="polite">{errors.consent}</span>
    {!newsletter && <p className="field-hint">Feedback is reviewed by the team before any publication.</p>}
    <Button type="submit" className="paw-button">{newsletter ? "Prepare subscription" : "Prepare feedback"}</Button>
    {summary && <><ScrollArea className="summary-scroll"><pre className="request-summary" tabIndex={0}>{summary}</pre></ScrollArea><div className="dialog-actions"><Button asChild className="paw-button"><a href={emailDraft(newsletter ? "Newsletter subscription request" : "Feedback about my visit", summary)}>Open email draft</a></Button><Button type="button" className="paw-button secondary-action" onClick={async () => { try { await navigator.clipboard.writeText(summary); setStatus("Copied. Paste the request into a message to the clinic."); } catch { setStatus("Select the draft text to copy it, or use your email app."); } }}>Copy {newsletter ? "request" : "feedback"}</Button></div></>}
    <p className="form-status" role="status" aria-live="polite">{status}</p>
  </form>;
  return newsletter ? content : <Accordion type="single" collapsible className="feedback-details" onValueChange={() => window.setTimeout(() => ScrollTrigger.refresh(), 250)}><AccordionItem value="feedback"><AccordionTrigger>Share your experience</AccordionTrigger><AccordionContent>{content}</AccordionContent></AccordionItem></Accordion>;
}

