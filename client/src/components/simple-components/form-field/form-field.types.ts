export interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  infoText?: string;
}
