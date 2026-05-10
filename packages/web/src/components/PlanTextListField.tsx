export function PlanTextListField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span>{label}</span>
      <textarea aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
