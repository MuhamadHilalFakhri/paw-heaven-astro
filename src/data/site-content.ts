import type { Locale } from "../i18n/config";
import * as en from "../i18n/locales/en/site-content";
import * as id from "../i18n/locales/id/site-content";

export const getSiteContent = (locale: Locale) => locale === "id" ? id : en;
