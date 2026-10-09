import { Languages } from "lucide-react";
import type { LocaleProps } from "../../i18n/config";
import { localePath } from "../../i18n/config";
import { getMessages } from "../../i18n/messages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel, SelectGroup } from "../ui/select";

export default function LanguageSwitcher({ locale }: LocaleProps) {
  const { page: t } = getMessages(locale);
  return <Select value={locale} onValueChange={value => {
    if ((value === "id" || value === "en") && value !== locale) {
      window.location.assign(localePath(value) + window.location.search + window.location.hash);
    }
  }}>
    <SelectTrigger className="language-trigger" aria-label={t.language}>
      <Languages aria-hidden="true" className="language-icon" /><SelectValue>{locale.toUpperCase()}</SelectValue>
    </SelectTrigger>
    <SelectContent className="choice-content language-options" position="popper" align="end">
      <SelectGroup><SelectLabel>{t.language}</SelectLabel>
        <SelectItem value="en"><span lang="en">English</span></SelectItem>
        <SelectItem value="id"><span lang="id">Bahasa Indonesia</span></SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>;
}
