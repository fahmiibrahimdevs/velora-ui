import React from 'react';

// =====================================================================
// VELORA UI GRADIENT TOKENS (aligned with ButtonsView)
// =====================================================================
export const GRAD = {
  primary:
    'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  secondary:
    'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] hover:from-[#94a3b8] hover:to-[#64748b] text-white',
  info:
    'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning:
    'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  danger:
    'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white',
  success:
    'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light:
    'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] hover:from-[#e2e8f0] hover:to-[#cbd5e1] text-slate-800 border border-slate-200/80',
  dark:
    'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white',
} as const;

export type ModalId =
  | 'payment-success'
  | 'payment-checkout'
  | 'upgrade-plan'
  | 'product-quickview'
  | 'shipping-address'
  | 'invoice-detail'
  | 'topup-wallet'
  | 'otp-verify'
  | 'change-password'
  | 'cookie-consent'
  | 'danger-zone-confirm'
  | 'session-timeout'
  | 'api-key-create'
  | 'invite-team'
  | 'share-access'
  | 'profile-detail'
  | 'event-rsvp'
  | 'approval-request'
  | 'multi-input-form'
  | 'wizard-stepper'
  | 'csv-import'
  | 'command-palette'
  | 'upload-dropzone'
  | 'export-filter'
  | 'drawer-detail'
  | 'feedback-rating'
  | 'onboarding-tour'
  | 'notification-inbox'
  | 'media-lightbox'
  | 'audit-trail'
  | 'transfer-proof-viewer'
  | 'signature-pad'
  | 'bulk-action'
  | 'qr-authenticator'
  | 'system-maintenance'
  | 'keyboard-shortcuts'
  | 'demo'
  | 'center'
  | 'confirm'
  | 'bootstrap'
  | 'buttons'
  | 'footer-bg'
  | 'login'
  | 'footer-extra';

export interface ModalShellProps {
  onClose: () => void;
  maxWidth?: string;
  align?: 'center' | 'top';
  children: React.ReactNode;
}

export function ModalShell({
  onClose,
  maxWidth = 'max-w-lg',
  align = 'center',
  children,
}: ModalShellProps) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex justify-center p-4 overflow-y-auto animate-in fade-in duration-200 ${
        align === 'top' ? 'items-start pt-14 sm:pt-20' : 'items-center'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl ${maxWidth} w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 my-auto`}
      >
        {children}
      </div>
    </div>
  );
}

export function formatThousandDot(rawDigits: string): string {
  const digits = rawDigits.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  if (!digits) return '';
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
