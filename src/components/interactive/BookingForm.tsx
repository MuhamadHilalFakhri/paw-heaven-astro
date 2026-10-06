import { useState } from "react";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import { emailDraft } from "../../scripts/form-utils";
import { bookingSummary, type BookingPreset } from "./booking-model";
import BookingSteps from "./BookingSteps";
import { useBooking } from "./use-booking";

export default function BookingForm({ preset }: { preset: BookingPreset }) {
  const { values, errors, setField, step, setStep, validate, formRef } = useBooking(preset);
  const summary = bookingSummary(values, preset);
  const [status, setStatus] = useState("Your request is ready. An appointment is confirmed only after the clinic replies.");
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setStatus("Copied. Paste the request into a message to the clinic."); }
    catch { setStatus("Select the request text to copy it, or use the email draft."); }
  };
  return <>
    <ol className="booking-progress" aria-label="Booking steps">{["Pet & care", "Schedule", "Contact", "Review"].map((name, index) => <li key={name} aria-current={index === step ? "step" : undefined} className={index < step ? "is-complete" : ""}><span>{index + 1}</span>{name}</li>)}</ol>
    <form id="booking-form" ref={formRef} noValidate onSubmit={event => { event.preventDefault(); if (step < 3 && validate()) setStep(step + 1); }}>
      {step < 3 ? <BookingSteps step={step} values={values} errors={errors} setField={setField} preset={preset} /> : <fieldset data-booking-step>
        <legend>Review your request</legend>
        <p className="field-hint">Check the details, then send the request using your email app or copy it to contact the team.</p>
        <pre id="booking-summary" className="request-summary" tabIndex={0}>{summary}</pre>
        <div className="dialog-actions">
          <Button asChild className="paw-button"><a href={emailDraft("Appointment request", summary)} onClick={() => setStatus("Send the draft in your email app. The clinic will reply to confirm.")}>Open email draft</a></Button>
          <Button type="button" className="paw-button secondary-action" onClick={copy}>Copy request</Button>
        </div>
        <p id="booking-status" className="form-status" role="status" aria-live="polite">{status}</p>
      </fieldset>}
      <div className="booking-actions">
        {step > 0 && <Button type="button" className="paw-button secondary-action" onClick={() => setStep(step - 1)}>Back</Button>}
        {step < 3 ? <Button type="submit" className="paw-button">{step === 2 ? "Review request" : "Continue"}</Button> : <DialogClose asChild><Button type="button" className="paw-button secondary-action">Done</Button></DialogClose>}
      </div>
    </form>
  </>;
}
