export function Card({ children }) {
  return <div style={{ border: '1px solid #ccc', borderRadius: '8px', marginBottom: '10px' }}>{children}</div>;
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}