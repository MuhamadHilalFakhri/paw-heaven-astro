import type { LocaleProps } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";
import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DialogClose } from "../ui/dialog";
import { type BookingPreset } from "./booking-model";
import BookingReceipt from "./BookingReceipt";
import BookingSteps from "./BookingSteps";
import { useBooking } from "./use-booking";

export default function BookingForm({ preset, locale }: LocaleProps & { preset: BookingPreset }) {
  const { booking: t, interactive: ui } = getMessages(locale);
  const { values, errors, setField, step, setStep, validate, formRef } = useBooking(preset, locale);
  const [complete, setComplete] = useState(false);


  return <>
    {!complete && <ol className="booking-progress" aria-label={t.stepsLabel}>
      {t.steps.map((name, index) => <li key={name} aria-current={index === step ? "step" : undefined} className={index < step ? "is-complete" : ""}><span>{index + 1}</span>{name}</li>)}
    </ol>}
    <form id="booking-form" ref={formRef} noValidate onSubmit={event => { event.preventDefault(); if (step < 3 && validate()) setStep(step + 1); }}>
      {complete ? <section className="demo-confirmation" aria-labelledby="booking-demo-title">
        <Badge className="demo-badge">{ui.demoLabel}</Badge>
        <h3 id="booking-demo-title">{t.successTitle}</h3>
        <p role="status" aria-live="polite">{t.successMessage}</p>
        <BookingReceipt values={values} preset={preset} locale={locale} />
        <DialogClose asChild><Button type="button" className="paw-button">{ui.done}</Button></DialogClose>
      </section> : <>
        {step < 3 ? <BookingSteps locale={locale} step={step} values={values} errors={errors} setField={setField} preset={preset} /> : <fieldset data-booking-step>
          <legend>{t.reviewLegend}</legend>
          <p className="field-hint">{t.reviewHint}</p>
          <BookingReceipt values={values} preset={preset} locale={locale} />
        </fieldset>}
        <div className="booking-actions">
          {step > 0 && <Button type="button" className="paw-button secondary-action" onClick={() => setStep(step - 1)}>{ui.back}</Button>}
          {step < 3 ? <Button type="submit" className="paw-button">{step === 2 ? t.review : ui.continue}</Button> : <Button type="button" className="paw-button" onClick={() => setComplete(true)}>{t.confirmDemo}</Button>}
        </div>
      </>}
    </form>
  </>;
}
