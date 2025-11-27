import type { ReactNode } from 'react';

type WindowProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  onClose?: () => void;
};

const windowBase =
  'group relative flex h-full flex-col rounded-xl border border-[#45475a]/60 bg-[rgba(24,24,36,0.65)] shadow-[0_0_0_1px_rgba(69,71,90,0.4)] backdrop-blur-[9px] hover:backdrop-blur-[18px] transition duration-700 ease-out will-change-transform group-hover:border-white animate-window-pop hover:border-white';

const Window = ({ children, className, title, onClose }: WindowProps) => {
  const showHeader = Boolean(title);

  return (
    <div className={`${windowBase} ${className ?? ''}`}>
      {showHeader && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-3 text-[10px] uppercase tracking-[0.35em] text-[#7f849c] opacity-0 transition-opacity duration-300 ease-out group-hover:pointer-events-auto group-hover:opacity-100">
          <span className="text-[9px] tracking-[0.4em] text-[#cdd6f4]">
            {title}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
              className="rounded-full border border-transparent px-3 py-1 text-xs tracking-[0.3em] text-white transition-colors duration-200 hover:opacity-60"
            >
              X
            </button>
          )}
        </div>
      )}
      <div className="scroll-shell flex flex-1 min-h-0 overflow-y-auto overscroll-contain rounded-xl bg-[rgba(12,12,20,0.55)] p-4 pt-12 font-mono text-sm text-[#cdd6f4]">
        {children}
      </div>
    </div>
  );
};

export default Window;
