import { Columns3, LayoutPanelTop } from 'lucide-react';
import { FeatureSectionHeader } from '../features/FeatureSectionHeader';

const GRAD = {
  primary:
    'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  light:
    'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] hover:from-[#e2e8f0] hover:to-[#cbd5e1] text-slate-800 border border-slate-200/80',
} as const;

interface LayoutExampleViewProps {
  variant: 'default' | 'top-navigation';
  onSwitchLayout: (target: 'layout-default' | 'layout-top-navigation') => void;
}

export function LayoutExampleView({ variant, onSwitchLayout }: LayoutExampleViewProps) {
  const isTopNav = variant === 'top-navigation';

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <FeatureSectionHeader
          title="This is Example Page"
          description="This page is just an example for you to create your own page."
        />

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => onSwitchLayout('layout-default')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
              !isTopNav ? GRAD.primary : GRAD.light
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            Default Layout
          </button>
          <button
            type="button"
            onClick={() => onSwitchLayout('layout-top-navigation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
              isTopNav ? GRAD.primary : GRAD.light
            }`}
          >
            <LayoutPanelTop className="w-3.5 h-3.5" />
            Top Navigation
          </button>
        </div>
      </div>

      {/* Clean White Example Card matching Top Navigation layout */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-bold text-[#175cd3]">Example Card</h3>
        </div>
        <div className="p-6 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-xs text-slate-700">
            Layout saat ini menggunakan kontainer lebar responsif (<code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-800">max-w-[1520px]</code>) agar konten tetap lega, nyaman dibaca, dan tidak terasa sempit.
          </p>
        </div>
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white text-xs text-slate-600">
          This is card footer
        </div>
      </div>
    </div>
  );
}
