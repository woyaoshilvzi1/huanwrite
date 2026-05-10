export function Field({
  label,
  ariaLabel,
  value,
  onChange
}: {
  label: string;
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <input aria-label={ariaLabel} value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  );
}
