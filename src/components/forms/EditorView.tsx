import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link2,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Code,
  Code2,
  Quote,
  Minus,
  Undo2,
  Redo2,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  Eye,
  Columns2,
  FileCode2,
  Copy,
  Download,
  Check,
  X,
  ChevronDown,
  Highlighter,
  Palette,
  Smile,
  IndentIncrease,
  IndentDecrease,
  Subscript,
  Superscript,
  Sparkles,
  Trash2,
  Send,
  Save,
  Sun,
  Moon,
  Play,
  RotateCcw,
  Upload,
  FileText,
} from 'lucide-react';
import { showToast, showSuccess } from '../../lib/swal';

// ============================================================================
// SHARED HELPERS
// ============================================================================

function stripHtmlAndCount(html: string) {
  if (typeof document === 'undefined') return { words: 0, chars: 0, text: '' };
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = (tmp.textContent || tmp.innerText || '').trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return { words, chars: text.length, text };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================================
// LIGHTWEIGHT ZERO-DEP SYNTAX HIGHLIGHTER (100% character-exact for caret sync)
// ============================================================================

type CodeLanguage = 'html' | 'css' | 'javascript' | 'json';

function tokenizeWithRegex(
  code: string,
  regex: RegExp,
  renderMatch: (match: RegExpExecArray, key: number) => React.ReactNode
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  regex.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index));
    }
    nodes.push(renderMatch(match, key++));
    lastIndex = regex.lastIndex;
    if (match[0].length === 0) {
      regex.lastIndex++;
    }
  }
  if (lastIndex < code.length) {
    nodes.push(code.slice(lastIndex));
  }
  return nodes;
}

function highlightCss(code: string, isDark: boolean): React.ReactNode[] {
  const regex =
    /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(#[0-9a-fA-F]{3,8}\b)|(\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg)?\b)|([.#:]?[A-Za-z_-][\w-]*(?=\s*[,:{]))|([A-Za-z-]+(?=\s*:))|([{};:,])/g;

  return tokenizeWithRegex(code, regex, (m, k) => {
    if (m[1]) {
      return (
        <span key={k} className={isDark ? 'text-slate-500 italic' : 'text-slate-400 italic'}>
          {m[0]}
        </span>
      );
    }
    if (m[2]) {
      return (
        <span key={k} className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[3]) {
      return (
        <span key={k} className={isDark ? 'text-pink-400' : 'text-pink-600'}>
          {m[0]}
        </span>
      );
    }
    if (m[4]) {
      return (
        <span key={k} className={isDark ? 'text-amber-300' : 'text-orange-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[5]) {
      return (
        <span key={k} className={isDark ? 'text-yellow-300' : 'text-amber-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[6]) {
      return (
        <span key={k} className={isDark ? 'text-sky-300' : 'text-sky-700'}>
          {m[0]}
        </span>
      );
    }
    return (
      <span key={k} className={isDark ? 'text-slate-400' : 'text-slate-500'}>
        {m[0]}
      </span>
    );
  });
}

function highlightJs(code: string, isDark: boolean): React.ReactNode[] {
  const regex =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|default|try|catch|finally|throw|new|typeof|instanceof|in|of|async|await|import|export|from|class|extends|super|this|true|false|null|undefined)\b)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*(?=\s*\())|([{}()[\].,:;+\-*/=<>!&|?]+)/g;

  return tokenizeWithRegex(code, regex, (m, k) => {
    if (m[1]) {
      return (
        <span key={k} className={isDark ? 'text-slate-500 italic' : 'text-slate-400 italic'}>
          {m[0]}
        </span>
      );
    }
    if (m[2]) {
      return (
        <span key={k} className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[3]) {
      return (
        <span key={k} className={isDark ? 'text-violet-400' : 'text-purple-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[4]) {
      return (
        <span key={k} className={isDark ? 'text-amber-300' : 'text-orange-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[5]) {
      return (
        <span key={k} className={isDark ? 'text-blue-400' : 'text-blue-700'}>
          {m[0]}
        </span>
      );
    }
    return (
      <span key={k} className={isDark ? 'text-sky-400' : 'text-sky-700'}>
        {m[0]}
      </span>
    );
  });
}

function highlightJson(code: string, isDark: boolean): React.ReactNode[] {
  const regex =
    /("(?:\\.|[^"\\])*"(?=\s*:))|("(?:\\.|[^"\\])*")|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\]:,])/g;

  return tokenizeWithRegex(code, regex, (m, k) => {
    if (m[1]) {
      return (
        <span key={k} className={isDark ? 'text-sky-300' : 'text-sky-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[2]) {
      return (
        <span key={k} className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[3]) {
      return (
        <span key={k} className={isDark ? 'text-violet-400' : 'text-purple-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[4]) {
      return (
        <span key={k} className={isDark ? 'text-amber-300' : 'text-orange-700'}>
          {m[0]}
        </span>
      );
    }
    return (
      <span key={k} className={isDark ? 'text-slate-400' : 'text-slate-500'}>
        {m[0]}
      </span>
    );
  });
}

function highlightHtmlTag(tagText: string, isDark: boolean): React.ReactNode[] {
  const attrRegex = /(<\/?[A-Za-z][A-Za-z0-9-]*)|(\/?>)|([A-Za-z_:][\w:.-]*(?=\s*=))|(=)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
  return tokenizeWithRegex(tagText, attrRegex, (m, k) => {
    if (m[1] || m[2]) {
      return (
        <span key={k} className={isDark ? 'text-rose-400' : 'text-rose-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[3]) {
      return (
        <span key={k} className={isDark ? 'text-amber-300' : 'text-amber-700'}>
          {m[0]}
        </span>
      );
    }
    if (m[4]) {
      return (
        <span key={k} className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          {m[0]}
        </span>
      );
    }
    return (
      <span key={k} className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>
        {m[0]}
      </span>
    );
  });
}

function highlightHtml(code: string, isDark: boolean): React.ReactNode[] {
  const regex =
    /(<!--[\s\S]*?-->)|(<style\b[^>]*>)([\s\S]*?)(<\/style>)|(<script\b[^>]*>)([\s\S]*?)(<\/script>)|(<\/?[A-Za-z][A-Za-z0-9-]*(?:\s+[^>]*)?>)|(&[A-Za-z0-9#]+;)/gi;

  return tokenizeWithRegex(code, regex, (m, k) => {
    if (m[1]) {
      return (
        <span key={k} className={isDark ? 'text-slate-500 italic' : 'text-slate-400 italic'}>
          {m[0]}
        </span>
      );
    }
    if (m[2] !== undefined) {
      return (
        <React.Fragment key={k}>
          {highlightHtmlTag(m[2], isDark)}
          {highlightCss(m[3], isDark)}
          {highlightHtmlTag(m[4], isDark)}
        </React.Fragment>
      );
    }
    if (m[5] !== undefined) {
      return (
        <React.Fragment key={k}>
          {highlightHtmlTag(m[5], isDark)}
          {highlightJs(m[6], isDark)}
          {highlightHtmlTag(m[7], isDark)}
        </React.Fragment>
      );
    }
    if (m[8]) {
      return <React.Fragment key={k}>{highlightHtmlTag(m[8], isDark)}</React.Fragment>;
    }
    return (
      <span key={k} className={isDark ? 'text-amber-300' : 'text-orange-700'}>
        {m[0]}
      </span>
    );
  });
}

function highlightCode(code: string, lang: CodeLanguage, theme: 'dark' | 'light'): React.ReactNode[] {
  const isDark = theme === 'dark';
  switch (lang) {
    case 'css':
      return highlightCss(code, isDark);
    case 'javascript':
      return highlightJs(code, isDark);
    case 'json':
      return highlightJson(code, isDark);
    case 'html':
    default:
      return highlightHtml(code, isDark);
  }
}

interface SyntaxCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: CodeLanguage;
  theme?: 'dark' | 'light';
  showLineNumbers?: boolean;
  className?: string;
}

function SyntaxCodeEditor({
  value,
  onChange,
  language,
  theme = 'dark',
  showLineNumbers = true,
  className = '',
}: SyntaxCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lines = value.split('\n');
  const isDark = theme === 'dark';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const updated = value.slice(0, start) + '  ' + value.slice(end);
      onChange(updated);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  return (
    <div
      className={`flex overflow-auto ${
        isDark ? 'bg-[#0f172a] text-slate-100' : 'bg-white text-slate-800'
      } ${className}`}
    >
      {showLineNumbers && (
        <div
          aria-hidden="true"
          className={`code-editor-mono select-none py-3.5 px-3 text-right text-xs leading-6 border-r shrink-0 ${
            isDark
              ? 'bg-[#0b1120] border-slate-800 text-slate-500'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          {lines.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>
      )}

      {/* Overlay Grid: pre provides syntax colors & exact sizing; transparent textarea handles input/caret */}
      <div className="grid flex-1 min-w-max">
        <pre
          aria-hidden="true"
          className={`col-start-1 row-start-1 code-editor-mono py-3.5 px-4 text-xs leading-6 whitespace-pre pointer-events-none m-0 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}
        >
          {highlightCode(value, language, theme)}
          {value.endsWith('\n') ? ' ' : ''}
        </pre>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className={`col-start-1 row-start-1 code-editor-mono w-full h-full py-3.5 px-4 text-xs leading-6 whitespace-pre overflow-hidden resize-none bg-transparent text-transparent focus:outline-none m-0 selection:bg-[#175cd3]/35 ${
            isDark ? 'caret-white' : 'caret-slate-900'
          }`}
        />
      </div>
    </div>
  );
}

const SIMPLE_INITIAL_HTML = `<p>Selamat datang di <strong>Simple WYSIWYG Editor</strong>! Anda dapat langsung mengetik atau memformat teks di sini.</p><ul><li>Gunakan toolbar di atas untuk <em>Italic</em>, <u>Underline</u>, atau membuat daftar.</li><li>Sisipkan tautan aktif menggunakan tombol <strong>Link</strong>.</li></ul>`;

const ADVANCED_TEMPLATES: Record<string, { title: string; html: string }> = {
  editorial: {
    title: 'Panduan Arsitektur Design System Velora UI',
    html: `<h1>Membangun Antarmuka Modern yang Konsisten</h1>
<p>Konsistensi visual dan performa render adalah pondasi utama dalam menciptakan pengalaman pengguna yang nyaman pada dashboard berskala enterprise.</p>
<blockquote>"Desain yang baik bukan hanya tentang bagaimana tampilannya, tetapi bagaimana setiap komponen bekerja secara responsif dan intuitif."</blockquote>
<h2>Fitur Utama Dokumen</h2>
<ul>
  <li><strong>Tipografi Terstruktur</strong> — Mendukung Heading H1–H3, kutipan, dan blok kode teknis.</li>
  <li><strong>Tabel &amp; Media Interaktif</strong> — Sisipkan tabel data atau gambar langsung dari URL maupun perangkat lokal.</li>
  <li><strong>Sinkronisasi HTML Dua Arah</strong> — Ubah mode ke <code>HTML Code</code> atau <code>Split Preview</code> kapan saja.</li>
</ul>
<table>
  <thead>
    <tr><th>Komponen</th><th>Status</th><th>Keterangan</th></tr>
  </thead>
  <tbody>
    <tr><td>WYSIWYG Toolbar</td><td>Aktif</td><td>Mendukung format teks, warna, align, dan tabel</td></tr>
    <tr><td>HTML Source Sync</td><td>Aktif</td><td>Dua arah real-time tanpa kehilangan struktur</td></tr>
  </tbody>
</table>
<p>Silakan pilih teks untuk mencoba <strong>pewarnaan</strong>, <mark style="background-color:#fef08a;">highlight</mark>, atau tambahkan tautan ke <a href="https://example.com" target="_blank" rel="noopener noreferrer">Dokumentasi Velora UI</a>.</p>`,
  },
  release: {
    title: 'Release Notes v2.4.0 — Velora Editor Suite',
    html: `<h2>Ringkasan Pembaruan v2.4.0</h2>
<p>Pembaruan ini menghadirkan peningkatan besar pada modul penulisan artikel, manajemen media, dan ekspor dokumen HTML siap-pakai.</p>
<h3>Perubahan Utama</h3>
<ol>
  <li>Penambahan <strong>Interactive Table Grid Picker</strong> hingga 6×6 kolom dan baris.</li>
  <li>Dukungan <em>unggah gambar lokal</em> dan pengaturan lebar gambar otomatis.</li>
  <li>Penambahan mode <code>Split Preview</code> dan <code>Fullscreen</code> untuk fokus menulis maksimal.</li>
</ol>
<pre><code>// Contoh konfigurasi inisialisasi modul
const editorConfig = { mode: 'advanced', livePreview: true };</code></pre>`,
  },
  meeting: {
    title: 'Notulensi Rapat Mingguan Tim Produk',
    html: `<h2>Notulensi Sinkronisasi Produk</h2>
<p><strong>Tanggal:</strong> 26 November 2026 &nbsp;|&nbsp; <strong>Lead:</strong> Tim Engineering</p>
<h3>Agenda Pembahasan</h3>
<ul>
  <li>Review antarmuka <u>Advanced Forms</u> dan validasi input.</li>
  <li>Finalisasi halaman <strong>WYSIWYG Editor</strong> dari versi Simple hingga Advanced.</li>
</ul>
<hr />
<p><em>Catatan:</em> Pastikan seluruh dokumen draf tersimpan sebelum publikasi.</p>`,
  },
  blank: {
    title: 'Dokumen Baru Tanpa Judul',
    html: `<p>Mulai menulis konten Anda di sini...</p>`,
  },
};

const TEXT_COLORS = [
  '#0f172a', '#334155', '#64748b', '#175cd3', '#0284c7', '#059669', '#16a34a',
  '#ca8a04', '#ea580c', '#dc2626', '#db2777', '#7c3aed', '#4f46e5', '#ffffff',
];

const HIGHLIGHT_COLORS = [
  '#fef08a', '#fed7aa', '#fecaca', '#fbcfe8', '#e9d5ff',
  '#bfdbfe', '#bae6fd', '#bbf7d0', '#e2e8f0', 'transparent',
];

const EMOJI_LIST = [
  '✅', '🚀', '🔥', '💡', '📌', '📝', '⚠️', '⭐',
  '❤️', '👍', '📊', '🎯', '📅', '🔗', '⚡', '🎉',
  '→', '•', '©', '™', '✓', '✗', '★', '⌘',
];

const CODE_SAMPLES: Record<'html' | 'css' | 'javascript' | 'json', string> = {
  html: `<div class="velora-card">
  <span class="badge">Live Preview</span>
  <h2>Halo dari Velora Code Editor</h2>
  <p>Edit kode HTML di sebelah kiri, lalu klik <strong>Live Output</strong> untuk melihat hasilnya.</p>
  <button class="btn" onclick="this.textContent='Berhasil Diklik!'">
    Klik Tombol Ini
  </button>
</div>
<style>
  .velora-card {
    font-family: Inter, system-ui, sans-serif;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 20px;
    color: #1e293b;
  }
  .badge {
    display: inline-block;
    background: #dbeafe;
    color: #175cd3;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 999px;
  }
  .btn {
    margin-top: 10px;
    background: #175cd3;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }
</style>`,
  css: `/* Design Tokens - Velora UI Card */
.velora-panel {
  background-color: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.velora-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(23, 92, 211, 0.08);
}`,
  javascript: `// Helper untuk sanitasi dan statistik konten WYSIWYG
function analyzeDocument(rawHtml) {
  const cleanText = rawHtml.replace(/<[^>]+>/g, ' ').trim();
  const words = cleanText ? cleanText.split(/\\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters: cleanText.length,
    readingTime: \`\${readingMinutes} min read\`,
  };
}`,
  json: `{
  "module": "VeloraEditorSuite",
  "version": "2.4.0",
  "features": [
    "simple-wysiwyg",
    "advanced-rich-text",
    "table-grid-inserter",
    "split-live-preview",
    "html-two-way-sync"
  ],
  "theme": {
    "primary": "#175cd3",
    "surface": "#ffffff"
  }
}`,
};

// ============================================================================
// ACTIVE FORMAT TRACKER TYPE
// ============================================================================
interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  insertUnorderedList: boolean;
  insertOrderedList: boolean;
  justifyLeft: boolean;
  justifyCenter: boolean;
  justifyRight: boolean;
  justifyFull: boolean;
  subscript: boolean;
  superscript: boolean;
  blockTag: string;
  activePath: string;
}

const DEFAULT_FORMAT_STATE: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  insertUnorderedList: false,
  insertOrderedList: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
  justifyFull: false,
  subscript: false,
  superscript: false,
  blockTag: 'p',
  activePath: 'p',
};

// ============================================================================
// MAIN EDITOR VIEW
// ============================================================================

export function EditorView() {
  // -------------------------------------------------------------------------
  // 1. SIMPLE WYSIWYG STATE
  // -------------------------------------------------------------------------
  const [simpleTitle, setSimpleTitle] = useState('Memulai Desain Dashboard Modern dengan Velora UI');
  const [simpleCategory, setSimpleCategory] = useState('Tech');
  const [simpleHtml, setSimpleHtml] = useState(SIMPLE_INITIAL_HTML);
  const [simpleFormat, setSimpleFormat] = useState<FormatState>(DEFAULT_FORMAT_STATE);
  const [simpleLinkOpen, setSimpleLinkOpen] = useState(false);
  const [simpleLinkUrl, setSimpleLinkUrl] = useState('https://');
  const [simpleLinkText, setSimpleLinkText] = useState('');
  const [simplePreviewModal, setSimplePreviewModal] = useState(false);

  const simpleEditorRef = useRef<HTMLDivElement>(null);
  const simpleSavedRangeRef = useRef<Range | null>(null);

  // -------------------------------------------------------------------------
  // 2. ADVANCED WYSIWYG STATE
  // -------------------------------------------------------------------------
  const [advTitle, setAdvTitle] = useState(ADVANCED_TEMPLATES.editorial.title);
  const [advStatus, setAdvStatus] = useState<'Draft' | 'Published'>('Draft');
  const [advHtml, setAdvHtml] = useState(ADVANCED_TEMPLATES.editorial.html);
  const [advMode, setAdvMode] = useState<'visual' | 'split' | 'code'>('visual');
  const [advFullscreen, setAdvFullscreen] = useState(false);
  const [advFormat, setAdvFormat] = useState<FormatState>(DEFAULT_FORMAT_STATE);
  const [advPopover, setAdvPopover] = useState<
    null | 'link' | 'image' | 'table' | 'textColor' | 'bgColor' | 'emoji' | 'templates'
  >(null);

  // Advanced Popover Sub-states
  const [advLinkUrl, setAdvLinkUrl] = useState('https://');
  const [advLinkText, setAdvLinkText] = useState('');
  const [advLinkBlank, setAdvLinkBlank] = useState(true);

  const [advImgTab, setAdvImgTab] = useState<'url' | 'upload'>('url');
  const [advImgUrl, setAdvImgUrl] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80');
  const [advImgAlt, setAdvImgAlt] = useState('Ilustrasi Kode & Editor');
  const [advImgWidth, setAdvImgWidth] = useState<'100%' | '75%' | '50%'>('75%');
  const [advImgUploadPreview, setAdvImgUploadPreview] = useState('');

  const [tableHover, setTableHover] = useState<{ rows: number; cols: number }>({ rows: 3, cols: 3 });
  const [customHexColor, setCustomHexColor] = useState('#175cd3');
  const [advFontSize, setAdvFontSize] = useState('14px');
  const [advFontFamily, setAdvFontFamily] = useState('Inter');

  const advEditorRef = useRef<HTMLDivElement>(null);
  const advSavedRangeRef = useRef<Range | null>(null);

  // -------------------------------------------------------------------------
  // 3. CODE EDITOR STATE
  // -------------------------------------------------------------------------
  const [codeLang, setCodeLang] = useState<'html' | 'css' | 'javascript' | 'json'>('html');
  const [codeBuffers, setCodeBuffers] = useState(CODE_SAMPLES);
  const [codeTheme, setCodeTheme] = useState<'dark' | 'light'>('dark');
  const [showCodeOutput, setShowCodeOutput] = useState(false);

  // =========================================================================
  // INITIALIZE CONTENTEDITABLE ON MOUNT
  // =========================================================================
  useEffect(() => {
    if (simpleEditorRef.current && simpleEditorRef.current.innerHTML !== simpleHtml) {
      simpleEditorRef.current.innerHTML = simpleHtml;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (advMode !== 'code' && advEditorRef.current) {
      if (advEditorRef.current.innerHTML !== advHtml) {
        advEditorRef.current.innerHTML = advHtml;
      }
    }
  }, [advMode]); // Sync DOM whenever returning from HTML Code mode or toggling Split mode

  // Escape key closes popovers or fullscreen
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (advPopover) setAdvPopover(null);
        else if (simpleLinkOpen) setSimpleLinkOpen(false);
        else if (advFullscreen) setAdvFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [advPopover, simpleLinkOpen, advFullscreen]);

  // Outside click closes popovers
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (advPopover && !target.closest('[data-editor-popover="adv"]')) {
        setAdvPopover(null);
      }
      if (simpleLinkOpen && !target.closest('[data-editor-popover="simple-link"]')) {
        setSimpleLinkOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [advPopover, simpleLinkOpen]);

  // =========================================================================
  // SELECTION & COMMAND HELPERS
  // =========================================================================
  const readActiveFormats = useCallback((rootEl: HTMLDivElement | null): FormatState => {
    if (!rootEl) return DEFAULT_FORMAT_STATE;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return DEFAULT_FORMAT_STATE;
    const anchor = sel.anchorNode;
    if (!anchor || !rootEl.contains(anchor)) return DEFAULT_FORMAT_STATE;

    const query = (cmd: string) => {
      try {
        return document.queryCommandState(cmd);
      } catch {
        return false;
      }
    };

    // Walk DOM upward inside rootEl to build breadcrumb & blockTag
    const tags: string[] = [];
    let curr: Node | null = anchor.nodeType === Node.TEXT_NODE ? anchor.parentNode : anchor;
    let blockTag = 'p';
    const blockNames = new Set(['p', 'h1', 'h2', 'h3', 'blockquote', 'pre', 'li', 'td', 'th']);

    while (curr && curr !== rootEl) {
      if (curr instanceof HTMLElement) {
        const tag = curr.tagName.toLowerCase();
        tags.unshift(tag);
        if (blockNames.has(tag) && blockTag === 'p') {
          blockTag = tag;
        }
      }
      curr = curr.parentNode;
    }

    return {
      bold: query('bold'),
      italic: query('italic'),
      underline: query('underline'),
      strikeThrough: query('strikeThrough'),
      insertUnorderedList: query('insertUnorderedList'),
      insertOrderedList: query('insertOrderedList'),
      justifyLeft: query('justifyLeft'),
      justifyCenter: query('justifyCenter'),
      justifyRight: query('justifyRight'),
      justifyFull: query('justifyFull'),
      subscript: query('subscript'),
      superscript: query('superscript'),
      blockTag,
      activePath: tags.length > 0 ? tags.join(' › ') : 'p',
    };
  }, []);

  useEffect(() => {
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const node = sel.anchorNode;
      if (simpleEditorRef.current && node && simpleEditorRef.current.contains(node)) {
        setSimpleFormat(readActiveFormats(simpleEditorRef.current));
      }
      if (advEditorRef.current && node && advEditorRef.current.contains(node)) {
        setAdvFormat(readActiveFormats(advEditorRef.current));
      }
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, [readActiveFormats]);

  const saveSelection = (
    rootRef: React.RefObject<HTMLDivElement | null>,
    rangeRef: React.MutableRefObject<Range | null>
  ) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && rootRef.current?.contains(sel.anchorNode)) {
      rangeRef.current = sel.getRangeAt(0).cloneRange();
      return sel.toString();
    }
    rangeRef.current = null;
    return '';
  };

  const restoreSelection = (
    rootRef: React.RefObject<HTMLDivElement | null>,
    rangeRef: React.MutableRefObject<Range | null>
  ) => {
    rootRef.current?.focus();
    const sel = window.getSelection();
    if (sel && rangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(rangeRef.current);
    }
  };

  const execSimpleCmd = (cmd: string, value?: string) => {
    simpleEditorRef.current?.focus();
    document.execCommand(cmd, false, value);
    if (simpleEditorRef.current) {
      setSimpleHtml(simpleEditorRef.current.innerHTML);
      setSimpleFormat(readActiveFormats(simpleEditorRef.current));
    }
  };

  const execAdvCmd = (cmd: string, value?: string) => {
    advEditorRef.current?.focus();
    document.execCommand(cmd, false, value);
    if (advEditorRef.current) {
      setAdvHtml(advEditorRef.current.innerHTML);
      setAdvFormat(readActiveFormats(advEditorRef.current));
    }
  };

  // Insert Link Handlers
  const handleOpenSimpleLink = () => {
    const selectedText = saveSelection(simpleEditorRef, simpleSavedRangeRef);
    setSimpleLinkText(selectedText);
    setSimpleLinkUrl('https://');
    setSimpleLinkOpen((prev) => !prev);
  };

  const handleInsertSimpleLink = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = simpleLinkUrl.trim();
    if (!cleanUrl || cleanUrl === 'https://') {
      showToast('Masukkan URL tautan yang valid.', 'warning');
      return;
    }
    restoreSelection(simpleEditorRef, simpleSavedRangeRef);
    const label = escapeHtml(simpleLinkText.trim() || cleanUrl);
    const href = escapeHtml(cleanUrl);
    document.execCommand(
      'insertHTML',
      false,
      `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
    );
    if (simpleEditorRef.current) {
      setSimpleHtml(simpleEditorRef.current.innerHTML);
    }
    setSimpleLinkOpen(false);
  };

  const handleOpenAdvPopover = (
    type: 'link' | 'image' | 'table' | 'textColor' | 'bgColor' | 'emoji' | 'templates'
  ) => {
    if (advPopover === type) {
      setAdvPopover(null);
      return;
    }
    const selected = saveSelection(advEditorRef, advSavedRangeRef);
    if (type === 'link') {
      setAdvLinkText(selected);
      setAdvLinkUrl('https://');
    }
    setAdvPopover(type);
  };

  const handleInsertAdvLink = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = advLinkUrl.trim();
    if (!cleanUrl || cleanUrl === 'https://') {
      showToast('Masukkan URL tujuan terlebih dahulu.', 'warning');
      return;
    }
    restoreSelection(advEditorRef, advSavedRangeRef);
    const label = escapeHtml(advLinkText.trim() || cleanUrl);
    const href = escapeHtml(cleanUrl);
    const attrs = advLinkBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
    document.execCommand('insertHTML', false, `<a href="${href}"${attrs}>${label}</a>`);
    if (advEditorRef.current) setAdvHtml(advEditorRef.current.innerHTML);
    setAdvPopover(null);
  };

  const handleInsertAdvImage = (e: React.FormEvent) => {
    e.preventDefault();
    const src = advImgTab === 'url' ? advImgUrl.trim() : advImgUploadPreview;
    if (!src) {
      showToast('Pilih gambar atau masukkan URL gambar yang valid.', 'warning');
      return;
    }
    restoreSelection(advEditorRef, advSavedRangeRef);
    const safeAlt = escapeHtml(advImgAlt.trim() || 'Uploaded Image');
    document.execCommand(
      'insertHTML',
      false,
      `<img src="${src}" alt="${safeAlt}" style="width: ${advImgWidth};" /><p><br></p>`
    );
    if (advEditorRef.current) setAdvHtml(advEditorRef.current.innerHTML);
    setAdvPopover(null);
    showToast('Gambar berhasil disisipkan ke editor.', 'success');
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('File harus berupa gambar (PNG, JPG, WebP).', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAdvImgUploadPreview(reader.result);
        setAdvImgAlt(file.name.replace(/\.[^.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInsertTable = (rows: number, cols: number) => {
    restoreSelection(advEditorRef, advSavedRangeRef);
    const headers = Array.from({ length: cols }, (_, c) => `<th>Kolom ${c + 1}</th>`).join('');
    const bodyRows = Array.from({ length: Math.max(1, rows - 1) }, (_, r) => {
      const cells = Array.from({ length: cols }, (__, c) => `<td>Data ${r + 1}.${c + 1}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    const tableHtml = `<table><thead><tr>${headers}</tr></thead><tbody>${bodyRows}</tbody></table><p><br></p>`;
    document.execCommand('insertHTML', false, tableHtml);
    if (advEditorRef.current) setAdvHtml(advEditorRef.current.innerHTML);
    setAdvPopover(null);
  };

  const handleApplyInlineCode = () => {
    advEditorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const selectedText = sel.toString();
    if (selectedText) {
      document.execCommand('insertHTML', false, `<code>${escapeHtml(selectedText)}</code>`);
    } else {
      document.execCommand('insertHTML', false, `<code>code</code>&nbsp;`);
    }
    if (advEditorRef.current) setAdvHtml(advEditorRef.current.innerHTML);
  };

  const handleApplyFontSize = (px: string) => {
    setAdvFontSize(px);
    advEditorRef.current?.focus();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const text = sel.toString();
      document.execCommand('insertHTML', false, `<span style="font-size: ${px};">${escapeHtml(text)}</span>`);
      if (advEditorRef.current) setAdvHtml(advEditorRef.current.innerHTML);
    } else {
      showToast(`Ukuran font ${px} siap digunakan (seleksi teks terlebih dahulu untuk mengubah).`, 'info');
    }
  };

  const handleApplyFontFamily = (family: string) => {
    setAdvFontFamily(family);
    const face = family === 'Monospace' ? 'monospace' : family === 'Serif' ? 'Georgia' : 'Inter';
    execAdvCmd('fontName', face);
  };

  const handleApplyBlockFormat = (tag: string) => {
    if (tag === 'pre') {
      advEditorRef.current?.focus();
      const sel = window.getSelection();
      const text = sel && !sel.isCollapsed ? sel.toString() : '// Tulis kode di sini';
      document.execCommand('insertHTML', false, `<pre><code>${escapeHtml(text)}</code></pre><p><br></p>`);
      if (advEditorRef.current) setAdvHtml(advEditorRef.current.innerHTML);
      return;
    }
    execAdvCmd('formatBlock', tag);
  };

  const handleLoadTemplate = (key: keyof typeof ADVANCED_TEMPLATES) => {
    const tpl = ADVANCED_TEMPLATES[key];
    setAdvTitle(tpl.title);
    setAdvHtml(tpl.html);
    if (advEditorRef.current) {
      advEditorRef.current.innerHTML = tpl.html;
    }
    setAdvPopover(null);
    showToast(`Template "${tpl.title}" dimuat.`, 'info');
  };

  const handleDownloadHtml = () => {
    const fullDoc = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(advTitle)}</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; max-width: 780px; margin: 40px auto; padding: 0 20px; color: #1e293b; line-height: 1.65; }
    blockquote { border-left: 4px solid #175cd3; background: #eff6ff; padding: 10px 16px; margin: 16px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; }
    pre { background: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 8px; overflow-x: auto; }
    code { background: #f1f5f9; color: #be123c; padding: 2px 5px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(advTitle)}</h1>
  ${advHtml}
</body>
</html>`;
    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${advTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'document'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File HTML berhasil diunduh.', 'success');
  };

  const handleCopy = async (content: string, label: string) => {
    try {
      await navigator.clipboard.writeText(content);
      showToast(`${label} berhasil disalin ke clipboard.`, 'success');
    } catch {
      showToast(`Gagal menyalin ${label}.`, 'error');
    }
  };

  // Stats
  const simpleStats = stripHtmlAndCount(simpleHtml);
  const advStats = stripHtmlAndCount(advHtml);
  const readingMinutes = Math.max(1, Math.ceil(advStats.words / 200));

  // Code Editor Helpers
  const activeCode = codeBuffers[codeLang];
  const codeLines = activeCode.split('\n');

  const handleFormatCode = () => {
    if (codeLang === 'json') {
      try {
        const parsed = JSON.parse(activeCode);
        setCodeBuffers((prev) => ({ ...prev, json: JSON.stringify(parsed, null, 2) }));
        showToast('JSON valid dan berhasil dirapikan.', 'success');
      } catch (err) {
        showToast(`Sintaks JSON tidak valid: ${(err as Error).message}`, 'error');
      }
      return;
    }
    const trimmedLines = activeCode
      .split('\n')
      .map((l) => l.replace(/\s+$/g, ''))
      .join('\n');
    setCodeBuffers((prev) => ({ ...prev, [codeLang]: trimmedLines }));
    showToast(`Spasi berlebih pada ${codeLang.toUpperCase()} dibersihkan.`, 'info');
  };

  // Helper button class
  const btnClass = (active: boolean) =>
    `p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
      active
        ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* SUB-HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Editor</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            WYSIWYG editor dari tingkat Simple hingga Advanced lengkap dengan tabel, media, sinkronisasi HTML, dan Code Editor interaktif.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 1: SIMPLE WYSIWYG EDITOR (Stisla Summernote Simple) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="text-base font-bold text-[#175cd3] tracking-tight">Simple Summernote</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Editor ringkas untuk penulisan postingan cepat dengan format dasar, daftar, dan tautan.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#175cd3] text-[11px] font-semibold">
            Simple WYSIWYG
          </span>
        </div>

        <div className="space-y-4">
          {/* Row: Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 form-group">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Title</label>
              <input
                type="text"
                value={simpleTitle}
                onChange={(e) => setSimpleTitle(e.target.value)}
                placeholder="Write your post title..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all"
              />
            </div>

            <div className="form-group">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={simpleCategory}
                  onChange={(e) => setSimpleCategory(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all pr-9 cursor-pointer"
                >
                  <option>Tech</option>
                  <option>News</option>
                  <option>Political</option>
                  <option>Product</option>
                  <option>Tutorial</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Simple WYSIWYG Container */}
          <div className="form-group">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Content</label>
            <div className="border border-slate-200 rounded-xl overflow-visible focus-within:border-[#175cd3] focus-within:ring-2 focus-within:ring-[#175cd3]/10 transition-all bg-white">
              {/* Simple Toolbar */}
              <div className="px-3 py-2 border-b border-slate-200 bg-slate-50/70 rounded-t-xl flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  title="Undo"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execSimpleCmd('undo');
                  }}
                  className={btnClass(false)}
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Redo"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execSimpleCmd('redo');
                  }}
                  className={btnClass(false)}
                >
                  <Redo2 className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-200 mx-1" />

                <button
                  type="button"
                  title="Bold"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execSimpleCmd('bold');
                  }}
                  className={btnClass(simpleFormat.bold)}
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Italic"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execSimpleCmd('italic');
                  }}
                  className={btnClass(simpleFormat.italic)}
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Underline"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execSimpleCmd('underline');
                  }}
                  className={btnClass(simpleFormat.underline)}
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Strikethrough"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execSimpleCmd('strikeThrough');
                  }}
                  className={btnClass(simpleFormat.strikeThrough)}
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-200 mx-1" />

                <button
                  type="button"
                  title="Bullet List"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execSimpleCmd('insertUnorderedList');
                  }}
                  className={btnClass(simpleFormat.insertUnorderedList)}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Numbered List"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execSimpleCmd('insertOrderedList');
                  }}
                  className={btnClass(simpleFormat.insertOrderedList)}
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-200 mx-1" />

                {/* Insert Link Popover */}
                <div className="relative" data-editor-popover="simple-link">
                  <button
                    type="button"
                    title="Insert Link"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleOpenSimpleLink();
                    }}
                    className={btnClass(simpleLinkOpen)}
                  >
                    <Link2 className="w-4 h-4" />
                  </button>

                  {simpleLinkOpen && (
                    <form
                      onSubmit={handleInsertSimpleLink}
                      className="absolute left-0 top-full mt-2 z-30 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 space-y-2.5 animate-in fade-in duration-150"
                    >
                      <div className="text-xs font-bold text-slate-800">Sisipkan Tautan</div>
                      <input
                        type="text"
                        value={simpleLinkText}
                        onChange={(e) => setSimpleLinkText(e.target.value)}
                        placeholder="Teks tampilan (opsional)"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                      />
                      <input
                        type="url"
                        value={simpleLinkUrl}
                        onChange={(e) => setSimpleLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        autoFocus
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                      />
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setSimpleLinkOpen(false)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                        >
                          Sisipkan
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <button
                  type="button"
                  title="Clear Formatting"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    execSimpleCmd('removeFormat');
                  }}
                  className={btnClass(false)}
                >
                  <RemoveFormatting className="w-4 h-4" />
                </button>
              </div>

              {/* Editable Body */}
              <div
                ref={simpleEditorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                  if (simpleEditorRef.current) {
                    setSimpleHtml(simpleEditorRef.current.innerHTML);
                  }
                }}
                onKeyUp={() => setSimpleFormat(readActiveFormats(simpleEditorRef.current))}
                onMouseUp={() => setSimpleFormat(readActiveFormats(simpleEditorRef.current))}
                className="wysiwyg-content min-h-[160px] max-h-[360px] overflow-y-auto px-4 py-3.5 text-sm"
              />

              {/* Simple Status Bar */}
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>
                  {simpleStats.words} kata • {simpleStats.chars} karakter
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimpleHtml(SIMPLE_INITIAL_HTML);
                      if (simpleEditorRef.current) {
                        simpleEditorRef.current.innerHTML = SIMPLE_INITIAL_HTML;
                      }
                      showToast('Konten editor sederhana di-reset.', 'info');
                    }}
                    className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                if (!simpleTitle.trim() || simpleStats.words === 0) {
                  showToast('Judul dan konten tidak boleh kosong!', 'warning');
                  return;
                }
                setSimplePreviewModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Publish Post
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 2: ADVANCED FULL WYSIWYG EDITOR (Enterprise Document Suite) */}
      {/* ========================================================================= */}
      <div
        className={`bg-white border border-slate-200/90 transition-all ${
          advFullscreen
            ? 'fixed inset-0 z-50 rounded-none p-5 sm:p-6 flex flex-col overflow-hidden shadow-2xl'
            : 'rounded-2xl shadow-xs p-6'
        }`}
      >
        {/* Top Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#175cd3] tracking-tight">
                Advanced Full WYSIWYG Editor
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  advStatus === 'Published'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {advStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Editor lengkap dengan heading, font, color picker, table builder, upload gambar, emoji, split preview, dan HTML source sync.
            </p>
          </div>

          {/* Right Action Bar: Templates + Mode Switch + Fullscreen */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Template Selector */}
            <div className="relative" data-editor-popover="adv">
              <button
                type="button"
                onClick={() => handleOpenAdvPopover('templates')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#175cd3]" />
                <span>Templates</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {advPopover === 'templates' && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 animate-in fade-in duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Muat Template Dokumen
                  </div>
                  {(
                    [
                      { key: 'editorial', label: 'Editorial & Design System' },
                      { key: 'release', label: 'Release Notes Changelog' },
                      { key: 'meeting', label: 'Notulensi Rapat' },
                      { key: 'blank', label: 'Dokumen Kosong' },
                    ] as const
                  ).map((tpl) => (
                    <button
                      key={tpl.key}
                      type="button"
                      onClick={() => handleLoadTemplate(tpl.key)}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-[#175cd3] flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{tpl.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Mode Switcher: Visual / Split / HTML Code */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              <button
                type="button"
                onClick={() => setAdvMode('visual')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  advMode === 'visual' ? 'bg-white text-[#175cd3] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visual</span>
              </button>
              <button
                type="button"
                onClick={() => setAdvMode('split')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  advMode === 'split' ? 'bg-white text-[#175cd3] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split</span>
              </button>
              <button
                type="button"
                onClick={() => setAdvMode('code')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  advMode === 'code' ? 'bg-white text-[#175cd3] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>HTML</span>
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setAdvFullscreen(!advFullscreen)}
              title={advFullscreen ? 'Keluar Fullscreen (Esc)' : 'Mode Fullscreen'}
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer transition-colors"
            >
              {advFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Document Title Input */}
        <div className="mb-3">
          <input
            type="text"
            value={advTitle}
            onChange={(e) => setAdvTitle(e.target.value)}
            placeholder="Judul Dokumen..."
            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all"
          />
        </div>

        {/* Main Editor Box */}
        <div
          className={`border border-slate-200 rounded-xl bg-white flex flex-col ${
            advFullscreen ? 'flex-1 min-h-0' : ''
          }`}
        >
          {/* FULL ADVANCED TOOLBAR */}
          <div className="px-3 py-2 border-b border-slate-200 bg-slate-50/80 rounded-t-xl flex flex-wrap items-center gap-1">
            {/* History */}
            <button
              type="button"
              title="Undo"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('undo');
              }}
              className={btnClass(false)}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Redo"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('redo');
              }}
              className={btnClass(false)}
            >
              <Redo2 className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Block Format Dropdown */}
            <select
              value={advFormat.blockTag}
              disabled={advMode === 'code'}
              onChange={(e) => handleApplyBlockFormat(e.target.value)}
              title="Block Format"
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#175cd3] cursor-pointer disabled:opacity-50"
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="blockquote">Blockquote</option>
              <option value="pre">Code Block</option>
            </select>

            {/* Font Family */}
            <select
              value={advFontFamily}
              disabled={advMode === 'code'}
              onChange={(e) => handleApplyFontFamily(e.target.value)}
              title="Font Family"
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#175cd3] cursor-pointer disabled:opacity-50"
            >
              <option value="Inter">Sans (Inter)</option>
              <option value="Serif">Serif (Georgia)</option>
              <option value="Monospace">Monospace</option>
            </select>

            {/* Font Size */}
            <select
              value={advFontSize}
              disabled={advMode === 'code'}
              onChange={(e) => handleApplyFontSize(e.target.value)}
              title="Font Size"
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-[#175cd3] cursor-pointer disabled:opacity-50"
            >
              <option value="12px">12px</option>
              <option value="14px">14px</option>
              <option value="16px">16px</option>
              <option value="20px">20px</option>
              <option value="24px">24px</option>
            </select>

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Inline Styles */}
            <button
              type="button"
              title="Bold"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('bold');
              }}
              className={btnClass(advFormat.bold)}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Italic"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('italic');
              }}
              className={btnClass(advFormat.italic)}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Underline"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('underline');
              }}
              className={btnClass(advFormat.underline)}
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Strikethrough"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('strikeThrough');
              }}
              className={btnClass(advFormat.strikeThrough)}
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Inline Code"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                handleApplyInlineCode();
              }}
              className={btnClass(false)}
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Subscript"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('subscript');
              }}
              className={btnClass(advFormat.subscript)}
            >
              <Subscript className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Superscript"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('superscript');
              }}
              className={btnClass(advFormat.superscript)}
            >
              <Superscript className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Text Color Popover */}
            <div className="relative" data-editor-popover="adv">
              <button
                type="button"
                title="Text Color"
                disabled={advMode === 'code'}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOpenAdvPopover('textColor');
                }}
                className={btnClass(advPopover === 'textColor')}
              >
                <Palette className="w-4 h-4" />
              </button>

              {advPopover === 'textColor' && (
                <div className="absolute left-0 top-full mt-2 z-40 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-3 space-y-2.5 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-slate-800">Warna Teks</div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {TEXT_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => {
                          restoreSelection(advEditorRef, advSavedRangeRef);
                          execAdvCmd('foreColor', hex);
                          setAdvPopover(null);
                        }}
                        style={{ backgroundColor: hex }}
                        className="w-6 h-6 rounded-md border border-slate-200 cursor-pointer hover:scale-110 transition-transform"
                        title={hex}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <input
                      type="color"
                      value={customHexColor}
                      onChange={(e) => setCustomHexColor(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        restoreSelection(advEditorRef, advSavedRangeRef);
                        execAdvCmd('foreColor', customHexColor);
                        setAdvPopover(null);
                      }}
                      className="flex-1 py-1 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Terapkan Custom
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Highlight / Background Color Popover */}
            <div className="relative" data-editor-popover="adv">
              <button
                type="button"
                title="Highlight Color"
                disabled={advMode === 'code'}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOpenAdvPopover('bgColor');
                }}
                className={btnClass(advPopover === 'bgColor')}
              >
                <Highlighter className="w-4 h-4" />
              </button>

              {advPopover === 'bgColor' && (
                <div className="absolute left-0 top-full mt-2 z-40 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-3 space-y-2 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-slate-800">Highlight Teks</div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {HIGHLIGHT_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => {
                          restoreSelection(advEditorRef, advSavedRangeRef);
                          execAdvCmd('hiliteColor', hex);
                          setAdvPopover(null);
                        }}
                        style={{ backgroundColor: hex === 'transparent' ? '#ffffff' : hex }}
                        className="w-7 h-7 rounded-md border border-slate-200 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-[10px] text-slate-500"
                        title={hex === 'transparent' ? 'Hapus Highlight' : hex}
                      >
                        {hex === 'transparent' && <X className="w-3.5 h-3.5 text-rose-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Alignment */}
            <button
              type="button"
              title="Align Left"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('justifyLeft');
              }}
              className={btnClass(advFormat.justifyLeft)}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Align Center"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('justifyCenter');
              }}
              className={btnClass(advFormat.justifyCenter)}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Align Right"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('justifyRight');
              }}
              className={btnClass(advFormat.justifyRight)}
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Justify"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('justifyFull');
              }}
              className={btnClass(advFormat.justifyFull)}
            >
              <AlignJustify className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Lists & Indent */}
            <button
              type="button"
              title="Bullet List"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('insertUnorderedList');
              }}
              className={btnClass(advFormat.insertUnorderedList)}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Numbered List"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('insertOrderedList');
              }}
              className={btnClass(advFormat.insertOrderedList)}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Decrease Indent"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('outdent');
              }}
              className={btnClass(false)}
            >
              <IndentDecrease className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Increase Indent"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('indent');
              }}
              className={btnClass(false)}
            >
              <IndentIncrease className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Rich Inserts: Blockquote, HR, Link, Unlink, Image, Table, Emoji */}
            <button
              type="button"
              title="Blockquote"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('formatBlock', 'blockquote');
              }}
              className={btnClass(advFormat.blockTag === 'blockquote')}
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Horizontal Line"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('insertHorizontalRule');
              }}
              className={btnClass(false)}
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Link Popover */}
            <div className="relative" data-editor-popover="adv">
              <button
                type="button"
                title="Insert Link"
                disabled={advMode === 'code'}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOpenAdvPopover('link');
                }}
                className={btnClass(advPopover === 'link')}
              >
                <Link2 className="w-4 h-4" />
              </button>

              {advPopover === 'link' && (
                <form
                  onSubmit={handleInsertAdvLink}
                  className="absolute left-0 top-full mt-2 z-40 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 space-y-2.5 animate-in fade-in duration-150"
                >
                  <div className="text-xs font-bold text-slate-800">Sisipkan Tautan</div>
                  <input
                    type="text"
                    value={advLinkText}
                    onChange={(e) => setAdvLinkText(e.target.value)}
                    placeholder="Teks tautan (opsional)"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  <input
                    type="url"
                    value={advLinkUrl}
                    onChange={(e) => setAdvLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    autoFocus
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={advLinkBlank}
                      onChange={(e) => setAdvLinkBlank(e.target.checked)}
                      className="rounded border-slate-300 text-[#175cd3]"
                    />
                    <span>Buka di tab baru</span>
                  </label>
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setAdvPopover(null)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Sisipkan
                    </button>
                  </div>
                </form>
              )}
            </div>

            <button
              type="button"
              title="Remove Link"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('unlink');
              }}
              className={btnClass(false)}
            >
              <Unlink className="w-4 h-4" />
            </button>

            {/* Image Popover */}
            <div className="relative" data-editor-popover="adv">
              <button
                type="button"
                title="Insert Image"
                disabled={advMode === 'code'}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOpenAdvPopover('image');
                }}
                className={btnClass(advPopover === 'image')}
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {advPopover === 'image' && (
                <form
                  onSubmit={handleInsertAdvImage}
                  className="absolute right-0 sm:left-0 top-full mt-2 z-40 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 space-y-3 animate-in fade-in duration-150"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Sisipkan Gambar</span>
                    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setAdvImgTab('url')}
                        className={`px-2 py-0.5 rounded-md cursor-pointer ${
                          advImgTab === 'url' ? 'bg-white text-[#175cd3] shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdvImgTab('upload')}
                        className={`px-2 py-0.5 rounded-md cursor-pointer ${
                          advImgTab === 'upload' ? 'bg-white text-[#175cd3] shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Upload
                      </button>
                    </div>
                  </div>

                  {advImgTab === 'url' ? (
                    <input
                      type="url"
                      value={advImgUrl}
                      onChange={(e) => setAdvImgUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    />
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-[#175cd3] rounded-xl p-3 cursor-pointer transition-colors bg-slate-50/50">
                      <Upload className="w-5 h-5 text-[#175cd3] mb-1" />
                      <span className="text-[11px] font-medium text-slate-600 text-center">
                        {advImgUploadPreview ? 'Gambar siap disisipkan (klik untuk ganti)' : 'Pilih file gambar dari perangkat'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="sr-only" />
                    </label>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={advImgAlt}
                      onChange={(e) => setAdvImgAlt(e.target.value)}
                      placeholder="Alt text..."
                      className="col-span-2 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    />
                    <select
                      value={advImgWidth}
                      onChange={(e) => setAdvImgWidth(e.target.value as '100%' | '75%' | '50%')}
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white focus:outline-none"
                    >
                      <option value="100%">100%</option>
                      <option value="75%">75%</option>
                      <option value="50%">50%</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAdvPopover(null)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Sisipkan Gambar
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Interactive Table Grid Picker Popover */}
            <div className="relative" data-editor-popover="adv">
              <button
                type="button"
                title="Insert Table"
                disabled={advMode === 'code'}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOpenAdvPopover('table');
                }}
                className={btnClass(advPopover === 'table')}
              >
                <TableIcon className="w-4 h-4" />
              </button>

              {advPopover === 'table' && (
                <div className="absolute right-0 sm:left-0 top-full mt-2 z-40 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-3 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-slate-800 mb-2 flex items-center justify-between">
                    <span>Sisipkan Tabel</span>
                    <span className="text-[#175cd3]">
                      {tableHover.rows} × {tableHover.cols}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 36 }, (_, idx) => {
                      const r = Math.floor(idx / 6) + 1;
                      const c = (idx % 6) + 1;
                      const active = r <= tableHover.rows && c <= tableHover.cols;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onMouseEnter={() => setTableHover({ rows: r, cols: c })}
                          onClick={() => handleInsertTable(r, c)}
                          className={`w-5 h-5 rounded border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#175cd3]/20 border-[#175cd3]'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Emoji Picker Popover */}
            <div className="relative" data-editor-popover="adv">
              <button
                type="button"
                title="Emoji & Simbol"
                disabled={advMode === 'code'}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOpenAdvPopover('emoji');
                }}
                className={btnClass(advPopover === 'emoji')}
              >
                <Smile className="w-4 h-4" />
              </button>

              {advPopover === 'emoji' && (
                <div className="absolute right-0 top-full mt-2 z-40 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2.5 animate-in fade-in duration-150">
                  <div className="text-xs font-bold text-slate-800 mb-1.5 px-1">Emoji &amp; Simbol</div>
                  <div className="grid grid-cols-6 gap-1">
                    {EMOJI_LIST.map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          restoreSelection(advEditorRef, advSavedRangeRef);
                          document.execCommand('insertText', false, em);
                          if (advEditorRef.current) setAdvHtml(advEditorRef.current.innerHTML);
                          setAdvPopover(null);
                        }}
                        className="h-7 rounded-lg hover:bg-slate-100 text-sm flex items-center justify-center cursor-pointer"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Clear Format & Reset */}
            <button
              type="button"
              title="Clear Formatting"
              disabled={advMode === 'code'}
              onMouseDown={(e) => {
                e.preventDefault();
                execAdvCmd('removeFormat');
              }}
              className={btnClass(false)}
            >
              <RemoveFormatting className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Kosongkan Dokumen"
              onClick={() => handleLoadTemplate('blank')}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* EDITOR BODY (Visual / Split / HTML Code) */}
          <div
            className={`grid ${
              advMode === 'split' ? 'grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200' : 'grid-cols-1'
            } ${advFullscreen ? 'flex-1 min-h-0' : ''}`}
          >
            {/* Visual Canvas */}
            {advMode !== 'code' && (
              <div
                ref={advEditorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                  if (advEditorRef.current) {
                    setAdvHtml(advEditorRef.current.innerHTML);
                  }
                }}
                onKeyUp={() => setAdvFormat(readActiveFormats(advEditorRef.current))}
                onMouseUp={() => setAdvFormat(readActiveFormats(advEditorRef.current))}
                className={`wysiwyg-content px-5 py-4 text-sm overflow-y-auto ${
                  advFullscreen ? 'h-full' : 'min-h-[300px] max-h-[520px]'
                }`}
              />
            )}

            {/* Split Live Preview Pane */}
            {advMode === 'split' && (
              <div
                className={`bg-slate-50/50 px-5 py-4 overflow-y-auto ${
                  advFullscreen ? 'h-full' : 'min-h-[300px] max-h-[520px]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Live Rendered Preview
                  </span>
                  <span className="text-[11px] text-[#175cd3] font-semibold">Auto-synced</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-3">{advTitle || 'Tanpa Judul'}</h1>
                <div
                  className="wysiwyg-content text-sm"
                  dangerouslySetInnerHTML={{ __html: advHtml }}
                />
              </div>
            )}

            {/* Raw HTML Source Editor Mode (Syntax Highlighted) */}
            {advMode === 'code' && (
              <SyntaxCodeEditor
                value={advHtml}
                onChange={setAdvHtml}
                language="html"
                theme="dark"
                className={advFullscreen ? 'h-full' : 'min-h-[300px] max-h-[520px]'}
              />
            )}
          </div>

          {/* BOTTOM STATUS & EXPORT BAR */}
          <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/70 rounded-b-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 text-slate-500">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-medium text-slate-600">
                {advFormat.activePath}
              </span>
              <span>
                <strong className="text-slate-700">{advStats.words}</strong> kata
              </span>
              <span>•</span>
              <span>
                <strong className="text-slate-700">{advStats.chars}</strong> karakter
              </span>
              <span>•</span>
              <span>~{readingMinutes} mnt baca</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(advHtml, 'Kode HTML')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy HTML</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadHtml}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .html</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdvStatus('Draft');
                  showToast('Dokumen disimpan sebagai Draft.', 'info');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Draf</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdvStatus('Published');
                  showSuccess(
                    'Dokumen Dipublikasikan!',
                    `"${advTitle}" (${advStats.words} kata) berhasil dipublikasikan.`
                  );
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CARD 3: CODE EDITOR (Stisla CodeMirror Equivalent + Live Runner) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#175cd3] tracking-tight">Code Editor</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Editor kode multi-bahasa dengan nomor baris otomatis, indentasi Tab, validator JSON, dan pratinjau langsung HTML.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Language Switcher */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
              {(['html', 'css', 'javascript', 'json'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setCodeLang(lang)}
                  className={`px-2.5 py-1 text-xs font-semibold uppercase rounded-lg transition-all cursor-pointer ${
                    codeLang === lang ? 'bg-white text-[#175cd3] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'javascript' ? 'JS' : lang}
                </button>
              ))}
            </div>

            {/* Dark / Light Theme */}
            <button
              type="button"
              onClick={() => setCodeTheme(codeTheme === 'dark' ? 'light' : 'dark')}
              title="Ubah Tema Editor"
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer transition-colors"
            >
              {codeTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Code Action Toolbar */}
          <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Code2 className="w-4 h-4 text-[#175cd3]" />
              <span className="font-semibold text-slate-700 uppercase">{codeLang}</span>
              <span>•</span>
              <span>{codeLines.length} baris</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {codeLang === 'html' && (
                <button
                  type="button"
                  onClick={() => setShowCodeOutput(!showCodeOutput)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border cursor-pointer transition-all ${
                    showCodeOutput
                      ? 'bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] text-white border-[#175cd3]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>{showCodeOutput ? 'Tutup Preview' : 'Live Output'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleFormatCode}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
              >
                {codeLang === 'json' ? 'Format & Validasi JSON' : 'Rapikan'}
              </button>
              <button
                type="button"
                onClick={() => handleCopy(activeCode, `Kode ${codeLang.toUpperCase()}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCodeBuffers((prev) => ({ ...prev, [codeLang]: CODE_SAMPLES[codeLang] }));
                  showToast(`Kode ${codeLang.toUpperCase()} dikembalikan ke contoh awal.`, 'info');
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Code Grid: Line Numbers + Syntax Highlighted Editor (+ Optional Live HTML Preview) */}
          <div className={`grid ${showCodeOutput && codeLang === 'html' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            <SyntaxCodeEditor
              value={activeCode}
              onChange={(val) =>
                setCodeBuffers((prev) => ({ ...prev, [codeLang]: val }))
              }
              language={codeLang}
              theme={codeTheme}
              className="min-h-[260px] max-h-[380px]"
            />

            {/* Sandboxed Live Output Preview for HTML */}
            {showCodeOutput && codeLang === 'html' && (
              <div className="border-t lg:border-t-0 lg:border-l border-slate-200 bg-slate-50 flex flex-col min-h-[260px]">
                <div className="px-3.5 py-1.5 bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Live HTML Output
                </div>
                <iframe
                  title="Live HTML Output"
                  sandbox="allow-scripts"
                  srcDoc={`<!DOCTYPE html><html><body style="margin:16px;background:#f8fafc;">${codeBuffers.html}</body></html>`}
                  className="w-full flex-1 min-h-[230px] bg-slate-50 border-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: SIMPLE POST PUBLISH PREVIEW */}
      {/* ========================================================================= */}
      {simplePreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#175cd3] text-[11px] font-semibold">
                  {simpleCategory}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-1.5">{simpleTitle}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSimplePreviewModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 max-h-72 overflow-y-auto bg-white">
              <div
                className="wysiwyg-content text-sm"
                dangerouslySetInnerHTML={{ __html: simpleHtml }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                {simpleStats.words} kata • Siap diterbitkan
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSimplePreviewModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSimplePreviewModal(false);
                    showSuccess('Berhasil Diterbitkan!', `Artikel "${simpleTitle}" telah disimpan.`);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] hover:from-[#1450be] hover:to-[#0c2e82] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Konfirmasi Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
