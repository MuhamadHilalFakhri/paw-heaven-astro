import type { Locale } from "../i18n/config";
import { serviceDetails as en } from "../i18n/locales/en/service-details";
import { serviceDetails as id } from "../i18n/locales/id/service-details";

export const getServiceDetails = (locale: Locale) => locale === "id" ? id : en;
