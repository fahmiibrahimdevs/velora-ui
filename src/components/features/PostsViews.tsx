import { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Archive,
  CheckCircle2,
  Bold,
  Italic,
  List,
  Link2,
  Image as ImageIcon,
  Tag,
  Send,
  Save,
  ArrowRight,
  X,
} from 'lucide-react';
import { showToast, showSuccess, confirmDialog } from '../../lib/swal';
import { FeatureSectionHeader } from './FeatureSectionHeader';

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

type PostStatus = 'Published' | 'Draft' | 'Pending';

interface PostItem {
  id: string;
  title: string;
  category: string;
  author: string;
  status: PostStatus;
  views: number;
  date: string;
  excerpt: string;
}

const INITIAL_POSTS: PostItem[] = [
  {
    id: 'POST-209',
    title: 'Panduan Lengkap Membangun Design System React 19 & Tailwind v4',
    category: 'UI Engineering',
    author: 'Fahmi Ibrahim',
    status: 'Published',
    views: 4280,
    date: '26 Nov 2026',
    excerpt: 'Langkah demi langkah membangun komponen reusable dengan token warna konsisten.',
  },
  {
    id: 'POST-208',
    title: 'Optimasi Query TanStack & Caching Strategis di Dashboard Enterprise',
    category: 'Performance',
    author: 'Nadia Kusuma',
    status: 'Published',
    views: 3190,
    date: '24 Nov 2026',
    excerpt: 'Cara menjaga latensi di bawah 50ms untuk tabel ribuan baris.',
  },
  {
    id: 'POST-207',
    title: 'Arsitektur Keamanan RBAC dan Audit Trail Real-Time',
    category: 'Security',
    author: 'Rizky Hidayat',
    status: 'Pending',
    views: 0,
    date: '23 Nov 2026',
    excerpt: 'Checklist validasi peran admin sebelum rilis produksi.',
  },
  {
    id: 'POST-206',
    title: 'Integrasi Peta Vektor SVG Ringan Tanpa Beban CDN Eksternal',
    category: 'Data Viz',
    author: 'Bima Pratama',
    status: 'Draft',
    views: 0,
    date: '21 Nov 2026',
    excerpt: 'Studi kasus pemetaan 256 negara dan 34 provinsi Indonesia secara lokal.',
  },
  {
    id: 'POST-205',
    title: 'Checklist Aksesibilitas Warna & Kontras pada Kartu Eksekutif',
    category: 'Design Ops',
    author: 'Siti Rahmawati',
    status: 'Published',
    views: 1940,
    date: '19 Nov 2026',
    excerpt: 'Standar keterbacaan teks dark slate pada latar putih bersih.',
  },
];

// ============================================================================
// 1. POSTS MANAGEMENT PAGE (#/posts)
// ============================================================================
export function PostsView({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [statusFilter, setStatusFilter] = useState<'All' | PostStatus>('All');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewPost, setPreviewPost] = useState<PostItem | null>(null);

  const counts = useMemo(
    () => ({
      All: posts.length,
      Published: posts.filter((p) => p.status === 'Published').length,
      Draft: posts.filter((p) => p.status === 'Draft').length,
      Pending: posts.filter((p) => p.status === 'Pending').length,
    }),
    [posts]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [posts, statusFilter, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((p) => p.id));
    }
  };

  const applyBulkStatus = (nextStatus: PostStatus) => {
    setPosts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: nextStatus } : p))
    );
    showToast(`${selectedIds.length} artikel diubah menjadi ${nextStatus}.`, 'success');
    setSelectedIds([]);
  };

  const handleDelete = async (post: PostItem) => {
    const ok = await confirmDialog({
      title: 'Hapus Artikel?',
      text: `Artikel "${post.title}" akan dihapus dari daftar.`,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      isDangerous: true,
      icon: 'warning',
    });
    if (!ok) return;
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    setSelectedIds((prev) => prev.filter((id) => id !== post.id));
    showToast('Artikel dihapus.', 'success');
  };

  const statusBadge = (status: PostStatus) => {
    if (status === 'Published') return GRAD.success;
    if (status === 'Pending') return GRAD.warning;
    return GRAD.secondary;
  };

  return (
    <div className="space-y-6">
      <FeatureSectionHeader
        title="Posts"
        description="Kelola artikel, status publikasi, pratinjau cepat, dan aksi massal konten dalam satu daftar terstruktur."
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(
          [
            { key: 'All', label: 'Total Artikel', count: counts.All, grad: GRAD.primaryStatic },
            { key: 'Published', label: 'Published', count: counts.Published, grad: GRAD.success },
            { key: 'Pending', label: 'Pending Review', count: counts.Pending, grad: GRAD.warning },
            { key: 'Draft', label: 'Draft Tersimpan', count: counts.Draft, grad: GRAD.info },
          ] as const
        ).map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => setStatusFilter(card.key)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 text-left flex items-center justify-between gap-3 cursor-pointer hover:border-[#175cd3]/50 transition-all"
          >
            <div>
              <div className="text-xs font-semibold text-slate-600">{card.label}</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{card.count}</div>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${card.grad}`}>
              <FileText className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>

      {/* Main Posts Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'Published', 'Pending', 'Draft'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  statusFilter === st ? GRAD.primary : GRAD.light
                }`}
              >
                {st} ({counts[st]})
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul atau penulis..."
                className="pl-8 pr-3 py-1.5 w-56 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
            </div>

            <button
              type="button"
              onClick={() => onNavigate('post-create')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${GRAD.primary}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Artikel Baru</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-800">
              {selectedIds.length} artikel terpilih
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyBulkStatus('Published')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.success}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Publish
              </button>
              <button
                type="button"
                onClick={() => applyBulkStatus('Draft')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.light}`}
              >
                <Archive className="w-3.5 h-3.5" /> Set Draft
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600">
                <th className="py-3 pr-3 w-8">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded accent-[#175cd3] cursor-pointer"
                  />
                </th>
                <th className="py-3 pr-4">Judul Artikel</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Penulis</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 pl-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pr-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post.id)}
                      onChange={() => toggleSelect(post.id)}
                      className="w-4 h-4 rounded accent-[#175cd3] cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="font-bold text-slate-900">{post.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{post.excerpt}</div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 font-semibold whitespace-nowrap">{post.author}</td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusBadge(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                    <div>{post.date}</div>
                    <div className="text-[10px] text-slate-400">{post.views.toLocaleString()} views</div>
                  </td>
                  <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewPost(post)}
                        className={`p-1.5 rounded-lg cursor-pointer ${GRAD.light}`}
                        title="Lihat Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('post-create')}
                        className={`p-1.5 rounded-lg cursor-pointer ${GRAD.info}`}
                        title="Edit di Composer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post)}
                        className={`p-1.5 rounded-lg cursor-pointer ${GRAD.danger}`}
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline Quick Preview Modal Card */}
      {previewPost && (
        <div className="bg-white rounded-2xl border border-[#175cd3]/40 shadow-sm p-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.primaryStatic}`}>
                Quick Preview &bull; {previewPost.id}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1.5">{previewPost.title}</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Ditulis oleh <strong>{previewPost.author}</strong> pada {previewPost.date}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPreviewPost(null)}
              className={`p-1.5 rounded-xl cursor-pointer ${GRAD.light}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{previewPost.excerpt}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. POST CREATE COMPOSER (#/post-create)
// ============================================================================
export function PostCreateView({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [title, setTitle] = useState('Membangun Pengalaman Dashboard Modern dengan Velora UI');
  const [category, setCategory] = useState('UI Engineering');
  const [status, setStatus] = useState<PostStatus>('Published');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['react-19', 'tailwind-v4', 'velora-ui']);
  const [thumbnailTheme, setThumbnailTheme] = useState<'primary' | 'info' | 'dark'>('primary');
  const [content, setContent] = useState(
    'Velora UI memadukan konsistensi tipografi eksekutif, palet gradient royal blue, dan komponen interaktif tanpa ketergantungan eksternal berat.\n\n- Ringan & responsif di semua ukuran layar\n- Mendukung validasi real-time dan SweetAlert2\n- Siap diintegrasikan ke proyek Laravel maupun SPA React'
  );
  const [previewMode, setPreviewMode] = useState(false);

  const generatedSlug = useMemo(
    () =>
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-') || 'artikel-baru',
    [title]
  );

  const addTag = () => {
    const clean = tagInput.trim().toLowerCase();
    if (!clean || tags.includes(clean)) return;
    setTags((prev) => [...prev, clean]);
    setTagInput('');
  };

  const appendFormatting = (snippet: string) => {
    setContent((prev) => `${prev}${prev.endsWith('\n') || !prev ? '' : ' '}${snippet}`);
  };

  const handlePublish = async (targetStatus: PostStatus) => {
    if (!title.trim()) {
      showToast('Judul artikel tidak boleh kosong.', 'warning');
      return;
    }
    setStatus(targetStatus);
    await showSuccess(
      targetStatus === 'Published' ? 'Artikel Dipublikasikan!' : 'Draft Tersimpan',
      `"${title}" berhasil disimpan dengan status ${targetStatus}.`
    );
    onNavigate('posts');
  };

  return (
    <div className="space-y-6">
      <FeatureSectionHeader
        title="Post Create"
        description="Composer artikel lengkap dengan auto-slug, pratinjau langsung, pengatur cover, serta tag dan status terbit."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Main Editor Column */}
      <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Tulis Artikel Baru</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Slug URL: <code className="text-[#175cd3] font-semibold">/blog/{generatedSlug}</code>
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                !previewMode ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
              }`}
            >
              Composer
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                previewMode ? `${GRAD.primaryStatic} shadow-xs` : 'text-slate-600'
              }`}
            >
              Live Preview
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700" htmlFor="post-title">
            Judul Artikel
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#175cd3]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-700" htmlFor="post-body">
              Konten Artikel
            </label>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => appendFormatting('**Teks Tebal**')}
                className={`p-1.5 rounded-lg cursor-pointer ${GRAD.light}`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => appendFormatting('*Teks Miring*')}
                className={`p-1.5 rounded-lg cursor-pointer ${GRAD.light}`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => appendFormatting('\n- Poin daftar baru')}
                className={`p-1.5 rounded-lg cursor-pointer ${GRAD.light}`}
                title="List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => appendFormatting('[Tautan Velora](https://velora-ui.dev)')}
                className={`p-1.5 rounded-lg cursor-pointer ${GRAD.light}`}
                title="Link"
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!previewMode ? (
            <textarea
              id="post-body"
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-[#175cd3]"
            />
          ) : (
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 min-h-[240px]">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${GRAD.info}`}>
                {category}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{content}</div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar Options */}
      <div className="xl:col-span-4 space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Pengaturan Publikasi</h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700" htmlFor="post-cat">
              Kategori
            </label>
            <select
              id="post-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#175cd3]"
            >
              <option value="UI Engineering">UI Engineering</option>
              <option value="Performance">Performance</option>
              <option value="Security">Security</option>
              <option value="Data Viz">Data Viz</option>
              <option value="Design Ops">Design Ops</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700" htmlFor="post-status">
              Status Artikel
            </label>
            <select
              id="post-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#175cd3]"
            >
              <option value="Published">Published</option>
              <option value="Pending">Pending Review</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Thumbnail Banner Picker */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-700">Cover Thumbnail Style</span>
            <div
              className={`h-24 rounded-2xl p-4 flex items-end justify-between shadow-xs ${
                thumbnailTheme === 'primary'
                  ? GRAD.primaryStatic
                  : thumbnailTheme === 'info'
                    ? GRAD.info
                    : GRAD.dark
              }`}
            >
              <div className="text-xs font-bold truncate pr-2">{title}</div>
              <ImageIcon className="w-5 h-5 shrink-0 opacity-85" />
            </div>
            <div className="flex gap-1.5">
              {(['primary', 'info', 'dark'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setThumbnailTheme(t)}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-semibold capitalize cursor-pointer ${
                    thumbnailTheme === t ? GRAD.primary : GRAD.light
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Builder */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-700">Tags</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Tambah tag..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
              />
              <button
                type="button"
                onClick={addTag}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${GRAD.info}`}
              >
                <Tag className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tg) => (
                <button
                  key={tg}
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((item) => item !== tg))}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer ${GRAD.primaryStatic}`}
                >
                  <span>#{tg}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => handlePublish('Published')}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${GRAD.primary}`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publikasikan Artikel</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePublish('Draft')}
                className={`py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 ${GRAD.light}`}
              >
                <Save className="w-3.5 h-3.5" /> Simpan Draft
              </button>
              <button
                type="button"
                onClick={() => onNavigate('posts')}
                className={`py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 ${GRAD.light}`}
              >
                <span>Semua Post</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
