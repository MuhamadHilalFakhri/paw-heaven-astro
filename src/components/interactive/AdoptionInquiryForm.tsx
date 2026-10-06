import { useState, type SubmitEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogClose } from "../ui/dialog";
import ChoiceSelect from "./ChoiceSelect";
import { emailDraft } from "../../scripts/form-utils";

const speciesOptions = [
  { value: "Cat", label: "Cats" },
  { value: "Dog", label: "Dogs" },
];

interface Props { pet?: string; context?: string }

export default function AdoptionInquiryForm({ pet, context }: Props) {
  const [species, setSpecies] = useState(pet === "Cat" || pet === "Dog" ? pet : "");
  const [speciesError, setSpeciesError] = useState("");
  const [values, setValues] = useState({ name: "", email: "", phone: "", question: "" });
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState("");

  const update = (key: keyof typeof values, value: string) => {
    setValues(previous => ({ ...previous, [key]: value }));
    setSummary("");
    setStatus("");
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!species) { setSpeciesError("Choose cats or dogs."); return; }
    if (!event.currentTarget.reportValidity()) return;
    const request = [
      "Adoption enquiry — please share current availability",
      `Interested in: ${species}s`,
      context ? `About: ${context}` : "",
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      values.phone.trim() ? `Phone: ${values.phone.trim()}` : "",
      values.question.trim() ? `Question: ${values.question.trim()}` : "",
    ].filter(Boolean).join("\n");
    setSummary(request);
    setStatus("Your enquiry is ready. It is not sent until you email the clinic.");
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setStatus("Copied. Paste the enquiry into a message to the clinic."); }
    catch { setStatus("Copy is unavailable here. Select the enquiry text or use the email draft."); }
  };

  return <form className="adoption-inquiry-form" onSubmit={submit}>
    <fieldset>
      <legend>Tell us what you’re looking for</legend>
      <ChoiceSelect id="adoption-inquiry-pet" label="I’m interested in" value={species} placeholder="Choose cats or dogs" options={speciesOptions} error={speciesError} onChange={value => { setSpecies(value); setSpeciesError(""); setSummary(""); setStatus(""); }} />
      <Label htmlFor="adoption-inquiry-name">Your name</Label>
      <Input id="adoption-inquiry-name" name="name" autoComplete="name" required maxLength={80} value={values.name} onChange={event => update("name", event.target.value)} />
      <Label htmlFor="adoption-inquiry-email">Email address</Label>
      <Input id="adoption-inquiry-email" name="email" type="email" autoComplete="email" required maxLength={120} value={values.email} onChange={event => update("email", event.target.value)} />
      <Label htmlFor="adoption-inquiry-phone">Phone number (optional)</Label>
      <Input id="adoption-inquiry-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} value={values.phone} onChange={event => update("phone", event.target.value)} />
      <Label htmlFor="adoption-inquiry-question">Your question (optional)</Label>
      <Textarea id="adoption-inquiry-question" name="question" rows={3} maxLength={500} value={values.question} onChange={event => update("question", event.target.value)} placeholder="Ask about age, personality, or the adoption process" />
    </fieldset>
    <p className="field-hint">This is an enquiry, not an appointment. The team will reply with current availability.</p>
    {!summary ? <div className="booking-actions"><Button type="submit" className="paw-button">Prepare enquiry</Button></div> : <>
      <pre className="request-summary" tabIndex={0}>{summary}</pre>
      <div className="dialog-actions">
        <Button asChild className="paw-button"><a href={emailDraft(`Adoption enquiry — ${species}s`, summary)} onClick={() => setStatus("Send the draft in your email app to contact the team.")}>Open email draft</a></Button>
        <Button type="button" className="paw-button secondary-action" onClick={copy}>Copy enquiry</Button>
        <DialogClose asChild><Button type="button" className="paw-button secondary-action">Done</Button></DialogClose>
      </div>
    </>}
    <p className="form-status" role="status" aria-live="polite">{status}</p>
  </form>;
}
