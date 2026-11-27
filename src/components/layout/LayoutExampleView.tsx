import { FeatureSectionHeader } from '../features/FeatureSectionHeader';

export function LayoutExampleView() {
  return (
    <div className="space-y-6">
      <FeatureSectionHeader
        title="This is Example Page"
        description="This page is just an example for you to create your own page."
      />

      {/* Clean White Example Card matching Top Navigation layout */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm sm:text-base font-bold text-[#175cd3]">Example Card</h3>
        </div>
        <div className="p-6 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white text-xs text-slate-600">
          This is card footer
        </div>
      </div>
    </div>
  );
}
