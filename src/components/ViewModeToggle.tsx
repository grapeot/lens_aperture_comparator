type ViewMode = '2d' | '3d';

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

/**
 * Segmented control for switching between 2D chart and 3D scene.
 */
export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  const modes: Array<{ value: ViewMode; label: string }> = [
    { value: '2d', label: '二维' },
    { value: '3d', label: '三维' },
  ];

  return (
    <div className="inline-flex rounded-lg border border-slate-700 bg-slate-800 p-1 text-xs font-medium text-slate-300">
      {modes.map(({ value, label }) => {
        const isActive = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={[
              'px-3 py-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
              isActive
                ? 'bg-blue-500 text-slate-50 shadow'
                : 'hover:bg-slate-700 hover:text-slate-100',
            ].join(' ')}
            aria-pressed={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
