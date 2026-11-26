import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Clock,
  MapPin,
  Edit3,
  Trash2,
  X,
  GripVertical,
  Check,
  List,
  Grid3x3,
  CalendarDays,
  AlignLeft,
} from 'lucide-react';
import { showToast, showSuccess } from '../../lib/swal';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type EventCategory = 'work' | 'meeting' | 'design' | 'deadline' | 'personal';
type CalendarViewMode = 'month' | 'week' | 'list';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  allDay: boolean;
  category: EventCategory;
  location?: string;
  description?: string;
}

const CATEGORY_META: Record<
  EventCategory,
  { label: string; pill: string; dot: string; softBg: string; border: string }
> = {
  work: {
    label: 'Work & Sprint',
    pill: 'bg-[#175cd3] text-white',
    dot: 'bg-[#175cd3]',
    softBg: 'bg-blue-50 text-[#175cd3]',
    border: 'border-blue-200',
  },
  meeting: {
    label: 'Meeting',
    pill: 'bg-indigo-600 text-white',
    dot: 'bg-indigo-600',
    softBg: 'bg-indigo-50 text-indigo-700',
    border: 'border-indigo-200',
  },
  design: {
    label: 'UI/UX Design',
    pill: 'bg-emerald-600 text-white',
    dot: 'bg-emerald-600',
    softBg: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-200',
  },
  deadline: {
    label: 'Deadline',
    pill: 'bg-rose-600 text-white',
    dot: 'bg-rose-600',
    softBg: 'bg-rose-50 text-rose-700',
    border: 'border-rose-200',
  },
  personal: {
    label: 'Personal',
    pill: 'bg-amber-500 text-white',
    dot: 'bg-amber-500',
    softBg: 'bg-amber-50 text-amber-700',
    border: 'border-amber-200',
  },
};

const EXTERNAL_TEMPLATES: { title: string; category: EventCategory; durationMin: number }[] = [
  { title: 'Standup Meeting Tim', category: 'meeting', durationMin: 30 },
  { title: 'Design System Review', category: 'design', durationMin: 60 },
  { title: 'Deploy Production v2.5', category: 'work', durationMin: 90 },
  { title: 'Submit Laporan Bulanan', category: 'deadline', durationMin: 60 },
  { title: '1-on-1 Coaching', category: 'personal', durationMin: 45 },
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 08:00 - 18:00

const TODAY_STR = '2026-11-26';

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'All Day Event — Townhall Perusahaan',
    date: '2026-11-02',
    startTime: '09:00',
    endTime: '17:00',
    allDay: true,
    category: 'work',
    location: 'Main Auditorium Lt. 3',
    description: 'Pemaparan roadmap produk kuartal akhir 2026 dan evaluasi pencapaian tim.',
  },
  {
    id: 'ev-2',
    title: 'Design Audit: Velora UI Kit',
    date: '2026-11-10',
    startTime: '10:00',
    endTime: '12:00',
    allDay: false,
    category: 'design',
    location: 'Figma Huddle / Meet',
    description: 'Audit konsistensi komponen Forms, Validation, dan Upload Files.',
  },
  {
    id: 'ev-3',
    title: 'Sprint Planning Q4',
    date: '2026-11-16',
    startTime: '09:00',
    endTime: '11:00',
    allDay: false,
    category: 'meeting',
    location: 'Google Meet',
    description: 'Penentuan backlog dan prioritas modul untuk 2 minggu ke depan.',
  },
  {
    id: 'ev-4',
    title: 'Deadline Rilis Modul Modules & Calendar',
    date: '2026-11-26',
    startTime: '14:00',
    endTime: '16:00',
    allDay: false,
    category: 'deadline',
    location: 'Production Server',
    description: 'Final build check, oxlint zero warnings, dan push ke main branch.',
  },
  {
    id: 'ev-5',
    title: 'Weekly Engineering Sync',
    date: '2026-11-26',
    startTime: '10:00',
    endTime: '11:00',
    allDay: false,
    category: 'meeting',
    location: 'Ruang Meeting Alpha',
    description: 'Sinkronisasi progres frontend & integrasi API.',
  },
  {
    id: 'ev-6',
    title: 'Workshop Tailwind CSS v4',
    date: '2026-11-27',
    startTime: '13:00',
    endTime: '15:00',
    allDay: false,
    category: 'design',
    location: 'Creative Lab',
    description: 'Berbagi teknik optimasi utility CSS dan layout grid modern.',
  },
  {
    id: 'ev-7',
    title: 'Makan Malam Tim & Apresiasi',
    date: '2026-11-28',
    startTime: '19:00',
    endTime: '21:00',
    allDay: false,
    category: 'personal',
    location: 'Braga Sky Lounge',
    description: 'Kumpul santai merayakan selesainya milestone bulan November.',
  },
  {
    id: 'ev-8',
    title: 'Backup & Security Patch',
    date: '2026-11-30',
    startTime: '08:00',
    endTime: '10:00',
    allDay: false,
    category: 'work',
    location: 'AWS Console',
    description: 'Pemeliharaan rutin server dan rotasi kredensial.',
  },
];

// ============================================================================
// DATE HELPERS
// ============================================================================

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseDateStr(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function formatReadableDate(str: string): string {
  const d = parseDateStr(str);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function getMonthCells(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; dateStr: string; inMonth: boolean }[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const prevDate = new Date(year, month - 1, d);
    cells.push({ day: d, dateStr: toDateStr(prevDate), inMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    cells.push({ day: d, dateStr: toDateStr(curDate), inMonth: true });
  }

  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextDate = new Date(year, month + 1, d);
    cells.push({ day: d, dateStr: toDateStr(nextDate), inMonth: false });
  }

  return cells;
}

function getWeekDates(anchorDateStr: string): Date[] {
  const anchor = parseDateStr(anchorDateStr);
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - anchor.getDay()); // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// ============================================================================
// CALENDAR VIEW COMPONENT
// ============================================================================

export function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [cursorDate, setCursorDate] = useState<string>(TODAY_STR);
  const [searchQuery, setSearchQuery] = useState('');
  const [enabledCategories, setEnabledCategories] = useState<EventCategory[]>([
    'work',
    'meeting',
    'design',
    'deadline',
    'personal',
  ]);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // Modals
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<{
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    allDay: boolean;
    category: EventCategory;
    location: string;
    description: string;
  }>({
    title: '',
    date: TODAY_STR,
    startTime: '09:00',
    endTime: '10:00',
    allDay: false,
    category: 'work',
    location: '',
    description: '',
  });

  const activeDateObj = parseDateStr(cursorDate);
  const activeYear = activeDateObj.getFullYear();
  const activeMonth = activeDateObj.getMonth();

  const monthCells = useMemo(() => getMonthCells(activeYear, activeMonth), [activeYear, activeMonth]);
  const weekDates = useMemo(() => getWeekDates(cursorDate), [cursorDate]);

  // Filtered events
  const visibleEvents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return events.filter((ev) => {
      if (!enabledCategories.includes(ev.category)) return false;
      if (!q) return true;
      return (
        ev.title.toLowerCase().includes(q) ||
        (ev.location || '').toLowerCase().includes(q) ||
        (ev.description || '').toLowerCase().includes(q)
      );
    });
  }, [events, enabledCategories, searchQuery]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    visibleEvents.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    Object.values(map).forEach((list) =>
      list.sort((a, b) => (a.allDay === b.allDay ? a.startTime.localeCompare(b.startTime) : a.allDay ? -1 : 1))
    );
    return map;
  }, [visibleEvents]);

  // Navigation Handlers
  const handlePrev = () => {
    const d = parseDateStr(cursorDate);
    if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    setCursorDate(toDateStr(d));
  };

  const handleNext = () => {
    const d = parseDateStr(cursorDate);
    if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    setCursorDate(toDateStr(d));
  };

  const handleToday = () => {
    setCursorDate(TODAY_STR);
  };

  const periodHeading = useMemo(() => {
    if (viewMode === 'week') {
      const start = weekDates[0];
      const end = weekDates[6];
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} – ${end.getDate()} ${MONTH_NAMES[start.getMonth()]} ${start.getFullYear()}`;
      }
      return `${start.getDate()} ${SHORT_MONTHS[start.getMonth()]} – ${end.getDate()} ${SHORT_MONTHS[end.getMonth()]} ${end.getFullYear()}`;
    }
    return `${MONTH_NAMES[activeMonth]} ${activeYear}`;
  }, [viewMode, weekDates, activeMonth, activeYear]);

  // Category filter toggle
  const toggleCategory = (cat: EventCategory) => {
    setEnabledCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Modal Triggers
  const openCreateModal = (dateStr = cursorDate, startHour?: number) => {
    const startH = startHour !== undefined ? pad2(startHour) : '09';
    const endH = startHour !== undefined ? pad2(Math.min(23, startHour + 1)) : '10';
    setEditingId(null);
    setFormState({
      title: '',
      date: dateStr,
      startTime: `${startH}:00`,
      endTime: `${endH}:00`,
      allDay: false,
      category: 'work',
      location: '',
      description: '',
    });
    setFormOpen(true);
  };

  const openEditModal = (ev: CalendarEvent) => {
    setDetailEvent(null);
    setEditingId(ev.id);
    setFormState({
      title: ev.title,
      date: ev.date,
      startTime: ev.startTime,
      endTime: ev.endTime,
      allDay: ev.allDay,
      category: ev.category,
      location: ev.location || '',
      description: ev.description || '',
    });
    setFormOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      showToast('Judul event wajib diisi.', 'warning');
      return;
    }

    if (editingId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingId
            ? {
                ...ev,
                title: formState.title.trim(),
                date: formState.date,
                startTime: formState.startTime,
                endTime: formState.endTime,
                allDay: formState.allDay,
                category: formState.category,
                location: formState.location.trim(),
                description: formState.description.trim(),
              }
            : ev
        )
      );
      showSuccess('Event Diperbarui!', `"${formState.title}" telah disimpan.`);
    } else {
      const newEv: CalendarEvent = {
        id: `ev-${Date.now()}`,
        title: formState.title.trim(),
        date: formState.date,
        startTime: formState.startTime,
        endTime: formState.endTime,
        allDay: formState.allDay,
        category: formState.category,
        location: formState.location.trim(),
        description: formState.description.trim(),
      };
      setEvents((prev) => [...prev, newEv]);
      showSuccess('Event Ditambahkan!', `"${newEv.title}" dijadwalkan pada ${newEv.date}.`);
    }
    setFormOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    const target = events.find((e) => e.id === id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDetailEvent(null);
    setFormOpen(false);
    showToast(`Event "${target?.title || ''}" dihapus.`, 'info');
  };

  // Drag & Drop Handlers (Both External Templates and Existing Event Rescheduling)
  const handleDropOnDate = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    setDragOverDate(null);

    const existingId = e.dataTransfer.getData('application/x-velora-event-id');
    if (existingId) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === existingId ? { ...ev, date: targetDateStr } : ev))
      );
      showToast(`Event dipindahkan ke ${targetDateStr}.`, 'success');
      return;
    }

    const templateRaw = e.dataTransfer.getData('application/x-velora-template');
    if (templateRaw) {
      try {
        const tpl = JSON.parse(templateRaw) as {
          title: string;
          category: EventCategory;
          durationMin: number;
        };
        const endHour = tpl.durationMin >= 90 ? '10:30' : '10:00';
        const newEv: CalendarEvent = {
          id: `ev-${Date.now()}`,
          title: tpl.title,
          date: targetDateStr,
          startTime: '09:00',
          endTime: endHour,
          allDay: false,
          category: tpl.category,
          location: 'Jadwal Drag & Drop',
          description: 'Dijadwalkan langsung dari panel External Events.',
        };
        setEvents((prev) => [...prev, newEv]);
        showToast(`"${tpl.title}" ditambahkan pada ${targetDateStr}.`, 'success');
      } catch {
        // Ignore invalid payload
      }
    }
  };

  // Grouped Agenda events for List view (sorted chronologically within active month)
  const agendaGroups = useMemo(() => {
    const monthPrefix = `${activeYear}-${pad2(activeMonth + 1)}`;
    const filtered = visibleEvents
      .filter((ev) => ev.date.startsWith(monthPrefix))
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

    const groups: { date: string; items: CalendarEvent[] }[] = [];
    filtered.forEach((ev) => {
      const last = groups[groups.length - 1];
      if (last && last.date === ev.date) {
        last.items.push(ev);
      } else {
        groups.push({ date: ev.date, items: [ev] });
      }
    });
    return groups;
  }, [visibleEvents, activeYear, activeMonth]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* SUB-HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Calendar</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Perencana jadwal interaktif gaya FullCalendar dengan tampilan Month, Week, dan Agenda List, drag-and-drop event, filter kategori, serta manajemen acara lengkap.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN 12-COL WORKSPACE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT SIDEBAR: CREATE BUTTON + MINI CALENDAR + EXTERNAL EVENTS + FILTERS */}
        {/* ======================================================================= */}
        <div className="xl:col-span-3 space-y-6">
          {/* Card 1: Create + Mini Calendar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
            <button
              type="button"
              onClick={() => openCreateModal(cursorDate)}
              className="w-full py-2.5 px-4 bg-[#175cd3] hover:bg-[#1450be] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Event Baru</span>
            </button>

            {/* Mini Month Navigator */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">
                  {SHORT_MONTHS[activeMonth]} {activeYear}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-500 mb-1.5">
                {SHORT_WEEKDAYS.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
                {monthCells.map((cell, idx) => {
                  const isToday = cell.dateStr === TODAY_STR;
                  const isCursor = cell.dateStr === cursorDate;
                  const hasEvents = (eventsByDate[cell.dateStr]?.length || 0) > 0;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCursorDate(cell.dateStr)}
                      className={`relative py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                        isToday
                          ? 'bg-[#175cd3] text-white font-bold'
                          : isCursor
                          ? 'bg-blue-100 text-[#175cd3] font-bold'
                          : cell.inMonth
                          ? 'text-slate-700 hover:bg-slate-100'
                          : 'text-slate-300'
                      }`}
                    >
                      {cell.day}
                      {hasEvents && !isToday && (
                        <span className="w-1 h-1 rounded-full bg-[#175cd3] absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Draggable External Events */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <h3 className="text-sm font-bold text-[#175cd3] mb-1">Draggable Events</h3>
            <p className="text-[11px] text-slate-500 mb-3.5">
              Tarik ke tanggal di kalender atau klik <span className="font-semibold">+</span> untuk menjadwalkan cepat.
            </p>

            <div className="space-y-2">
              {EXTERNAL_TEMPLATES.map((tpl) => {
                const meta = CATEGORY_META[tpl.category];
                return (
                  <div
                    key={tpl.title}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/x-velora-template', JSON.stringify(tpl));
                    }}
                    className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-grab active:cursor-grabbing shadow-xs transition-transform hover:translate-x-0.5 ${meta.pill}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical className="w-3.5 h-3.5 opacity-75 shrink-0" />
                      <span className="truncate">{tpl.title}</span>
                    </div>
                    <button
                      type="button"
                      title={`Tambahkan ke ${cursorDate}`}
                      onClick={() => {
                        const newEv: CalendarEvent = {
                          id: `ev-${Date.now()}`,
                          title: tpl.title,
                          date: cursorDate,
                          startTime: '09:00',
                          endTime: tpl.durationMin >= 90 ? '10:30' : '10:00',
                          allDay: false,
                          category: tpl.category,
                          location: 'Quick Schedule',
                        };
                        setEvents((prev) => [...prev, newEv]);
                        showToast(`"${tpl.title}" dijadwalkan ke ${cursorDate}.`, 'success');
                      }}
                      className="p-0.5 rounded bg-white/20 hover:bg-white/30 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Category Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
            <h3 className="text-sm font-bold text-[#175cd3] mb-3">Filter Kategori</h3>
            <div className="space-y-2">
              {(Object.keys(CATEGORY_META) as EventCategory[]).map((cat) => {
                const meta = CATEGORY_META[cat];
                const enabled = enabledCategories.includes(cat);
                const count = events.filter((e) => e.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                          enabled
                            ? `${meta.dot} border-transparent text-white`
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {enabled && <Check className="w-3 h-3" />}
                      </span>
                      <span className={enabled ? 'font-medium text-slate-800' : 'text-slate-400'}>
                        {meta.label}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT MAIN CALENDAR PANEL (9 cols) */}
        {/* ======================================================================= */}
        <div className="xl:col-span-9 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* FullCalendar Toolbar */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* Left: Prev/Next + Today */}
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl border border-slate-200 bg-white overflow-hidden divide-x divide-slate-200">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
                  title="Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors"
                  title="Berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleToday}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Today
              </button>
            </div>

            {/* Center: Dynamic Period Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
              {periodHeading}
            </h3>

            {/* Right: Search + View Switcher */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari event..."
                  className="pl-8 pr-3 py-1.5 w-40 sm:w-48 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                {(
                  [
                    { id: 'month', label: 'Month', icon: Grid3x3 },
                    { id: 'week', label: 'Week', icon: CalendarDays },
                    { id: 'list', label: 'List', icon: List },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = viewMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setViewMode(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        active ? 'bg-[#175cd3] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* VIEW 1: MONTH VIEW */}
          {/* ===================================================================== */}
          {viewMode === 'month' && (
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Weekday Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70">
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="py-2.5 px-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-r last:border-r-0 border-slate-200/80"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 42 Day Grid */}
                <div className="grid grid-cols-7">
                  {monthCells.map((cell, idx) => {
                    const dayEvents = eventsByDate[cell.dateStr] || [];
                    const isToday = cell.dateStr === TODAY_STR;
                    const isDropTarget = dragOverDate === cell.dateStr;

                    return (
                      <div
                        key={idx}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (dragOverDate !== cell.dateStr) setDragOverDate(cell.dateStr);
                        }}
                        onDragLeave={() => {
                          if (dragOverDate === cell.dateStr) setDragOverDate(null);
                        }}
                        onDrop={(e) => handleDropOnDate(e, cell.dateStr)}
                        onClick={() => openCreateModal(cell.dateStr)}
                        className={`min-h-[112px] p-2 border-r border-b border-slate-200/80 transition-colors cursor-pointer flex flex-col gap-1 ${
                          idx % 7 === 6 ? 'border-r-0' : ''
                        } ${
                          isDropTarget
                            ? 'bg-blue-50/80 ring-2 ring-inset ring-[#175cd3]'
                            : cell.inMonth
                            ? 'bg-white hover:bg-slate-50/60'
                            : 'bg-slate-50/40 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                              isToday
                                ? 'bg-[#175cd3] text-white font-bold shadow-xs'
                                : cell.inMonth
                                ? 'text-slate-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {cell.day}
                          </span>
                          {dayEvents.length > 0 && (
                            <span className="text-[10px] font-medium text-slate-400">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>

                        {/* Event Pills */}
                        <div className="space-y-1 mt-0.5">
                          {dayEvents.slice(0, 3).map((ev) => {
                            const meta = CATEGORY_META[ev.category];
                            return (
                              <div
                                key={ev.id}
                                draggable
                                onDragStart={(e) => {
                                  e.stopPropagation();
                                  e.dataTransfer.setData('application/x-velora-event-id', ev.id);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDetailEvent(ev);
                                }}
                                className={`px-2 py-1 rounded-md text-[11px] font-semibold truncate cursor-pointer shadow-2xs hover:opacity-90 transition-opacity ${meta.pill}`}
                                title={`${ev.allDay ? 'All Day' : ev.startTime} — ${ev.title}`}
                              >
                                {!ev.allDay && (
                                  <span className="opacity-85 mr-1 font-normal">{ev.startTime}</span>
                                )}
                                {ev.title}
                              </div>
                            );
                          })}
                          {dayEvents.length > 3 && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setCursorDate(cell.dateStr);
                                setViewMode('list');
                              }}
                              className="text-[10px] font-bold text-[#175cd3] px-1 hover:underline"
                            >
                              +{dayEvents.length - 3} lainnya
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW 2: WEEK VIEW (Hourly Timeline Grid) */}
          {/* ===================================================================== */}
          {viewMode === 'week' && (
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                {/* Day Headers */}
                <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/70">
                  <div className="py-3 px-2 text-center text-[11px] font-semibold text-slate-500 border-r border-slate-200">
                    Waktu
                  </div>
                  {weekDates.map((d, idx) => {
                    const dStr = toDateStr(d);
                    const isToday = dStr === TODAY_STR;
                    return (
                      <div
                        key={idx}
                        className={`py-2.5 px-2 text-center border-r last:border-r-0 border-slate-200 ${
                          isToday ? 'bg-blue-50/60' : ''
                        }`}
                      >
                        <div className="text-[11px] font-semibold text-slate-500 uppercase">
                          {WEEKDAYS[d.getDay()]}
                        </div>
                        <div
                          className={`mt-0.5 inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold ${
                            isToday ? 'bg-[#175cd3] text-white' : 'text-slate-800'
                          }`}
                        >
                          {d.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* All-Day Row */}
                <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50/30">
                  <div className="py-2 px-2 text-[11px] font-medium text-slate-500 text-center border-r border-slate-200">
                    All-day
                  </div>
                  {weekDates.map((d, idx) => {
                    const dStr = toDateStr(d);
                    const allDayEvs = (eventsByDate[dStr] || []).filter((e) => e.allDay);
                    return (
                      <div
                        key={idx}
                        className="p-1.5 border-r last:border-r-0 border-slate-200 space-y-1 min-h-[38px]"
                      >
                        {allDayEvs.map((ev) => (
                          <div
                            key={ev.id}
                            onClick={() => setDetailEvent(ev)}
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold truncate cursor-pointer ${CATEGORY_META[ev.category].pill}`}
                          >
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Hourly Rows 08:00 - 18:00 */}
                <div className="max-h-[480px] overflow-y-auto">
                  {HOURS.map((hour) => {
                    const hourLabel = `${pad2(hour)}:00`;
                    return (
                      <div
                        key={hour}
                        className="grid grid-cols-8 border-b last:border-b-0 border-slate-100"
                      >
                        <div className="py-3 px-2 text-[11px] font-medium text-slate-400 text-center border-r border-slate-200">
                          {hourLabel}
                        </div>
                        {weekDates.map((d, idx) => {
                          const dStr = toDateStr(d);
                          const slotEvents = (eventsByDate[dStr] || []).filter((ev) => {
                            if (ev.allDay) return false;
                            const startH = parseInt(ev.startTime.split(':')[0], 10);
                            return startH === hour;
                          });

                          return (
                            <div
                              key={idx}
                              onClick={() => openCreateModal(dStr, hour)}
                              className="min-h-[54px] p-1 border-r last:border-r-0 border-slate-100 hover:bg-slate-50 cursor-pointer space-y-1"
                            >
                              {slotEvents.map((ev) => (
                                <div
                                  key={ev.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDetailEvent(ev);
                                  }}
                                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer shadow-2xs ${CATEGORY_META[ev.category].pill}`}
                                >
                                  <div className="text-[10px] opacity-85">
                                    {ev.startTime}–{ev.endTime}
                                  </div>
                                  <div className="truncate">{ev.title}</div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW 3: LIST (AGENDA) VIEW */}
          {/* ===================================================================== */}
          {viewMode === 'list' && (
            <div className="p-5 space-y-4">
              {agendaGroups.length === 0 ? (
                <div className="py-12 text-center border border-slate-100 rounded-2xl">
                  <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">
                    Tidak ada jadwal pada {MONTH_NAMES[activeMonth]} {activeYear}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Klik &ldquo;Buat Event Baru&rdquo; atau ubah filter kategori untuk melihat jadwal lain.
                  </p>
                </div>
              ) : (
                agendaGroups.map((group) => (
                  <div
                    key={group.date}
                    className="rounded-2xl border border-slate-200/90 overflow-hidden"
                  >
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {formatReadableDate(group.date)}
                      </span>
                      {group.date === TODAY_STR && (
                        <span className="px-2 py-0.5 rounded-full bg-[#175cd3] text-white text-[10px] font-bold">
                          Hari Ini
                        </span>
                      )}
                    </div>

                    <div className="divide-y divide-slate-100 bg-white">
                      {group.items.map((ev) => {
                        const meta = CATEGORY_META[ev.category];
                        return (
                          <div
                            key={ev.id}
                            onClick={() => setDetailEvent(ev)}
                            className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/70 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.dot}`} />
                              <span className="text-xs font-semibold text-slate-500 w-24 shrink-0">
                                {ev.allDay ? 'All Day' : `${ev.startTime} – ${ev.endTime}`}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{ev.title}</p>
                                {ev.location && (
                                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3" />
                                    {ev.location}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${meta.softBg}`}
                              >
                                {meta.label}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(ev);
                                }}
                                className="p-1.5 text-slate-400 hover:text-[#175cd3] hover:bg-blue-50 rounded-lg cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(ev.id);
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: EVENT DETAIL */}
      {/* ========================================================================= */}
      {detailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    CATEGORY_META[detailEvent.category].softBg
                  }`}
                >
                  {CATEGORY_META[detailEvent.category].label}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-2">{detailEvent.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setDetailEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 border-t border-b border-slate-100 py-3.5">
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-4 h-4 text-[#175cd3] shrink-0" />
                <span className="font-medium text-slate-800">
                  {formatReadableDate(detailEvent.date)}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#175cd3] shrink-0" />
                <span>
                  {detailEvent.allDay
                    ? 'Seharian penuh (All Day)'
                    : `${detailEvent.startTime} – ${detailEvent.endTime} WIB`}
                </span>
              </div>
              {detailEvent.location && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#175cd3] shrink-0" />
                  <span>{detailEvent.location}</span>
                </div>
              )}
              {detailEvent.description && (
                <div className="flex items-start gap-2.5 pt-1">
                  <AlignLeft className="w-4 h-4 text-[#175cd3] shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-slate-600">{detailEvent.description}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleDeleteEvent(detailEvent.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDetailEvent(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(detailEvent)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#175cd3] hover:bg-[#1450be] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT EVENT FORM */}
      {/* ========================================================================= */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveEvent}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Jadwal Event' : 'Buat Event Baru'}
              </h4>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Event <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  value={formState.title}
                  onChange={(e) => setFormState((p) => ({ ...p, title: e.target.value }))}
                  placeholder="cth: Review Sprint Mingguan"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formState.date}
                    onChange={(e) => setFormState((p) => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState((p) => ({ ...p, category: e.target.value as EventCategory }))
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3] cursor-pointer"
                  >
                    {(Object.keys(CATEGORY_META) as EventCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_META[cat].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label
                  onClick={() => setFormState((p) => ({ ...p, allDay: !p.allDay }))}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={formState.allDay}
                    onChange={(e) => setFormState((p) => ({ ...p, allDay: e.target.checked }))}
                    className="rounded border-slate-300 text-[#175cd3]"
                  />
                  <span>Acara Seharian Penuh (All Day)</span>
                </label>
              </div>

              {!formState.allDay && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      value={formState.startTime}
                      onChange={(e) => setFormState((p) => ({ ...p, startTime: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      value={formState.endTime}
                      onChange={(e) => setFormState((p) => ({ ...p, endTime: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi / Tautan Meeting
                </label>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState((p) => ({ ...p, location: e.target.value }))}
                  placeholder="cth: Google Meet / Ruang Rapat Lt. 2"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan / Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={formState.description}
                  onChange={(e) => setFormState((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Detail singkat agenda..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {editingId ? (
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(editingId)}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Hapus Event
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#175cd3] hover:bg-[#1450be] text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan Event'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
