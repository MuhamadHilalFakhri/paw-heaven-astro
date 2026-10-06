export const validateField = (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
  const error = field.id ? document.getElementById(`${field.id}-error`) : null;
  const blank = field.required && !field.value.trim();
  const valid = !blank && field.checkValidity();
  field.setAttribute("aria-invalid", String(!valid));
  if (error) error.textContent = valid ? "" : blank ? "Please complete this field." : field.validationMessage;
  return valid;
};

export const validateFields = (container: Element) => {
  const fields = Array.from(container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input:not([type='hidden']), select, textarea"));
  const invalid = fields.filter((field) => !validateField(field));
  invalid[0]?.focus();
  return invalid.length === 0;
};

export const attachValidation = (form: HTMLFormElement) => {
  form.addEventListener("focusout", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) validateField(event.target);
  });
  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) {
      if (event.target.getAttribute("aria-invalid") === "true") validateField(event.target);
    }
  });
};

export const emailDraft = (subject: string, body: string) =>
  `mailto:Pawheaven@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const copyRequest = async (text: string, status: HTMLElement) => {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "Copied. Paste the request into a message to the clinic.";
  } catch {
    status.textContent = "Copy is unavailable here. Select the request text to copy it, or use the email draft.";
  }
};
