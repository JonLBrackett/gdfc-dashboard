export function Tabs({ children, defaultValue }) {
  return <div>{children}</div>;
}

export function TabsList({ children }) {
  return <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>{children}</div>;
}

export function TabsTrigger({ children }) {
  return <button>{children}</button>;
}

export function TabsContent({ children }) {
  return <div>{children}</div>;
}