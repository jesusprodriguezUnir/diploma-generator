export function Checkbox({ checked = false }: { checked?: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '3.5mm',
        height: '3.5mm',
        border: '1px solid #000',
        verticalAlign: 'middle',
        background: '#fff',
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg
          viewBox="0 0 10 10"
          style={{ width: '70%', height: '70%', stroke: '#000', strokeWidth: 1.5, strokeLinecap: 'round' }}
        >
          <line x1="1" y1="1" x2="9" y2="9" />
          <line x1="9" y1="1" x2="1" y2="9" />
        </svg>
      )}
    </div>
  );
}
