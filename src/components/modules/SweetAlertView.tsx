import { useState } from 'react';
import Swal, { type SweetAlertIcon, type SweetAlertPosition } from 'sweetalert2';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Trash2,
  Clock,
  Sparkles,
  Play,
  Copy,
  Check,
  Image as ImageIcon,
  ListOrdered,
  MessageSquare,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  secondary: 'bg-gradient-to-r from-[#cbd5e1] to-[#94a3b8] hover:from-[#94a3b8] hover:to-[#64748b] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  danger: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
  dark: 'bg-gradient-to-r from-[#1e293b] to-[#020617] hover:from-[#0f172a] hover:to-[#000000] text-white',
};

const SWAL_BASE_CLASSES = {
  popup: 'rounded-2xl p-6 shadow-2xl border border-slate-100',
  title: 'text-lg font-bold text-slate-800',
  htmlContainer: 'text-sm text-slate-600',
  confirmButton:
    'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all',
  denyButton:
    'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer mx-2 transition-all',
  cancelButton:
    'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80 font-semibold px-5 py-2.5 rounded-xl cursor-pointer mr-2 transition-all',
};

export function SweetAlertView() {
  // Interactive Playground Builder State
  const [pgTitle, setPgTitle] = useState('Konfirmasi Perubahan');
  const [pgText, setPgText] = useState('Pastikan seluruh konfigurasi modul Velora UI sudah sesuai sebelum disimpan.');
  const [pgIcon, setPgIcon] = useState<SweetAlertIcon>('success');
  const [pgShowCancel, setPgShowCancel] = useState(true);
  const [pgWithTimer, setPgWithTimer] = useState(false);
  const [pgWithInput, setPgWithInput] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // -------------------------------------------------------------------------
  // VARIATIONS HANDLERS
  // -------------------------------------------------------------------------
  const fireBasic = () => {
    Swal.fire({
      title: 'Halo dari Velora UI!',
      text: 'Ini adalah contoh dialog SweetAlert2 sederhana yang bersih dan responsif.',
      confirmButtonText: 'Mengerti',
      buttonsStyling: false,
      customClass: SWAL_BASE_CLASSES,
    });
  };

  const fireWithFooter = () => {
    Swal.fire({
      icon: 'info',
      title: 'Pembaruan Sistem Tersedia',
      text: 'Versi Velora UI v2.5 menghadirkan peningkatan performa dan komponen baru.',
      footer: '<a href="#/advanced-form" class="text-[#175cd3] font-semibold hover:underline">Lihat daftar pembaruan modul →</a>',
      confirmButtonText: 'Tutup',
      buttonsStyling: false,
      customClass: SWAL_BASE_CLASSES,
    });
  };

  const fireSemantic = (icon: SweetAlertIcon, title: string, text: string, btnGrad: string) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'OK, Sip!',
      buttonsStyling: false,
      customClass: {
        ...SWAL_BASE_CLASSES,
        confirmButton: `${btnGrad} font-semibold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all`,
      },
    });
  };

  const fireDeleteConfirm = async () => {
    const res = await Swal.fire({
      title: 'Hapus Data Permanen?',
      text: 'Tindakan ini tidak dapat dibatalkan setelah berkas dihapus dari server.',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      buttonsStyling: false,
      customClass: {
        ...SWAL_BASE_CLASSES,
        confirmButton: `${GRAD.danger} font-semibold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer`,
      },
    });

    if (res.isConfirmed) {
      fireSemantic('success', 'Berhasil Dihapus!', 'Berkas telah dihapus dari sistem.', GRAD.success);
    }
  };

  const fireThreeButtons = async () => {
    const res = await Swal.fire({
      title: 'Simpan perubahan dokumen?',
      text: 'Anda memiliki suntingan yang belum disimpan di halaman editor.',
      icon: 'question',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      denyButtonText: 'Jangan Simpan',
      cancelButtonText: 'Batal',
      buttonsStyling: false,
      customClass: SWAL_BASE_CLASSES,
    });

    if (res.isConfirmed) {
      showToast('Dokumen berhasil disimpan!', 'success');
    } else if (res.isDenied) {
      showToast('Perubahan diabaikan.', 'info');
    }
  };

  const fireAsyncLoader = async () => {
    const res = await Swal.fire({
      title: 'Sinkronisasi API Produksi',
      text: 'Klik Konfirmasi untuk menjalankan simulasi request ke server (900ms).',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sinkronkan Sekarang',
      cancelButtonText: 'Batal',
      showLoaderOnConfirm: true,
      reverseButtons: true,
      buttonsStyling: false,
      customClass: SWAL_BASE_CLASSES,
      preConfirm: async () => {
        await new Promise((r) => window.setTimeout(r, 900));
        return { syncedAt: new Date().toLocaleTimeString('id-ID') };
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (res.isConfirmed && res.value) {
      fireSemantic(
        'success',
        'Sinkronisasi Selesai!',
        `Server merespons 200 OK pada pukul ${res.value.syncedAt}.`,
        GRAD.success
      );
    }
  };

  const fireAutoTimer = () => {
    let timerInterval: number | undefined;
    Swal.fire({
      title: 'Menutup Otomatis',
      html: 'Modal ini akan tertutup otomatis dalam <b>2500</b> ms.',
      timer: 2500,
      timerProgressBar: true,
      buttonsStyling: false,
      customClass: SWAL_BASE_CLASSES,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer()?.querySelector('b');
        timerInterval = window.setInterval(() => {
          if (b) b.textContent = String(Swal.getTimerLeft() ?? 0);
        }, 100);
      },
      willClose: () => {
        if (timerInterval) window.clearInterval(timerInterval);
      },
    });
  };

  const fireInputPrompt = async (type: 'text' | 'email' | 'select' | 'textarea' | 'checkbox') => {
    if (type === 'text') {
      const { value } = await Swal.fire({
        title: 'Masukkan Nama Proyek',
        input: 'text',
        inputPlaceholder: 'cth: Velora HR Dashboard',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Lanjutkan',
        cancelButtonText: 'Batal',
        buttonsStyling: false,
        customClass: {
          ...SWAL_BASE_CLASSES,
          input: 'border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800',
        },
        inputValidator: (v) => (!v?.trim() ? 'Nama proyek wajib diisi!' : null),
      });
      if (value) showToast(`Nama proyek: "${value}"`, 'success');
    } else if (type === 'email') {
      const { value } = await Swal.fire({
        title: 'Undang Anggota via Email',
        input: 'email',
        inputPlaceholder: 'nama@velora.id',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Kirim Undangan',
        cancelButtonText: 'Batal',
        buttonsStyling: false,
        customClass: {
          ...SWAL_BASE_CLASSES,
          input: 'border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800',
        },
      });
      if (value) showToast(`Undangan dikirim ke ${value}`, 'success');
    } else if (type === 'select') {
      const { value } = await Swal.fire({
        title: 'Pilih Region Server',
        input: 'select',
        inputOptions: {
          jakarta: 'Jakarta (ap-southeast-3)',
          singapore: 'Singapore (ap-southeast-1)',
          tokyo: 'Tokyo (ap-northeast-1)',
        },
        inputPlaceholder: '-- Pilih Region --',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Terapkan',
        cancelButtonText: 'Batal',
        buttonsStyling: false,
        customClass: {
          ...SWAL_BASE_CLASSES,
          input: 'border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800',
        },
      });
      if (value) showToast(`Region aktif: ${value}`, 'info');
    } else if (type === 'textarea') {
      const { value } = await Swal.fire({
        title: 'Tulis Catatan Review',
        input: 'textarea',
        inputPlaceholder: 'Masukkan alasan atau catatan tambahan...',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Kirim Catatan',
        cancelButtonText: 'Batal',
        buttonsStyling: false,
        customClass: {
          ...SWAL_BASE_CLASSES,
          input: 'border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800',
        },
      });
      if (value) showToast('Catatan review tersimpan.', 'success');
    } else {
      const { value } = await Swal.fire({
        title: 'Persetujuan Syarat',
        input: 'checkbox',
        inputValue: 1,
        inputPlaceholder: 'Saya menyetujui kebijakan layanan Velora UI',
        confirmButtonText: 'Lanjutkan',
        buttonsStyling: false,
        customClass: SWAL_BASE_CLASSES,
        inputValidator: (result) => (!result ? 'Anda harus mencentang persetujuan!' : null),
      });
      if (value) showToast('Persetujuan dikonfirmasi!', 'success');
    }
  };

  const fireWizardQueue = async () => {
    const Queue = Swal.mixin({
      progressSteps: ['1', '2', '3'],
      confirmButtonText: 'Lanjut →',
      showCancelButton: true,
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        ...SWAL_BASE_CLASSES,
        input: 'border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800',
      },
    });

    const s1 = await Queue.fire({
      title: 'Langkah 1: Nama Workspace',
      currentProgressStep: 0,
      input: 'text',
      inputValue: 'Velora Production',
    });
    if (!s1.isConfirmed) return;

    const s2 = await Queue.fire({
      title: 'Langkah 2: Paket Layanan',
      currentProgressStep: 1,
      input: 'select',
      inputOptions: { starter: 'Starter', pro: 'Pro', enterprise: 'Enterprise' },
      inputValue: 'enterprise',
    });
    if (!s2.isConfirmed) return;

    const s3 = await Queue.fire({
      title: 'Langkah 3: Konfirmasi Akhir',
      currentProgressStep: 2,
      text: `Workspace "${s1.value}" (${s2.value}) siap dibuat!`,
      confirmButtonText: 'Selesai ✓',
    });
    if (s3.isConfirmed) {
      fireSemantic('success', 'Workspace Aktif!', `Workspace "${s1.value}" berhasil dikonfigurasi.`, GRAD.success);
    }
  };

  const fireCustomImage = () => {
    Swal.fire({
      title: 'Rilis Fitur Baru!',
      text: 'Banner visual dengan gambar kustom di dalam modal SweetAlert2.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      imageWidth: 420,
      imageHeight: 190,
      imageAlt: 'Preview Banner',
      confirmButtonText: 'Keren!',
      buttonsStyling: false,
      customClass: {
        ...SWAL_BASE_CLASSES,
        image: 'rounded-xl object-cover',
      },
    });
  };

  const fireRichHtml = () => {
    Swal.fire({
      title: 'Ringkasan Tagihan Q4',
      html: `
        <div class="text-left space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
          <div class="flex justify-between"><span>Paket Enterprise</span><b>Rp 4.500.000</b></div>
          <div class="flex justify-between"><span>PPN (11%)</span><b>Rp 495.000</b></div>
          <div class="border-t border-slate-200 pt-2 flex justify-between text-[#175cd3] font-bold">
            <span>Total Bayar</span><span>Rp 4.995.000</span>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Bayar Sekarang',
      showCancelButton: true,
      reverseButtons: true,
      buttonsStyling: false,
      customClass: SWAL_BASE_CLASSES,
    });
  };

  const fireAtPosition = (pos: SweetAlertPosition, label: string) => {
    Swal.fire({
      position: pos,
      icon: 'success',
      title: `Posisi: ${label}`,
      showConfirmButton: false,
      timer: 1600,
      toast: true,
      customClass: {
        popup: 'rounded-xl shadow-xl border border-slate-100 text-xs font-semibold',
      },
    });
  };

  const launchPlayground = async () => {
    const res = await Swal.fire({
      title: pgTitle || 'Judul Alert',
      text: pgText,
      icon: pgIcon,
      showCancelButton: pgShowCancel,
      reverseButtons: true,
      timer: pgWithTimer ? 3000 : undefined,
      timerProgressBar: pgWithTimer,
      input: pgWithInput ? 'text' : undefined,
      inputPlaceholder: pgWithInput ? 'Ketik sesuatu di sini...' : undefined,
      confirmButtonText: 'Konfirmasi',
      cancelButtonText: 'Batal',
      buttonsStyling: false,
      customClass: {
        ...SWAL_BASE_CLASSES,
        input: 'border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800',
      },
    });

    if (res.isConfirmed && pgWithInput && res.value) {
      showToast(`Input diterima: "${res.value}"`, 'info');
    }
  };

  const generatedSnippet = `Swal.fire({
  title: '${pgTitle}',
  text: '${pgText}',
  icon: '${pgIcon}',${pgShowCancel ? '\n  showCancelButton: true,' : ''}${pgWithTimer ? '\n  timer: 3000,\n  timerProgressBar: true,' : ''}${pgWithInput ? "\n  input: 'text'," : ''}
  confirmButtonText: 'Konfirmasi',
});`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">SweetAlert2 Showcase</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Beragam variasi dialog interaktif SweetAlert2: semantik, konfirmasi 3 tombol, async loader, timer, input prompt, wizard multi-langkah, dan custom playground.
          </p>
        </div>
      </div>

      {/* Row 1: Basic & Confirmations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">1. Basic &amp; Semantic SweetAlerts</h3>
            <p className="text-xs text-slate-500 mt-0.5">Klik setiap tombol untuk memicu dialog SweetAlert2 sesuai konteks status.</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={fireBasic} className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}>
              Basic Alert
            </button>
            <button type="button" onClick={fireWithFooter} className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.light}`}>
              With Footer Link
            </button>
            <button
              type="button"
              onClick={() => fireSemantic('success', 'Berhasil Disimpan!', 'Perubahan data telah diterapkan ke database.', GRAD.success)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.success}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Success
            </button>
            <button
              type="button"
              onClick={() => fireSemantic('info', 'Informasi Sistem', 'Jadwal pemeliharaan rutin dimulai pukul 23:00 WIB.', GRAD.info)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.info}`}
            >
              <Info className="w-3.5 h-3.5" /> Info
            </button>
            <button
              type="button"
              onClick={() => fireSemantic('warning', 'Peringatan Kuota', 'Kapasitas penyimpanan cloud tersisa 12%.', GRAD.warning)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.warning}`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Warning
            </button>
            <button
              type="button"
              onClick={() => fireSemantic('error', 'Terjadi Kesalahan!', 'Gagal menghubungkan ke gateway pembayaran (Timeout).', GRAD.danger)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.danger}`}
            >
              <XCircle className="w-3.5 h-3.5" /> Error / Danger
            </button>
            <button
              type="button"
              onClick={() => fireSemantic('question', 'Butuh Bantuan?', 'Anda dapat menghubungi tim support 24/7 kapan saja.', GRAD.dark)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.dark}`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Question
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">2. Confirmations, Async &amp; Timer</h3>
            <p className="text-xs text-slate-500 mt-0.5">Dialog konfirmasi penghapusan, 3 aksi tombol, loading API, dan auto-close timer.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={fireDeleteConfirm}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.danger}`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Confirm Delete</span>
            </button>
            <button
              type="button"
              onClick={fireThreeButtons}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>3-Button Dialog</span>
            </button>
            <button
              type="button"
              onClick={fireAsyncLoader}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.info}`}
            >
              <Play className="w-4 h-4" />
              <span>Async API Confirm</span>
            </button>
            <button
              type="button"
              onClick={fireAutoTimer}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.warning}`}
            >
              <Clock className="w-4 h-4" />
              <span>Auto-Close Timer (2.5s)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Input Prompts + Custom Rich Content & Positions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">3. Input Prompts &amp; Multi-Step Queue</h3>
            <p className="text-xs text-slate-500 mt-0.5">Terima input teks, email, dropdown, textarea, checkbox, hingga wizard 3 langkah.</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={() => fireInputPrompt('text')} className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.primary}`}>
              <MessageSquare className="w-3.5 h-3.5" /> Text Input
            </button>
            <button type="button" onClick={() => fireInputPrompt('email')} className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.info}`}>
              Email Input
            </button>
            <button type="button" onClick={() => fireInputPrompt('select')} className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.success}`}>
              Select Dropdown
            </button>
            <button type="button" onClick={() => fireInputPrompt('textarea')} className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.warning}`}>
              Textarea
            </button>
            <button type="button" onClick={() => fireInputPrompt('checkbox')} className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.dark}`}>
              Checkbox Terms
            </button>
            <button type="button" onClick={fireWizardQueue} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}>
              <ListOrdered className="w-3.5 h-3.5" /> 3-Step Wizard Queue
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">4. Custom Media, HTML &amp; Posisi</h3>
            <p className="text-xs text-slate-500 mt-0.5">Modal bergambar, konten HTML ringkasan faktur, serta posisi penempatan 6 sudut.</p>
          </div>

          <div className="flex flex-wrap gap-2.5 pb-2 border-b border-slate-100">
            <button type="button" onClick={fireCustomImage} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.primary}`}>
              <ImageIcon className="w-3.5 h-3.5" /> Custom Image Header
            </button>
            <button type="button" onClick={fireRichHtml} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.info}`}>
              Rich HTML Content
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { pos: 'top-start', label: 'Top Left' },
                { pos: 'top', label: 'Top Center' },
                { pos: 'top-end', label: 'Top Right' },
                { pos: 'bottom-start', label: 'Bottom Left' },
                { pos: 'bottom', label: 'Bottom Center' },
                { pos: 'bottom-end', label: 'Bottom Right' },
              ] as { pos: SweetAlertPosition; label: string }[]
            ).map((item) => (
              <button
                key={item.pos}
                type="button"
                onClick={() => fireAtPosition(item.pos, item.label)}
                className={`py-2 px-2 rounded-xl text-[11px] font-semibold cursor-pointer ${GRAD.light}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Interactive Playground Builder */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#175cd3]">5. Interactive SweetAlert Playground</h3>
            <p className="text-xs text-slate-500 mt-0.5">Rancang modal sesuai kebutuhan Anda, uji langsung, dan salin kodenya.</p>
          </div>
          <button
            type="button"
            onClick={launchPlayground}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Launch Custom Alert</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul</label>
                <input
                  type="text"
                  value={pgTitle}
                  onChange={(e) => setPgTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#175cd3]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ikon</label>
                <select
                  value={pgIcon}
                  onChange={(e) => setPgIcon(e.target.value as SweetAlertIcon)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#175cd3] cursor-pointer"
                >
                  <option value="success">success</option>
                  <option value="info">info</option>
                  <option value="warning">warning</option>
                  <option value="error">error</option>
                  <option value="question">question</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pesan</label>
              <textarea
                rows={2}
                value={pgText}
                onChange={(e) => setPgText(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#175cd3]"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-1 text-xs font-semibold text-slate-700">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={pgShowCancel} onChange={(e) => setPgShowCancel(e.target.checked)} />
                <span>Show Cancel Button</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={pgWithTimer} onChange={(e) => setPgWithTimer(e.target.checked)} />
                <span>Auto-Close 3s</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={pgWithInput} onChange={(e) => setPgWithInput(e.target.checked)} />
                <span>Include Text Input</span>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Generated Code</span>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(generatedSnippet);
                  setCopiedCode(true);
                  showToast('Kode SweetAlert disalin!', 'success');
                  window.setTimeout(() => setCopiedCode(false), 1400);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${GRAD.primary}`}
              >
                {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <pre className="code-editor-mono bg-[#0f172a] text-slate-100 p-4 text-xs leading-5 overflow-x-auto m-0">
              {generatedSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
