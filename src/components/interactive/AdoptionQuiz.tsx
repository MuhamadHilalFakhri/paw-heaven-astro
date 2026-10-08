import { useEffect, useRef, useState } from "react";
import { PawPrint } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LocaleProps } from "../../i18n/config";
import { formatMessage } from "../../i18n/messages";
import { getAdoptionExtras } from "../../i18n/adoption-extras";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import ChoiceSelect from "./ChoiceSelect";
import { findCompanion, type MatchAnswers, type ProfileCard, type ShowcaseImages } from "./adoption-model";

type Props = LocaleProps & { profiles: ProfileCard[]; images: ShowcaseImages; onRecommend: (name: string) => void };
export default function AdoptionQuiz({ profiles, images, onRecommend, locale }: Props) {
  const t = getAdoptionExtras(locale);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<MatchAnswers>({ home: "", activity: "", species: "" });
  const panel = useRef<HTMLDivElement>(null);
  const previousStep = useRef(0);
  const questions = [
    { key: "home", label: t.home, options: [{ value: "apartment", label: t.apartment }, { value: "house", label: t.house }] },
    { key: "activity", label: t.activity, options: [{ value: "calm", label: t.calm }, { value: "playful", label: t.playful }] },
    { key: "species", label: t.species, options: [{ value: "any", label: t.any }, { value: "Cat", label: t.cat }, { value: "Dog", label: t.dog }] },
  ] as const;
  const question = questions[Math.min(step, 2)];
  const match = step === 3 ? findCompanion(profiles, answers) : undefined;
  useEffect(() => {
    if (previousStep.current !== step) panel.current?.querySelector<HTMLElement>("[data-quiz-result], [role='combobox']")?.focus({ preventScroll: true });
    previousStep.current = step;
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(timer);
  }, [step, open]);

  return <Card className="companion-quiz"><Accordion type="single" collapsible value={open ? "quiz" : ""} onValueChange={value => setOpen(value === "quiz")}>
    <AccordionItem value="quiz"><AccordionTrigger><span><PawPrint aria-hidden="true" />{t.quizTitle}</span></AccordionTrigger>
      <AccordionContent><div ref={panel} className="quiz-panel">
        {step < 3 ? <>
          <p className="quiz-hint">{t.quizHint}</p>
          <p className="quiz-step" aria-live="polite">{formatMessage(t.step, { step: step + 1 })}</p>
          <ChoiceSelect id={`quiz-${question.key}`} label={question.label} value={answers[question.key]} placeholder={t.choose}
            options={[...question.options]} onChange={value => setAnswers(previous => ({ ...previous, [question.key]: value }))} />
          <div className="quiz-actions">{step > 0 && <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>{t.back}</Button>}
            <Button type="button" disabled={!answers[question.key]} onClick={() => setStep(step + 1)}>{step === 2 ? t.find : t.next}</Button>
          </div>
        </> : match ? <div className="quiz-result">
          <img src={images[match.name] ?? match.photo?.src} alt={match.imageAlt ?? match.name} width={110} height={110} />
          <div><h4 data-quiz-result tabIndex={-1}>{formatMessage(t.result, { name: match.name })}</h4><p>{match.character}</p><p>{match.description}</p>
            <div className="quiz-actions"><Button type="button" onClick={() => { setOpen(false); onRecommend(match.name); }}>{formatMessage(t.view, { name: match.name })}</Button>
              <Button type="button" variant="outline" onClick={() => setStep(0)}>{t.retry}</Button></div>
          </div>
        </div> : <><p role="status">{t.noMatch}</p><Button type="button" variant="outline" onClick={() => setStep(0)}>{t.retry}</Button></>}
        <p className="quiz-demo-note">{t.demo}</p>
      </div></AccordionContent>
    </AccordionItem>
  </Accordion></Card>;
}
