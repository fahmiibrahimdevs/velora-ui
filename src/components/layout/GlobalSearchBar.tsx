import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownLeft, Search, X } from 'lucide-react';
import { searchableNavItems } from './navRegistry';

interface GlobalSearchBarProps {
  onNavigate?: (id: string) => void;
  className?: string;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onNavigate,
  className = 'w-full max-w-xs sm:max-w-sm',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return searchableNavItems.slice(0, 7);
    }
    return searchableNavItems
      .filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.group.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q),
      )
      .slice(0, 9);
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global Ctrl+K / Cmd+K shortcut to focus and open search
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectRoute = (id: string) => {
    onNavigate?.(id);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
      return;
    }
    if (e.key === 'Enter' && isOpen && results[selectedIndex]) {
      e.preventDefault();
      selectRoute(results[selectedIndex].id);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search halaman..."
          className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-4 pr-20 py-2 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-white/40 border-none transition-all"
          aria-label="Global Search"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
              aria-label="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
              Ctrl K
            </kbd>
          )}
          <button
            type="button"
            onClick={() => {
              inputRef.current?.focus();
              setIsOpen(true);
            }}
            className="p-1 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer"
            title="Cari Menu"
          >
            <Search className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden text-slate-800 animate-in fade-in duration-150 min-w-[270px]">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span>{query.trim() ? `Hasil Pencarian (${results.length})` : 'Akses Cepat Halaman'}</span>
            <span>55+ Halaman</span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-slate-600">
                Menu &quot;{query}&quot; tidak ditemukan.
              </div>
            ) : (
              results.map((item, idx) => {
                const active = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => selectRoute(item.id)}
                    className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                      active ? 'bg-blue-50/70 text-[#175cd3]' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{item.label}</p>
                      <p className="text-[11px] text-slate-500 truncate">{item.group}</p>
                    </div>
                    {active && <CornerDownLeft className="w-3.5 h-3.5 text-[#175cd3] shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center justify-between text-[10px] text-slate-500">
            <span>↑↓ Pilih • Enter Buka</span>
            <span>Esc Tutup</span>
          </div>
        </div>
      )}
    </div>
  );
};
