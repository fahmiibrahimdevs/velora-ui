# Velora UI Color & Gradient Guidelines

When working inside `/home/midpc/Projects/velora-ui/`:
- All buttons, active tabs/pills, category badges, and primary action indicators MUST use the gradient color palette from `ButtonsView` (`src/App.tsx`), NOT flat solid backgrounds (except striped `.upload-progress-animated` bars which use CSS `background-image`):
  - **Primary:** `bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white`
  - **Secondary:** `bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] hover:from-[#94a3b8] hover:to-[#64748b] text-white`
  - **Info:** `bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white`
  - **Warning:** `bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white`
  - **Danger:** `bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white`
  - **Success:** `bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white`
  - **Light:** `bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80`
  - **Dark:** `bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white`
