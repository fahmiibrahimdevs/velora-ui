import { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Download,
  Send,
  CheckCircle2,
  Plus,
  Trash2,
  CreditCard,
} from 'lucide-react';
import { showToast, showSuccess } from '../../lib/swal';
import { FeatureSectionHeader } from '../features/FeatureSectionHeader';

const GRAD = {
  primary: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white',
  primaryStatic: 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white',
  info: 'bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0369a1] text-white',
  warning: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#ea580c] hover:to-[#b45309] text-white',
  danger: 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] hover:from-[#dc2626] hover:to-[#991b1b] text-white',
  success: 'bg-gradient-to-r from-[#22c55e] to-[#15803d] hover:from-[#16a34a] hover:to-[#166534] text-white',
  light: 'bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] text-slate-800 border border-slate-200/80',
};

type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

interface InvoiceLine {
  id: string;
  item: string;
  desc: string;
  price: number;
  qty: number;
}

interface InvoiceDoc {
  id: string;
  clientName: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  paymentMethod: string;
  accountInfo: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
}

const INITIAL_INVOICES: InvoiceDoc[] = [
  {
    id: 'INV-2026-089',
    clientName: 'PT Nusantara Digital Kreatif',
    clientAddress: 'Jl. Jend. Sudirman Kav. 52, Jakarta Selatan 12190',
    issueDate: '26 November 2026',
    dueDate: '10 Desember 2026',
    paymentMethod: 'BCA Virtual Account',
    accountInfo: 'VA 8801-2026-9901-089',
    status: 'Paid',
    lines: [
      {
        id: 'l1',
        item: 'Velora UI Enterprise License (Annual)',
        desc: '50 Admin Seats & Multi-Workspace Theme Access',
        price: 3500000,
        qty: 1,
      },
      {
        id: 'l2',
        item: 'Dedicated SLA & Security Compliance Pack',
        desc: 'Audit RBAC & 24/7 Priority Gateway Monitoring',
        price: 1200000,
        qty: 1,
      },
      {
        id: 'l3',
        item: 'Custom Map & Geo Vector Add-on',
        desc: 'Paket 256 Negara + 34 Provinsi Indonesia Offline',
        price: 450000,
        qty: 2,
      },
    ],
  },
  {
    id: 'INV-2026-088',
    clientName: 'CV Sinar Teknologi Mandiri',
    clientAddress: 'Jl. Asia Afrika No. 118, Bandung 40261',
    issueDate: '18 November 2026',
    dueDate: '02 Desember 2026',
    paymentMethod: 'Kartu Kredit Korporat Visa',
    accountInfo: 'Visa Ending •••• 4242',
    status: 'Pending',
    lines: [
      {
        id: 'l4',
        item: 'Velora UI Pro Team License (Monthly)',
        desc: '15 Seats Developer & Designer Access',
        price: 890000,
        qty: 2,
      },
      {
        id: 'l5',
        item: 'Onboarding Workshop Session',
        desc: 'Sesi pelatihan 2 jam bersama tim frontend',
        price: 750000,
        qty: 1,
      },
    ],
  },
];

const formatIdr = (num: number) =>
  `Rp ${num.toLocaleString('id-ID')}`;

export function InvoiceView() {
  const [invoices, setInvoices] = useState<InvoiceDoc[]>(INITIAL_INVOICES);
  const [activeId, setActiveId] = useState<string>('INV-2026-089');
  const [applyDiscount, setApplyDiscount] = useState(true);

  const invoice = useMemo(
    () => invoices.find((inv) => inv.id === activeId) ?? invoices[0],
    [invoices, activeId]
  );

  const subtotal = useMemo(
    () => invoice.lines.reduce((acc, row) => acc + row.price * row.qty, 0),
    [invoice.lines]
  );
  const discountAmount = applyDiscount ? Math.round(subtotal * 0.1) : 0;
  const taxAmount = Math.round((subtotal - discountAmount) * 0.11);
  const grandTotal = subtotal - discountAmount + taxAmount;

  const statusBadge = (s: InvoiceStatus) =>
    s === 'Paid' ? GRAD.success : s === 'Pending' ? GRAD.warning : GRAD.danger;

  const addDemoLine = () => {
    const nextLine: InvoiceLine = {
      id: `l-${Date.now()}`,
      item: 'Tambahan Kursi Admin (Seat Expansion)',
      desc: 'Penambahan kapasitas akun administrator aktif',
      price: 250000,
      qty: 1,
    };
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoice.id ? { ...inv, lines: [...inv.lines, nextLine] } : inv))
    );
    showToast('Baris item baru ditambahkan ke invoice.', 'info');
  };

  const removeLine = (lineId: string) => {
    if (invoice.lines.length <= 1) {
      showToast('Invoice harus memiliki minimal 1 item tagihan.', 'warning');
      return;
    }
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoice.id ? { ...inv, lines: inv.lines.filter((l) => l.id !== lineId) } : inv
      )
    );
  };

  const markAsPaid = async () => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoice.id ? { ...inv, status: 'Paid' } : inv))
    );
    await showSuccess('Pembayaran Terkonfirmasi', `Status ${invoice.id} diperbarui menjadi Lunas (Paid).`);
  };

  return (
    <div className="space-y-6">
      <FeatureSectionHeader
        title="Invoice"
        description="Faktur tagihan resmi siap cetak, kalkulasi diskon & PPN 11% otomatis, serta manajemen item baris."
      />

      {/* Top Switcher & Quick Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {invoices.map((inv) => (
            <button
              key={inv.id}
              type="button"
              onClick={() => setActiveId(inv.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                activeId === inv.id ? `${GRAD.primary} shadow-xs` : GRAD.light
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{inv.id}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setApplyDiscount((v) => !v)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              applyDiscount ? GRAD.info : GRAD.light
            }`}
          >
            Promo Diskon 10%: {applyDiscount ? 'Aktif' : 'Nonaktif'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {invoice.status !== 'Paid' && (
            <button
              type="button"
              onClick={markAsPaid}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.success}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Tandai Lunas
            </button>
          )}
          <button
            type="button"
            onClick={() => showToast(`Invoice ${invoice.id} dikirim ke ${invoice.clientName}.`, 'info')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
          >
            <Send className="w-3.5 h-3.5" /> Kirim Email
          </button>
          <button
            type="button"
            onClick={() => showToast(`Mengunduh ${invoice.id}.pdf (simulasi).`, 'success')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.info}`}
          >
            <Download className="w-3.5 h-3.5" /> Unduh PDF
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
          >
            <Printer className="w-3.5 h-3.5" /> Cetak
          </button>
        </div>
      </div>

      {/* Main Executive White Printable Invoice Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-10 space-y-8">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-xs ${GRAD.primaryStatic}`}>
              V
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">Velora UI Enterprise</div>
              <div className="text-xs text-slate-600">NPWP: 09.412.883.1-011.000 &bull; Jakarta Selatan</div>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="flex sm:justify-end items-center gap-2">
              <span className="text-xl font-bold text-slate-900">#{invoice.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${statusBadge(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
            <div className="text-xs text-slate-600">
              Terbit: <strong>{invoice.issueDate}</strong> &bull; Jatuh Tempo: <strong>{invoice.dueDate}</strong>
            </div>
          </div>
        </div>

        {/* Billing Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Ditagihkan Kepada</div>
            <div className="text-sm font-bold text-slate-900">{invoice.clientName}</div>
            <p className="text-slate-600 leading-relaxed max-w-sm">{invoice.clientAddress}</p>
          </div>

          <div className="md:text-right space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Metode Pembayaran</div>
            <div className="text-sm font-bold text-slate-900 inline-flex md:justify-end items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#175cd3]" />
              <span>{invoice.paymentMethod}</span>
            </div>
            <div className="text-slate-600 font-mono">{invoice.accountInfo}</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Rincian Item Tagihan</h3>
            <button
              type="button"
              onClick={addDemoLine}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Item
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600 bg-slate-50/70">
                  <th className="py-3 px-4 w-10">#</th>
                  <th className="py-3 px-4">Item & Deskripsi</th>
                  <th className="py-3 px-4 text-right">Harga Satuan</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 w-12 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {invoice.lines.map((line, idx) => (
                  <tr key={line.id}>
                    <td className="py-3.5 px-4 font-semibold text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{line.item}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{line.desc}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap text-slate-700">
                      {formatIdr(line.price)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-900">{line.qty}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-900">
                      {formatIdr(line.price * line.qty)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary & Total Box */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
          <div className="max-w-sm space-y-1.5 text-xs text-slate-600">
            <div className="font-bold text-slate-900">Catatan Pembayaran</div>
            <p className="leading-relaxed">
              Mohon cantumkan nomor referensi <strong>{invoice.id}</strong> pada berita transfer. Faktur pajak elektronik diterbitkan otomatis dalam 1x24 jam setelah pelunasan.
            </p>
          </div>

          <div className="w-full md:w-80 rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatIdr(subtotal)}</span>
            </div>
            {applyDiscount && (
              <div className="flex items-center justify-between text-emerald-700">
                <span>Diskon Mitra (10%)</span>
                <span className="font-semibold">- {formatIdr(discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-600">
              <span>PPN (11%)</span>
              <span className="font-semibold text-slate-900">{formatIdr(taxAmount)}</span>
            </div>
            <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">Total Tagihan</span>
              <span className="text-lg font-extrabold text-[#175cd3]">{formatIdr(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
