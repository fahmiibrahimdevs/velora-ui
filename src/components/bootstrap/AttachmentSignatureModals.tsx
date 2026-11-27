import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eraser,
  FileText,
  Image as ImageIcon,
  Keyboard,
  PenTool,
  Printer,
  QrCode,
  RotateCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  Users,
  Wrench,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { showToast } from '../../lib/swal';
import { formatThousandDot, GRAD, type ModalId, ModalShell } from './modalShared';

interface AttachmentSignatureModalsProps {
  activeModal: ModalId | null;
  onClose: () => void;
}

const BULK_CANDIDATES = [
  { id: 'emp-1', name: 'Raka Pratama', dept: 'Sales Enterprise', status: 'Aktif' },
  { id: 'emp-2', name: 'Sinta Wijaya', dept: 'Finance & Tax', status: 'Aktif' },
  { id: 'emp-3', name: 'Nadia Kusuma', dept: 'Product Design', status: 'Cuti' },
  { id: 'emp-4', name: 'Bima Pratama', dept: 'Engineering', status: 'Aktif' },
  { id: 'emp-5', name: 'Ayu Lestari', dept: 'HR Operations', status: 'Pending' },
];

// Deterministic 15x15 QR pattern grid (clean static mock QR with 3 corner finder eyes)
const QR_MATRIX: number[][] = [
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1],
  [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1],
];

const SHORTCUT_GROUPS = [
  {
    group: 'Navigasi Global',
    items: [
      { action: 'Buka Command Palette', keys: ['Ctrl', 'K'] },
      { action: 'Ke Dashboard Analytics', keys: ['G', 'D'] },
      { action: 'Buka Halaman Modal UI', keys: ['G', 'M'] },
      { action: 'Tutup Dialog / Modal Aktif', keys: ['Esc'] },
    ],
  },
  {
    group: 'Kanban & Tugas',
    items: [
      { action: 'Tambah Kartu Task Baru', keys: ['Shift', 'N'] },
      { action: 'Filter Tugas Prioritas Tinggi', keys: ['F', 'H'] },
      { action: 'Simpan Edit Kartu Cepat', keys: ['Ctrl', 'Enter'] },
    ],
  },
  {
    group: 'Tabel & Dokumen',
    items: [
      { action: 'Pilih Semua Baris Tabel', keys: ['Ctrl', 'A'] },
      { action: 'Zoom In / Out Preview', keys: ['+', '/'] },
      { action: 'Buka Panduan Shortcut Ini', keys: ['Shift', '?'] },
    ],
  },
];

export function AttachmentSignatureModals({
  activeModal,
  onClose,
}: AttachmentSignatureModalsProps) {
  // 1. Bukti Transfer & PDF Viewer state
  const [viewerTab, setViewerTab] = useState<'image' | 'pdf'>('image');
  const [viewerZoom, setViewerZoom] = useState(100);
  const [viewerRotate, setViewerRotate] = useState(0);
  const [pdfPage, setPdfPage] = useState(1);
  const [proofStatus, setProofStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [proofNote, setProofNote] = useState('');
  const [customFileUrl, setCustomFileUrl] = useState<string | null>(null);
  const [customFileType, setCustomFileType] = useState<'image' | 'pdf' | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (customFileUrl) URL.revokeObjectURL(customFileUrl);
    };
  }, [customFileUrl]);

  // 2. Digital Signature Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [sigMode, setSigMode] = useState<'draw' | 'type'>('draw');
  const [sigColor, setSigColor] = useState<'#0f172a' | '#175cd3'>('#0f172a');
  const [sigHasStroke, setSigHasStroke] = useState(false);
  const [sigTypedName, setSigTypedName] = useState('Fahmi Ibrahim');
  const [sigAgree, setSigAgree] = useState(true);
  const [savedSigDataUrl, setSavedSigDataUrl] = useState<string | null>(null);

  // 3. Bulk Action state
  const [bulkSelected, setBulkSelected] = useState<string[]>(['emp-1', 'emp-2', 'emp-4']);
  const [bulkMode, setBulkMode] = useState<'status' | 'division' | 'delete'>('status');
  const [bulkTargetStatus, setBulkTargetStatus] = useState('Aktif Permanen');
  const [bulkTargetDiv, setBulkTargetDiv] = useState('Technology & Product');

  // 4. QR Authenticator state
  const [qrMode, setQrMode] = useState<'2fa' | 'checkin'>('2fa');
  const [qrVerifyCode, setQrVerifyCode] = useState('');

  // 5. Maintenance & Release state
  const [noticeMode, setNoticeMode] = useState<'maintenance' | 'release'>('maintenance');
  const [remindEmail, setRemindEmail] = useState(true);

  // 6. Keyboard Shortcuts state
  const [shortcutQuery, setShortcutQuery] = useState('');

  const handleLocalPreviewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (customFileUrl) URL.revokeObjectURL(customFileUrl);
    const nextUrl = URL.createObjectURL(file);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setCustomFileUrl(nextUrl);
    setCustomFileType(isPdf ? 'pdf' : 'image');
    setCustomFileName(file.name);
    setViewerTab(isPdf ? 'pdf' : 'image');
    setViewerZoom(100);
    setViewerRotate(0);
    showToast(`File "${file.name}" dimuat untuk preview!`, 'success');
    e.target.value = '';
  };

  const resetSampleViewer = () => {
    if (customFileUrl) URL.revokeObjectURL(customFileUrl);
    setCustomFileUrl(null);
    setCustomFileType(null);
    setCustomFileName(null);
    setViewerZoom(100);
    setViewerRotate(0);
    setPdfPage(1);
  };

  // Signature canvas pointer handlers
  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleSigPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    isDrawingRef.current = true;
    const pt = getCanvasPoint(e);
    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    setSigHasStroke(true);
  };

  const handleSigPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const pt = getCanvasPoint(e);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  };

  const handleSigPointerUp = () => {
    isDrawingRef.current = false;
  };

  const clearSigCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSigHasStroke(false);
    setSavedSigDataUrl(null);
  };

  const toggleBulkRow = (id: string) => {
    setBulkSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const filteredShortcuts = SHORTCUT_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter(
      (it) =>
        it.action.toLowerCase().includes(shortcutQuery.toLowerCase()) ||
        it.keys.join(' ').toLowerCase().includes(shortcutQuery.toLowerCase()),
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {/* 1. BUKTI TRANSFER GAMBAR & PDF DOCUMENT VIEWER */}
      {activeModal === 'transfer-proof-viewer' && (
        <ModalShell onClose={onClose} maxWidth="max-w-4xl">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 ${GRAD.primaryStatic}`}>
                {viewerTab === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {customFileName
                    ? customFileName
                    : viewerTab === 'image'
                      ? 'Bukti-Transfer-BCA-TRF88412.jpg'
                      : 'Slip-Faktur-Kontrak-2026.pdf'}
                </h4>
                <p className="text-[11px] text-slate-600">
                  Viewer Lampiran Transaksi • Zoom {viewerZoom}% • Rotasi {viewerRotate}°
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setViewerTab('image');
                  setViewerZoom(100);
                  setViewerRotate(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                  viewerTab === 'image' ? GRAD.primary : GRAD.light
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Bukti Transfer (Img)
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewerTab('pdf');
                  setViewerZoom(100);
                  setViewerRotate(0);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer ${
                  viewerTab === 'pdf' ? GRAD.primary : GRAD.light
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Dokumen PDF
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Canvas: Viewer Area */}
            <div className="lg:col-span-7 bg-slate-950 flex flex-col">
              {/* Viewer Toolbar */}
              <div className="px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setViewerZoom((z) => Math.max(70, z - 15))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px]">{viewerZoom}%</span>
                  <button
                    type="button"
                    onClick={() => setViewerZoom((z) => Math.min(145, z + 15))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {viewerTab === 'image' && (
                    <button
                      type="button"
                      onClick={() => setViewerRotate((r) => (r + 90) % 360)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white inline-flex items-center gap-1 text-[11px] cursor-pointer ml-1"
                      title="Putar 90°"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Putar
                    </button>
                  )}
                  {viewerTab === 'pdf' && !customFileUrl && (
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        type="button"
                        onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                        disabled={pdfPage <= 1}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-mono text-[11px]">Hal {pdfPage} / 3</span>
                      <button
                        type="button"
                        onClick={() => setPdfPage((p) => Math.min(3, p + 1))}
                        disabled={pdfPage >= 3}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <label className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer ${GRAD.info}`}>
                    <UploadCloud className="w-3.5 h-3.5" />
                    Uji File Sendiri
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleLocalPreviewFile}
                      className="hidden"
                    />
                  </label>
                  {customFileUrl && (
                    <button
                      type="button"
                      onClick={resetSampleViewer}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Viewport Canvas */}
              <div className="p-6 flex-1 min-h-[340px] max-h-[430px] overflow-auto flex items-center justify-center">
                {customFileUrl && customFileType === 'image' && viewerTab === 'image' ? (
                  <img
                    src={customFileUrl}
                    alt="Preview Bukti Transfer"
                    style={{ transform: `scale(${viewerZoom / 100}) rotate(${viewerRotate}deg)` }}
                    className="max-h-[340px] rounded-xl shadow-2xl transition-transform duration-200 object-contain"
                  />
                ) : customFileUrl && customFileType === 'pdf' && viewerTab === 'pdf' ? (
                  <iframe
                    src={customFileUrl}
                    title="Preview Dokumen PDF"
                    className="w-full h-[350px] rounded-xl bg-white"
                  />
                ) : viewerTab === 'image' ? (
                  /* Mock Realistic Bank Transfer Proof Screenshot */
                  <div
                    style={{ transform: `scale(${viewerZoom / 100}) rotate(${viewerRotate}deg)` }}
                    className="transition-transform duration-200 bg-white rounded-2xl w-full max-w-xs p-5 shadow-2xl space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="font-extrabold tracking-tight text-[#175cd3] text-sm">m-BCA Transfer</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.success}`}>
                        BERHASIL
                      </span>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r from-[#22c55e] to-[#15803d] text-white">
                        <Check className="w-5 h-5" />
                      </div>
                      <p className="text-[11px] text-slate-600 pt-1">Total Transfer</p>
                      <p className="text-xl font-extrabold text-slate-900">Rp 3.850.000</p>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-dashed border-slate-200 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tanggal</span>
                        <span className="font-medium text-slate-900">27/11/2026 09:42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Dari Rekening</span>
                        <span className="font-medium text-slate-900">RAKA PRATAMA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Ke Rekening</span>
                        <span className="font-medium text-slate-900">PT VELORA (8821004911)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">No. Referensi</span>
                        <span className="font-mono text-slate-900">TRF884129002</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Mock Multi-Page PDF Document Reader Page */
                  <div
                    style={{ transform: `scale(${viewerZoom / 100})` }}
                    className="transition-transform duration-200 bg-white rounded-lg w-full max-w-sm p-6 shadow-2xl space-y-4 text-xs"
                  >
                    <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {pdfPage === 1
                            ? 'SURAT BUKTI PEMBAYARAN RESMI'
                            : pdfPage === 2
                              ? 'RINCIAN FAKTUR PAJAK & PPN'
                              : 'HALAMAN PENGESAHAN & TANDA TANGAN'}
                        </p>
                        <p className="text-[10px] text-slate-600">Dokumen #PDF-VLR-2026 • Halaman {pdfPage} dari 3</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                        PDF
                      </span>
                    </div>

                    {pdfPage === 1 && (
                      <div className="space-y-2.5 text-[11px] text-slate-700 leading-relaxed">
                        <p>Telah diterima pembayaran pelunasan tagihan operasional periode November 2026 sebesar:</p>
                        <div className="p-3 rounded-lg border border-slate-200 font-bold text-slate-900 text-sm">
                          Rp 3.850.000,-
                        </div>
                        <p>Pembayaran divalidasi secara otomatis melalui rekening escrow perusahaan.</p>
                      </div>
                    )}

                    {pdfPage === 2 && (
                      <div className="space-y-2 text-[11px]">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-600">DPP Jasa &amp; Akomodasi</span>
                          <span className="font-medium text-slate-900">Rp 3.468.468</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-600">PPN 11% (Faktur 010.004)</span>
                          <span className="font-medium text-slate-900">Rp 381.532</span>
                        </div>
                        <div className="flex justify-between py-1 font-bold text-slate-900">
                          <span>Total Bruto</span>
                          <span>Rp 3.850.000</span>
                        </div>
                      </div>
                    )}

                    {pdfPage === 3 && (
                      <div className="space-y-3 text-[11px] text-slate-700">
                        <p>Dokumen ini dicetak secara elektronik oleh Sistem ERP Velora dan sah tanpa tanda tangan basah.</p>
                        <div className="p-3 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900">Terverifikasi Digital</p>
                            <p className="text-[10px] text-slate-600">ID: SIG-9021-VLR</p>
                          </div>
                          <ShieldCheck className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Verification Metadata & Actions */}
            <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between space-y-4 text-xs border-t lg:border-t-0 lg:border-l border-slate-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Detail &amp; Verifikasi</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      proofStatus === 'verified'
                        ? GRAD.success
                        : proofStatus === 'rejected'
                          ? GRAD.danger
                          : GRAD.warning
                    }`}
                  >
                    {proofStatus === 'verified'
                      ? 'Terverifikasi Sah'
                      : proofStatus === 'rejected'
                        ? 'Bukti Ditolak'
                        : 'Perlu Verifikasi'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Kode Pembayaran</span>
                    <span className="font-mono font-semibold text-slate-900">TRF-2026-88412</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nama Pengirim</span>
                    <span className="font-semibold text-slate-900">Raka Pratama</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Rekening Tujuan</span>
                    <span className="font-medium text-slate-900">BCA •••• 4911</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-slate-100">
                    <span className="text-slate-600">Nominal Tercatat</span>
                    <span className="font-bold text-[#175cd3]">Rp 3.850.000</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-slate-700 block">Catatan Verifikator Finance</label>
                  <textarea
                    rows={2}
                    value={proofNote}
                    onChange={(e) => setProofNote(e.target.value)}
                    placeholder="Tambahkan catatan (wajib bila bukti buram / nominal beda)..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#1351b8]"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!proofNote.trim()) {
                        showToast('Isi catatan alasan penolakan bukti terlebih dahulu!', 'warning');
                        return;
                      }
                      setProofStatus('rejected');
                      showToast('Bukti transfer ditandai tidak valid.', 'warning');
                    }}
                    className={`py-2 px-3 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer ${GRAD.danger}`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Tolak Bukti
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProofStatus('verified');
                      showToast('Bukti transfer & PDF berhasil diverifikasi sah!', 'success');
                    }}
                    className={`py-2 px-3 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer ${GRAD.success}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verifikasi Sah
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Membuka dialog cetak lampiran...', 'info')}
                    className={`flex-1 py-2 px-3 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer ${GRAD.light}`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Berkas lampiran diunduh!', 'success')}
                    className={`flex-1 py-2 px-3 rounded-xl font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer ${GRAD.primary}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalShell>
      )}

      {/* 2. DIGITAL SIGNATURE / E-SIGNATURE CANVAS */}
      {activeModal === 'signature-pad' && (
        <ModalShell onClose={onClose} maxWidth="max-w-lg">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.primaryStatic}`}>
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Tanda Tangan Digital (E-Sign)</h4>
                <p className="text-[11px] text-slate-600">Gambar tanda tangan langsung di area canvas atau ketik inisial</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setSigMode('draw')}
                  className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                    sigMode === 'draw' ? GRAD.primary : GRAD.light
                  }`}
                >
                  Gambar Bebas (Canvas)
                </button>
                <button
                  type="button"
                  onClick={() => setSigMode('type')}
                  className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                    sigMode === 'type' ? GRAD.primary : GRAD.light
                  }`}
                >
                  Ketik Nama
                </button>
              </div>

              {sigMode === 'draw' && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-600">Tinta:</span>
                  {(['#0f172a', '#175cd3'] as const).map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSigColor(col)}
                      style={{ backgroundColor: col }}
                      className={`w-5 h-5 rounded-full cursor-pointer border-2 ${
                        sigColor === col ? 'border-amber-400 scale-110' : 'border-white shadow-xs'
                      }`}
                      title={col === '#0f172a' ? 'Hitam Slate' : 'Biru Resmi'}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={clearSigCanvas}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer ${GRAD.light}`}
                  >
                    <Eraser className="w-3 h-3" />
                    Bersihkan
                  </button>
                </div>
              )}
            </div>

            {sigMode === 'draw' ? (
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={170}
                  onPointerDown={handleSigPointerDown}
                  onPointerMove={handleSigPointerMove}
                  onPointerUp={handleSigPointerUp}
                  onPointerLeave={handleSigPointerUp}
                  className="w-full h-40 touch-none cursor-crosshair block"
                />
                {!sigHasStroke && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-500 text-xs">
                    Goreskan mouse / jari Anda di sini untuk menandatangani dokumen
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={sigTypedName}
                  onChange={(e) => setSigTypedName(e.target.value)}
                  placeholder="Ketik nama lengkap penandatangan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-none focus:border-[#1351b8]"
                />
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-300 text-center">
                  <p className="text-3xl italic font-serif text-[#175cd3] tracking-wide">
                    {sigTypedName || 'Nama Anda'}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">Pratinjau Stempel Tanda Tangan Elektronik</p>
                </div>
              </div>
            )}

            {savedSigDataUrl && sigMode === 'draw' && (
              <div className="p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-900">Tanda tangan tersimpan siap ditempel ke PDF</span>
                </div>
                <img src={savedSigDataUrl} alt="Saved Signature" className="h-8 border border-slate-100 rounded" />
              </div>
            )}

            <label className="flex items-start gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={sigAgree}
                onChange={(e) => setSigAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-sm text-[#175cd3]"
              />
              <span>
                Saya menyatakan bahwa tanda tangan digital ini sah secara hukum untuk pengesahan dokumen #BAST-2026-09.
              </span>
            </label>
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                if (!sigAgree) {
                  showToast('Centang persetujuan keabsahan tanda tangan dulu!', 'warning');
                  return;
                }
                if (sigMode === 'draw') {
                  if (!sigHasStroke) {
                    showToast('Silakan goreskan tanda tangan di canvas terlebih dahulu.', 'warning');
                    return;
                  }
                  const dataUrl = canvasRef.current?.toDataURL('image/png') ?? null;
                  setSavedSigDataUrl(dataUrl);
                }
                showToast('Tanda tangan digital berhasil disimpan ke dokumen!', 'success');
              }}
              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              Simpan Tanda Tangan
            </button>
          </div>
        </ModalShell>
      )}

      {/* 3. BULK ACTION / AKSI MASSAL TERPILIH */}
      {activeModal === 'bulk-action' && (
        <ModalShell onClose={onClose} maxWidth="max-w-lg">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.info}`}>
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Aksi Massal ({bulkSelected.length} Data Terpilih)</h4>
                <p className="text-[11px] text-slate-600">Terapkan perubahan ke banyak baris tabel sekaligus</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Daftar Item Tercentang</span>
                <button
                  type="button"
                  onClick={() =>
                    setBulkSelected(
                      bulkSelected.length === BULK_CANDIDATES.length
                        ? []
                        : BULK_CANDIDATES.map((c) => c.id),
                    )
                  }
                  className="text-[#1351b8] hover:underline font-semibold cursor-pointer"
                >
                  {bulkSelected.length === BULK_CANDIDATES.length ? 'Lepas Semua' : 'Pilih Semua'}
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                {BULK_CANDIDATES.map((emp) => {
                  const checked = bulkSelected.includes(emp.id);
                  return (
                    <label
                      key={emp.id}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBulkRow(emp.id)}
                          className="w-4 h-4 rounded-sm text-[#175cd3]"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{emp.name}</p>
                          <p className="text-[11px] text-slate-600">{emp.dept}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.light}`}>
                        {emp.status}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-slate-800 block">Jenis Aksi Massal</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'status' as const, label: 'Ubah Status' },
                  { id: 'division' as const, label: 'Pindah Divisi' },
                  { id: 'delete' as const, label: 'Arsip / Hapus' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setBulkMode(act.id)}
                    className={`py-2 px-2 rounded-xl font-semibold cursor-pointer ${
                      bulkMode === act.id
                        ? act.id === 'delete'
                          ? GRAD.danger
                          : GRAD.primary
                        : GRAD.light
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {bulkMode === 'status' && (
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Set Status Baru Menjadi</label>
                <select
                  value={bulkTargetStatus}
                  onChange={(e) => setBulkTargetStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white outline-none focus:border-[#1351b8]"
                >
                  <option value="Aktif Permanen">Aktif Permanen</option>
                  <option value="Kontrak (PKWT)">Kontrak (PKWT)</option>
                  <option value="Non-Aktif Sementara">Non-Aktif Sementara</option>
                </select>
              </div>
            )}

            {bulkMode === 'division' && (
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Pindahkan ke Departemen</label>
                <select
                  value={bulkTargetDiv}
                  onChange={(e) => setBulkTargetDiv(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white outline-none focus:border-[#1351b8]"
                >
                  <option value="Technology & Product">Technology &amp; Product</option>
                  <option value="Finance & Accounting">Finance &amp; Accounting</option>
                  <option value="Operations & GA">Operations &amp; GA</option>
                </select>
              </div>
            )}

            {bulkMode === 'delete' && (
              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-800 flex items-center gap-2">
                <Trash2 className="w-4 h-4 shrink-0" />
                <span>Sebanyak {bulkSelected.length} data terpilih akan diarsipkan dari direktori aktif.</span>
              </div>
            )}
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
              Batal
            </button>
            <button
              type="button"
              disabled={bulkSelected.length === 0}
              onClick={() => {
                showToast(
                  bulkMode === 'delete'
                    ? `${bulkSelected.length} data berhasil diarsipkan massal!`
                    : `Perubahan diterapkan ke ${bulkSelected.length} data terpilih!`,
                  bulkMode === 'delete' ? 'warning' : 'success',
                );
                onClose();
              }}
              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-xs inline-flex items-center gap-1.5 ${
                bulkSelected.length === 0
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : `${bulkMode === 'delete' ? GRAD.danger : GRAD.primary} cursor-pointer`
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Terapkan ke {bulkSelected.length} Data
            </button>
          </div>
        </ModalShell>
      )}

      {/* 4. QR CODE CHECK-IN & AUTHENTICATOR SETUP */}
      {activeModal === 'qr-authenticator' && (
        <ModalShell onClose={onClose} maxWidth="max-w-md">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.dark}`}>
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">QR Code Authenticator &amp; Check-In</h4>
                <p className="text-[11px] text-slate-600">Pairing aplikasi 2FA atau tiket presensi QR</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQrMode('2fa')}
                className={`py-2 px-3 rounded-xl font-semibold cursor-pointer ${
                  qrMode === '2fa' ? GRAD.primary : GRAD.light
                }`}
              >
                Setup 2FA Authenticator
              </button>
              <button
                type="button"
                onClick={() => setQrMode('checkin')}
                className={`py-2 px-3 rounded-xl font-semibold cursor-pointer ${
                  qrMode === 'checkin' ? GRAD.primary : GRAD.light
                }`}
              >
                QR Absensi / Event
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white flex flex-col items-center space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs">
                <svg viewBox="0 0 15 15" className="w-36 h-36" aria-label="QR Code Matrix">
                  {QR_MATRIX.map((row, y) =>
                    row.map((cell, x) =>
                      cell === 1 ? (
                        <rect
                          key={`${x}-${y}`}
                          x={x}
                          y={y}
                          width={0.92}
                          height={0.92}
                          rx={0.12}
                          fill={qrMode === '2fa' ? '#0f172a' : '#175cd3'}
                        />
                      ) : null,
                    ),
                  )}
                </svg>
              </div>
              <p className="text-[11px] text-slate-600 text-center">
                {qrMode === '2fa'
                  ? 'Scan QR menggunakan Google Authenticator, Authy, atau 1Password.'
                  : 'Tunjukkan QR ini ke scanner pintu masuk atau aplikasi mobile presensi.'}
              </p>
            </div>

            {qrMode === '2fa' ? (
              <>
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200">
                  <code className="font-mono font-semibold text-slate-900 text-xs">VLR4-882K-Q91X-P20M</code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('VLR4-882K-Q91X-P20M');
                      showToast('Kode setup 2FA disalin!', 'success');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer ${GRAD.light}`}
                  >
                    <Copy className="w-3 h-3" />
                    Salin Kode
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    inputMode="numeric"
                    value={qrVerifyCode}
                    onChange={(e) => setQrVerifyCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Kode 6 digit dari app"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 outline-none focus:border-[#1351b8]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (qrVerifyCode.length < 6) {
                        showToast('Masukkan 6 digit kode verifikasi!', 'warning');
                        return;
                      }
                      showToast('Perangkat Authenticator berhasil ditautkan!', 'success');
                      onClose();
                    }}
                    className={`px-4 py-2 rounded-xl font-semibold cursor-pointer ${GRAD.success}`}
                  >
                    Verifikasi
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-700">TIKET: EV-2026-SCBD-09</span>
                <button
                  type="button"
                  onClick={() => showToast('Gambar QR Presensi berhasil diunduh (.png)!', 'success')}
                  className={`px-4 py-2 rounded-xl font-semibold inline-flex items-center gap-1.5 cursor-pointer ${GRAD.primary}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Simpan QR
                </button>
              </div>
            )}
          </div>
        </ModalShell>
      )}

      {/* 5. SYSTEM MAINTENANCE & RELEASE ALERT */}
      {activeModal === 'system-maintenance' && (
        <ModalShell onClose={onClose} maxWidth="max-w-md">
          <div className="p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs ${
                    noticeMode === 'maintenance' ? GRAD.warning : GRAD.primaryStatic
                  }`}
                >
                  {noticeMode === 'maintenance' ? <Wrench className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {noticeMode === 'maintenance' ? 'Jadwal Pemeliharaan Server' : 'Rilis Velora UI v2.5 Tersedia'}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {noticeMode === 'maintenance'
                      ? 'Sabtu, 28 Nov 2026 • 23:00 – 01:30 WIB'
                      : 'Peningkatan performa & 36+ Modal Interaktif'}
                  </p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setNoticeMode('maintenance')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                  noticeMode === 'maintenance' ? GRAD.warning : GRAD.light
                }`}
              >
                Mode Maintenance
              </button>
              <button
                type="button"
                onClick={() => setNoticeMode('release')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                  noticeMode === 'release' ? GRAD.primary : GRAD.light
                }`}
              >
                Mode Update Rilis
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2 text-slate-700 leading-relaxed">
              {noticeMode === 'maintenance' ? (
                <>
                  <p>Kami akan melakukan migrasi database utama untuk meningkatkan kecepatan query laporan sebesar 3x lipat:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Sinkronisasi Payroll &amp; Bank VA dijeda sementara selama ±90 menit</li>
                    <li>Dashboard laporan tetap dapat diakses dalam mode read-only</li>
                    <li>Harap selesaikan approval transaksi sebelum pukul 22:45 WIB</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>Versi terbaru membawa modul dokumen PDF/Bukti Transfer viewer, E-Signature canvas, serta format nominal otomatis:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Multi-attachment preview dengan kontrol rotate &amp; zoom</li>
                    <li>Validasi baris Excel/CSV instan sebelum impor database</li>
                    <li>Audit Trail diff log Before → After untuk role Finance</li>
                  </ul>
                </>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={remindEmail}
                onChange={(e) => setRemindEmail(e.target.checked)}
                className="w-4 h-4 rounded-sm text-[#175cd3]"
              />
              <span>Kirim notifikasi status selesai ke email saya</span>
            </label>

            <div className="pt-1 flex justify-end gap-2">
              <button type="button" onClick={onClose} className={`px-4 py-2 font-semibold rounded-xl cursor-pointer ${GRAD.light}`}>
                Ingatkan Nanti
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(
                    noticeMode === 'maintenance'
                      ? 'Pengingat jadwal maintenance diaktifkan!'
                      : 'Changelog Velora v2.5 dibuka!',
                    'success',
                  );
                  onClose();
                }}
                className={`px-5 py-2 font-semibold rounded-xl shadow-xs cursor-pointer ${GRAD.primary}`}
              >
                Mengerti
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* 6. KEYBOARD SHORTCUTS CHEATSHEET */}
      {activeModal === 'keyboard-shortcuts' && (
        <ModalShell onClose={onClose} maxWidth="max-w-xl">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${GRAD.dark}`}>
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">Pintasan Keyboard (Shortcuts)</h4>
                <p className="text-[11px] text-slate-600">Bekerja lebih cepat di seluruh modul dashboard Velora UI</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pt-4">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 focus-within:border-[#1351b8]">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={shortcutQuery}
                onChange={(e) => setShortcutQuery(e.target.value)}
                placeholder="Cari nama aksi atau tombol (mis. Ctrl, Kanban)..."
                className="w-full text-xs sm:text-sm text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-[58vh] overflow-y-auto text-xs">
            {filteredShortcuts.length === 0 ? (
              <p className="text-center text-slate-600 py-8">Tidak ada shortcut yang cocok dengan pencarian Anda.</p>
            ) : (
              filteredShortcuts.map((group) => (
                <div key={group.group} className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">{group.group}</p>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {group.items.map((it) => (
                      <div key={it.action} className="px-4 py-2.5 flex items-center justify-between gap-3">
                        <span className="font-medium text-slate-800">{it.action}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {it.keys.map((k) => (
                            <kbd
                              key={k}
                              className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-mono text-[11px] font-semibold text-slate-800 shadow-2xs"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>
              Nominal format demo: <strong className="text-slate-900">Rp {formatThousandDot('150000')}</strong>
            </span>
            <button type="button" onClick={onClose} className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${GRAD.primary}`}>
              Tutup Panduan
            </button>
          </div>
        </ModalShell>
      )}
    </>
  );
}
