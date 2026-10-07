export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export interface LocaleProps { locale: Locale }
export const defaultLocale: Locale = "id";
export const localePath = (locale: Locale) => locale === "id" ? "/" : "/en/";
export const dateLocale = (locale: Locale) => locale === "id" ? "id-ID" : "en-US";
