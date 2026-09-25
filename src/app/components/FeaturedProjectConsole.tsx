import { useState } from 'react';
import { Sliders, Copy, Check, RotateCcw, X } from 'lucide-react';

export interface ProjectLayoutConfig {
  align?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'center' | 'bottom';
  scale?: number;
  marginX?: number;
  marginY?: number;
  maxWidth?: string;
}

interface TunerProps {
  projects: Array<{ title: string; id?: number;[key: string]: any }>;
  activeTitle: string;
  onSelectProject: (title: string) => void;
  currentConfig: ProjectLayoutConfig;
  onChangeConfig: (title: string, config: ProjectLayoutConfig) => void;
  onResetConfig: (title: string) => void;
}

// Tuner cuma muncul di development. Kalau mau paksa tampil (misal staging),
// set VITE_SHOW_LAYOUT_TUNER=true di .env
const env: Record<string, any> =
  typeof import.meta !== 'undefined' ? ((import.meta as any)?.env ?? {}) : {};

const SHOW_TUNER =
  env.DEV === true ||
  env.VITE_SHOW_LAYOUT_TUNER === 'true' ||
  (globalThis as any)?.process?.env?.NODE_ENV === 'development';

// Wrapper: guard di luar biar hooks di inner tetap aman (rules of hooks)
export function FeaturedProjectConsole(props: TunerProps) {
  if (!SHOW_TUNER) return null;
  return <FeaturedProjectConsoleInner {...props} />;
}

function FeaturedProjectConsoleInner({
  projects,
  activeTitle,
  onSelectProject,
  currentConfig,
  onChangeConfig,
  onResetConfig,
}: TunerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const align = currentConfig.align || 'left';
  const vAlign = currentConfig.vAlign || 'center';
  const scale = currentConfig.scale ?? 1.5;
  const marginX = currentConfig.marginX ?? 48;
  const marginY = currentConfig.marginY ?? 0;

  const update = (partial: Partial<ProjectLayoutConfig>) => {
    onChangeConfig(activeTitle, { ...currentConfig, ...partial });
  };

  const handleCopy = () => {
    const snippet = `align: '${align}',\nvAlign: '${vAlign}',\nscale: ${scale},\nmarginX: ${marginX},\nmarginY: ${marginY},`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none font-sans">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="liquid-glass-button px-4 py-2.5 rounded-full flex items-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs font-semibold text-white/90 border border-white/20 bg-black/60 backdrop-blur-xl cursor-pointer"
          title="Open Layout Tuner"
        >
          <Sliders className="w-4 h-4 text-white" />
          <span>Layout Tuner</span>
        </button>
      ) : (
        <div className="liquid-glass-card p-5 rounded-2xl w-[320px] sm:w-[360px] bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white text-xs space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-white" />
              <span className="font-semibold text-sm">Featured Tuner</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onResetConfig(activeTitle)}
                title="Reset to default"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Project Selector */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/50 block mb-1.5 font-semibold">
              Project
            </label>
            <select
              value={activeTitle}
              onChange={(e) => onSelectProject(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/40 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.title} value={p.title} className="bg-neutral-900 text-white">
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Horizontal Align */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/50 block mb-1.5 font-semibold">
              Horizontal Align
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              {(['left', 'center', 'right'] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => update({ align: pos })}
                  className={`py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${align === pos
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Align */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/50 block mb-1.5 font-semibold">
              Vertical Align
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              {(['top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => update({ vAlign: pos })}
                  className={`py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${vAlign === pos
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Scale (desktop only)</span>
              <span className="text-white/90 font-mono font-medium">{scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.2"
              step="0.05"
              value={scale}
              onChange={(e) => update({ scale: parseFloat(e.target.value) })}
              className="w-full accent-white h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>

          {/* Margin X Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Margin X (Left/Right)</span>
              <span className="text-white/90 font-mono font-medium">{marginX}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="4"
              value={marginX}
              onChange={(e) => update({ marginX: parseInt(e.target.value, 10) })}
              className="w-full accent-white h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>

          {/* Margin Y Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">Margin Y (Top/Bottom Shift)</span>
              <span className="text-white/90 font-mono font-medium">{marginY}px</span>
            </div>
            <input
              type="range"
              min="-120"
              max="120"
              step="4"
              value={marginY}
              onChange={(e) => update({ marginY: parseInt(e.target.value, 10) })}
              className="w-full accent-white h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>

          {/* Copy Config Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center gap-2 text-white font-medium transition-all cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-300">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white/80" />
                <span>Copy Code for Project</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}