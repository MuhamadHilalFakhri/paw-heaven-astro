import type { Locale } from "./config";
import { page as enPage } from "./locales/en/page";
import { page as idPage } from "./locales/id/page";
import { booking as enBooking } from "./locales/en/booking";
import { booking as idBooking } from "./locales/id/booking";
import { interactive as enInteractive } from "./locales/en/interactive";
import { interactive as idInteractive } from "./locales/id/interactive";
import { adoption as enAdoption } from "./locales/en/adoption";
import { adoption as idAdoption } from "./locales/id/adoption";
import { forms as enForms } from "./locales/en/forms";
import { forms as idForms } from "./locales/id/forms";
import { planFinder as enPlanFinder } from "./locales/en/plan-finder";
import { planFinder as idPlanFinder } from "./locales/id/plan-finder";

const messages = {
  id: { page: idPage, booking: idBooking, interactive: idInteractive, adoption: idAdoption, forms: idForms, planFinder: idPlanFinder },
  en: { page: enPage, booking: enBooking, interactive: enInteractive, adoption: enAdoption, forms: enForms, planFinder: enPlanFinder },
};

export const getMessages = (locale: Locale) => messages[locale];
export const formatMessage = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
