export function Button({ children, ...props }) {
  return <button {...props} className="bg-red-600 text-white px-4 py-2 rounded">{children}</button>;
}