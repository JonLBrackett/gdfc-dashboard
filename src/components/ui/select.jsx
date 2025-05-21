export function Select({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SelectTrigger({ children }) {
  return <div>{children}</div>;
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children }) {
  return <div>{children}</div>;
}

export function SelectItem({ value, children }) {
  return <div data-value={value}>{children}</div>;
}