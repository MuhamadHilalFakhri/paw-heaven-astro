import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

interface Props {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: string;
}

export default function ChoiceSelect({ id, label, value, placeholder, options, onChange, error }: Props) {
  return <div className="choice-field">
    <Label htmlFor={id}>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="choice-trigger" aria-invalid={!!error} aria-describedby={`${id}-error`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" align="start" className="choice-content">
        {options.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
      </SelectContent>
    </Select>
    <span id={`${id}-error`} className="field-error" aria-live="polite">{error}</span>
  </div>;
}
