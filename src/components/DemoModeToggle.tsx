'use client';

interface DemoModeToggleProps {
  isDemo: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function DemoModeToggle({ isDemo, onToggle }: DemoModeToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={`toggle-track ${isDemo ? 'active' : ''}`}
          onClick={() => onToggle(!isDemo)}
          aria-label="Activar modo demo"
          aria-pressed={isDemo}
          id="demo-mode-toggle"
        >
          <div className="toggle-thumb" />
        </button>
        <span className="text-sm font-medium">Modo Demo</span>
      </div>

      {isDemo && (
        <span className="demo-badge">
          <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse" />
          DEMO
        </span>
      )}
    </div>
  );
}
