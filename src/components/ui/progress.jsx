export function Progress({ value, className }) {
  return (
    <div className={className} style={{ background: '#eee', height: '10px', borderRadius: '5px' }}>
      <div style={{
        width: value + '%',
        height: '100%',
        backgroundColor: '#4ade80',
        borderRadius: '5px'
      }} />
    </div>
  );
}