import type { LocaleProps } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import { emailDraft } from "../../scripts/form-utils";
import { bookingSummary, type BookingPreset } from "./booking-model";
import BookingSteps from "./BookingSteps";
import { useBooking } from "./use-booking";

export default function BookingForm({ preset, locale }: LocaleProps & { preset: BookingPreset }) {
  const { booking: t, interactive: ui } = getMessages(locale);
  const { values, errors, setField, step, setStep, validate, formRef } = useBooking(preset, locale);
  const summary = bookingSummary(values, preset, locale);
  const [status, setStatus] = useState(t.ready);
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setStatus(ui.copied); }
    catch { setStatus(ui.copyUnavailable); }
  };
  return <>
    <ol className="booking-progress" aria-label={t.stepsLabel}>{t.steps.map((name, index) => <li key={name} aria-current={index === step ? "step" : undefined} className={index < step ? "is-complete" : ""}><span>{index + 1}</span>{name}</li>)}</ol>
    <form id="booking-form" ref={formRef} noValidate onSubmit={event => { event.preventDefault(); if (step < 3 && validate()) setStep(step + 1); }}>
      {step < 3 ? <BookingSteps locale={locale} step={step} values={values} errors={errors} setField={setField} preset={preset} /> : <fieldset data-booking-step>
        <legend>{t.reviewLegend}</legend>
        <p className="field-hint">{t.reviewHint}</p>
        <pre id="booking-summary" className="request-summary" tabIndex={0}>{summary}</pre>
        <div className="dialog-actions">
          <Button asChild className="paw-button"><a href={emailDraft(t.emailSubject, summary)} onClick={() => setStatus(t.sendStatus)}>{ui.emailDraft}</a></Button>
          <Button type="button" className="paw-button secondary-action" onClick={copy}>{t.copy}</Button>
        </div>
        <p id="booking-status" className="form-status" role="status" aria-live="polite">{status}</p>
      </fieldset>}
      <div className="booking-actions">
        {step > 0 && <Button type="button" className="paw-button secondary-action" onClick={() => setStep(step - 1)}>{ui.back}</Button>}
        {step < 3 ? <Button type="submit" className="paw-button">{step === 2 ? t.review : ui.continue}</Button> : <DialogClose asChild><Button type="button" className="paw-button secondary-action">{ui.done}</Button></DialogClose>}
      </div>
    </form>
  </>;
}
