import Swal, { type SweetAlertIcon } from 'sweetalert2';

// Custom Toast configured to match our modern UI
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: 'rounded-xl shadow-lg border border-slate-100 text-sm font-medium',
  },
});

export const showToast = (title: string, icon: SweetAlertIcon = 'success') => {
  return Toast.fire({
    icon,
    title,
  });
};

// Confirmation modal with high contrast, modern clean buttons
export const confirmDialog = async (options: {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: SweetAlertIcon;
  isDangerous?: boolean;
}) => {
  const result = await Swal.fire({
    title: options.title,
    text: options.text || 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    icon: options.icon || (options.isDangerous ? 'warning' : 'question'),
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Ya, Lanjutkan',
    cancelButtonText: options.cancelButtonText || 'Batal',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl p-6 shadow-2xl border border-slate-100',
      title: 'text-lg font-bold text-slate-800',
      htmlContainer: 'text-sm text-slate-600',
      confirmButton: options.isDangerous
        ? 'bg-rose-600 hover:bg-rose-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/20'
        : 'bg-[#0c255e] hover:bg-[#091d4a] text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20',
      cancelButton:
        'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-5 py-2.5 rounded-xl transition-all focus:outline-none mr-2',
    },
    buttonsStyling: false,
  });

  return result.isConfirmed;
};

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    customClass: {
      popup: 'rounded-2xl p-6 shadow-xl border border-slate-100',
      title: 'text-lg font-bold text-slate-800',
      htmlContainer: 'text-sm text-slate-600',
      confirmButton:
        'bg-[#0c255e] hover:bg-[#091d4a] text-white font-medium px-6 py-2.5 rounded-xl transition-all',
    },
    buttonsStyling: false,
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    customClass: {
      popup: 'rounded-2xl p-6 shadow-xl border border-slate-100',
      title: 'text-lg font-bold text-rose-700',
      htmlContainer: 'text-sm text-slate-600',
      confirmButton:
        'bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all',
    },
    buttonsStyling: false,
  });
};
