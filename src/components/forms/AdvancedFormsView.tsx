import React, { useState, useEffect } from 'react';
import {
  Phone,
  Lock,
  Calendar,
  Clock,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Pipette,
  Smartphone,
  Tablet,
  Monitor,
  Laptop,
  Sun,
  Moon,
  CloudRain,
  Cloud,
  Image as ImageIcon,
  Search,
} from 'lucide-react';
import { showToast } from '../../lib/swal';

type ActivePopover =
  | null
  | 'select2'
  | 'select2-multi'
  | 'range-preset'
  | 'date-picker'
  | 'datetime-picker'
  | 'date-range'
  | 'time-picker';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarDay {
  day: number;
  dateStr: string;
  isCurrentMonth: boolean;
}

function getCalendarGrid(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevDays: CalendarDay[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    prevDays.push({
      day: d,
      dateStr: `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isCurrentMonth: false,
    });
  }

  const currDays: CalendarDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    currDays.push({
      day: d,
      dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isCurrentMonth: true,
    });
  }

  const nextDaysCount = 42 - (prevDays.length + currDays.length);
  const nextDays: CalendarDay[] = [];
  for (let d = 1; d <= (nextDaysCount > 7 ? nextDaysCount - 7 : nextDaysCount); d++) {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    nextDays.push({
      day: d,
      dateStr: `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      isCurrentMonth: false,
    });
  }

  return [...prevDays, ...currDays, ...nextDays];
}

export function AdvancedFormsView() {
  // =========================================================================
  // UNIFIED POPOVER MANAGER (Only 1 popover open at any time + true outside click)
  // =========================================================================
  const [activePopover, setActivePopover] = useState<ActivePopover>(null);

  const togglePopover = (name: ActivePopover) => {
    setActivePopover((curr) => (curr === name ? null : name));
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!activePopover) return;
      const target = e.target as HTMLElement;
      // If click was outside the active popover container, close it
      if (!target.closest(`[data-popover-id="${activePopover}"]`)) {
        setActivePopover(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePopover]);

  // =========================================================================
  // LEFT COLUMN STATES
  // =========================================================================

  // Input Text Card
  const [defaultText, setDefaultText] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('');
  const [purchaseCode, setPurchaseCode] = useState('ASDF-GHIJ-KLMN-OPQR');
  const [invoice, setInvoice] = useState('');
  const [dateMask, setDateMask] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [tags, setTags] = useState<string[]>(['First', 'Second']);
  const [tagInput, setTagInput] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  const pwStrength = getPasswordStrength(password);

  // Left Toggle Switches Card
  const [leftToggles, setLeftToggles] = useState({
    opt1: false,
    opt2: true, // checked by default in screenshot 3
    opt3: false,
  });
  const [leftSingleToggle, setLeftSingleToggle] = useState(false);

  // Image Check Card (6 pastel cards)
  const [selectedImages, setSelectedImages] = useState<number[]>([2, 4]);

  const imageCardData = [
    { id: 1, name: 'Blue Pastel', bg: 'bg-[#eff4fe]', iconColor: 'text-[#818cf8]' },
    { id: 2, name: 'Green Pastel', bg: 'bg-[#ecfdf5]', iconColor: 'text-[#34d399]' },
    { id: 3, name: 'Cyan Pastel', bg: 'bg-[#ecfeff]', iconColor: 'text-[#22d3ee]' },
    { id: 4, name: 'Orange Pastel', bg: 'bg-[#fff7ed]', iconColor: 'text-[#fb923c]' },
    { id: 5, name: 'Pink Pastel', bg: 'bg-[#fff1f2]', iconColor: 'text-[#f43f5e]' },
    { id: 6, name: 'Purple Pastel', bg: 'bg-[#faf5ff]', iconColor: 'text-[#c084fc]' },
  ];

  const toggleImageCheck = (id: number) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Color Card
  const [simpleColor, setSimpleColor] = useState('');
  const [pickerColor, setPickerColor] = useState('#175cd3');
  const [selectedPalette, setSelectedPalette] = useState('#175cd3');

  const colorPalette = [
    '#175cd3',
    '#94a3b8',
    '#f97316',
    '#ef4444',
    '#0ea5e9',
    '#10b981',
  ];

  // =========================================================================
  // RIGHT COLUMN STATES
  // =========================================================================

  // Select Card
  const [defaultSelect, setDefaultSelect] = useState('Option 1');

  // Select2 Single
  const [select2Search, setSelect2Search] = useState('');
  const [select2Value, setSelect2Value] = useState('Option 1');
  const select2Options = ['Option 1', 'Option 2', 'Option 3'];

  // Select2 Multiple
  const [select2MultiValues, setSelect2MultiValues] = useState<string[]>(['Option 1', 'Option 4']);
  const select2MultiOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];

  // jQuery Selectric
  const [selectricVal, setSelectricVal] = useState('Option 2');
  const [selectricMultiVal, setSelectricMultiVal] = useState('Option 1');

  // Select Group Button
  const [sizeGroup, setSizeGroup] = useState('S');
  const [iconInputGroup, setIconInputGroup] = useState('tablet');
  const [radioIconGroup, setRadioIconGroup] = useState('sun');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['HTML']);

  const skillsList = ['HTML', 'CSS', 'PHP', 'JavaScript', 'Ruby', 'C++'];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Right Toggle Switches Card
  const [rightToggles, setRightToggles] = useState({
    opt1: false,
    opt2: false,
    opt3: false,
  });
  const [rightSingleToggle, setRightSingleToggle] = useState(false);

  // =========================================================================
  // DATE & TIME PICKER SUITE (REAL INTERACTIVE LOGIC & EDITABLE INPUTS)
  // =========================================================================

  // 1. Date Range Picker With Button (Preset popover)
  const [selectedRangePreset, setSelectedRangePreset] = useState('Last 30 Days');
  const rangePresets = [
    { label: 'Today', range: '2026-11-25 - 2026-11-25' },
    { label: 'Yesterday', range: '2026-11-24 - 2026-11-24' },
    { label: 'Last 7 Days', range: '2026-11-19 - 2026-11-25' },
    { label: 'Last 30 Days', range: '2026-10-27 - 2026-11-25' },
    { label: 'This Month', range: '2026-11-01 - 2026-11-30' },
    { label: 'Last Month', range: '2026-10-01 - 2026-10-31' },
    { label: 'Custom Range', range: 'custom' },
  ];

  // 2. Date Picker (Interactive Calendar + Direct Input)
  const [datePickerVal, setDatePickerVal] = useState('2026-11-29');
  const [pickerYear, setPickerYear] = useState(2026);
  const [pickerMonth, setPickerMonth] = useState(10); // 10 = Nov (0-indexed)
  const [tempDateStr, setTempDateStr] = useState('2026-11-29');

  const handlePrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerYear((y) => y - 1);
      setPickerMonth(11);
    } else {
      setPickerMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerYear((y) => y + 1);
      setPickerMonth(0);
    } else {
      setPickerMonth((m) => m + 1);
    }
  };

  // 3. Date Time Picker (Interactive Calendar + Hour/Min selects + Direct Input)
  const [dateTimePickerVal, setDateTimePickerVal] = useState('2026-11-25 15:17');
  const [dtYear, setDtYear] = useState(2026);
  const [dtMonth, setDtMonth] = useState(10);
  const [dtSelectedDate, setDtSelectedDate] = useState('2026-11-25');
  const [dtHour, setDtHour] = useState('15');
  const [dtMinute, setDtMinute] = useState('17');

  const handleDtPrevMonth = () => {
    if (dtMonth === 0) {
      setDtYear((y) => y - 1);
      setDtMonth(11);
    } else {
      setDtMonth((m) => m - 1);
    }
  };

  const handleDtNextMonth = () => {
    if (dtMonth === 11) {
      setDtYear((y) => y + 1);
      setDtMonth(0);
    } else {
      setDtMonth((m) => m + 1);
    }
  };

  // 4. Date Range Picker (Real Dual-Month Range Picking + Direct Input)
  const [dateRangeVal, setDateRangeVal] = useState('2026-11-16 - 2026-12-31');
  const [rangeYear, setRangeYear] = useState(2026);
  const [rangeMonth, setRangeMonth] = useState(10); // 10 = Nov
  const [rangeStart, setRangeStart] = useState<string | null>('2026-11-16');
  const [rangeEnd, setRangeEnd] = useState<string | null>('2026-12-31');
  const [rangeHover, setRangeHover] = useState<string | null>(null);

  const handleRangePrev = () => {
    if (rangeMonth === 0) {
      setRangeYear((y) => y - 1);
      setRangeMonth(11);
    } else {
      setRangeMonth((m) => m - 1);
    }
  };

  const handleRangeNext = () => {
    if (rangeMonth === 11) {
      setRangeYear((y) => y + 1);
      setRangeMonth(0);
    } else {
      setRangeMonth((m) => m + 1);
    }
  };

  const handleDateRangeClick = (dateStr: string) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      // Start new selection
      setRangeStart(dateStr);
      setRangeEnd(null);
    } else if (rangeStart && !rangeEnd) {
      // Pick end date
      if (dateStr < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(dateStr);
      } else {
        setRangeEnd(dateStr);
      }
    }
  };

  // Right calendar in dual-month view
  const nextMonthIdx = rangeMonth === 11 ? 0 : rangeMonth + 1;
  const nextMonthYear = rangeMonth === 11 ? rangeYear + 1 : rangeYear;

  // 5. Time Picker (Real spinner + Direct Input)
  const [timePickerVal, setTimePickerVal] = useState('1:15 PM');
  const [timeHour, setTimeHour] = useState(1);
  const [timeMinute, setTimeMinute] = useState(15);
  const [timeAmPm, setTimeAmPm] = useState<'AM' | 'PM'>('PM');
  const [timeHourInput, setTimeHourInput] = useState('1');
  const [timeMinuteInput, setTimeMinuteInput] = useState('15');

  const updateTimeVal = (h: number, m: number, ap: 'AM' | 'PM') => {
    setTimeHour(h);
    setTimeMinute(m);
    setTimeAmPm(ap);
    setTimeHourInput(String(h));
    setTimeMinuteInput(String(m).padStart(2, '0'));
    setTimePickerVal(`${h}:${String(m).padStart(2, '0')} ${ap}`);
  };

  const handleMainTimeInputChange = (val: string) => {
    setTimePickerVal(val);
    const match = val.trim().match(/^(\d{1,2}):(\d{1,2})(?:\s*([AP]M))?$/i);
    if (match) {
      const h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ap = match[3] ? (match[3].toUpperCase() as 'AM' | 'PM') : timeAmPm;
      if (h >= 1 && h <= 12 && m >= 0 && m <= 59) {
        setTimeHour(h);
        setTimeMinute(m);
        setTimeAmPm(ap);
        setTimeHourInput(String(h));
        setTimeMinuteInput(String(m).padStart(2, '0'));
      }
    }
  };

  // Tag helper
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* SUB-HEADER BANNER (Matching Stisla Screenshot 0) */}
      {/* ========================================================================= */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-2.5 bg-gradient-to-r from-[#175cd3] to-[#0f3ba0] rounded-full mt-2 shrink-0" />
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Advanced Forms</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            We provide advanced input fields, such as date picker, color picker, and so on.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN GRID CONTAINER */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN */}
        {/* ======================================================================= */}
        <div className="space-y-6">
          {/* --------------------------------------------------------------------- */}
          {/* CARD 1: INPUT TEXT */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-base font-bold text-[#175cd3] mb-6 tracking-tight">Input Text</h3>

            <div className="space-y-5">
              {/* Default Input Text */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Input Text
                </label>
                <input
                  type="text"
                  value={defaultText}
                  onChange={(e) => setDefaultText(e.target.value)}
                  placeholder=""
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all"
                />
              </div>

              {/* Phone Number (US Format) */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number (US Format)
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#175cd3] focus-within:ring-2 focus-within:ring-[#175cd3]/10 transition-all">
                  <div className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(999) 999-9999"
                    className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Strength */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password Strength
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#175cd3] focus-within:ring-2 focus-within:ring-[#175cd3]/10 transition-all">
                  <div className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                {/* Strength Meter Bar */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((step) => {
                        let barColor = 'bg-slate-200';
                        if (pwStrength >= step) {
                          if (pwStrength <= 1) barColor = 'bg-rose-500';
                          else if (pwStrength <= 2) barColor = 'bg-amber-500';
                          else if (pwStrength === 3) barColor = 'bg-blue-500';
                          else barColor = 'bg-emerald-500';
                        }
                        return <div key={step} className={`flex-1 rounded-full ${barColor} transition-all duration-300`} />;
                      })}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      {pwStrength <= 1 && <span className="text-rose-500 font-semibold">Weak</span>}
                      {pwStrength === 2 && <span className="text-amber-500 font-semibold">Fair</span>}
                      {pwStrength === 3 && <span className="text-blue-500 font-semibold">Good</span>}
                      {pwStrength >= 4 && <span className="text-emerald-500 font-semibold">Strong</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Currency */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Currency
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#175cd3] focus-within:ring-2 focus-within:ring-[#175cd3]/10 transition-all">
                  <div className="px-4 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500 font-semibold text-sm flex items-center justify-center shrink-0">
                    $
                  </div>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder=""
                    className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Purchase Code */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Purchase Code
                </label>
                <input
                  type="text"
                  value={purchaseCode}
                  onChange={(e) => setPurchaseCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all uppercase tracking-wider"
                />
              </div>

              {/* Invoice */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Invoice
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#175cd3] focus-within:ring-2 focus-within:ring-[#175cd3]/10 transition-all">
                  <div className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-600 font-semibold text-xs tracking-wider flex items-center justify-center shrink-0">
                    INV
                  </div>
                  <input
                    type="text"
                    value={invoice}
                    onChange={(e) => setInvoice(e.target.value)}
                    placeholder=""
                    className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date
                </label>
                <input
                  type="text"
                  value={dateMask}
                  onChange={(e) => setDateMask(e.target.value)}
                  placeholder="YYYY/MM/DD"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all"
                />
              </div>

              {/* Credit Card */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Credit Card
                </label>
                <input
                  type="text"
                  value={creditCard}
                  onChange={(e) => setCreditCard(e.target.value)}
                  placeholder=""
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all tracking-wider"
                />
              </div>

              {/* Tags */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tags
                </label>
                <div className="w-full min-h-[44px] p-2 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center gap-1.5 focus-within:border-[#175cd3] focus-within:ring-2 focus-within:ring-[#175cd3]/10 transition-all">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder={tags.length === 0 ? 'Type tag and press enter...' : ''}
                    className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 2: TOGGLE SWITCHES */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-base font-bold text-[#175cd3] mb-5 tracking-tight">Toggle Switches</h3>

            <div className="space-y-6">
              {/* Toggle switches list */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">
                  Toggle switches
                </label>
                <div className="space-y-3">
                  {[
                    { key: 'opt1', label: 'Option 1' },
                    { key: 'opt2', label: 'Option 2' },
                    { key: 'opt3', label: 'Option 3' },
                  ].map((item) => {
                    const isChecked = leftToggles[item.key as keyof typeof leftToggles];
                    return (
                      <label key={item.key} className="flex items-center gap-3 cursor-pointer select-none">
                        <div
                          onClick={() =>
                            setLeftToggles((prev) => ({
                              ...prev,
                              [item.key]: !prev[item.key as keyof typeof leftToggles],
                            }))
                          }
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                            isChecked ? 'bg-[#175cd3]' : 'bg-slate-200'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                              isChecked ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-slate-700 font-medium">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Toggle switch single */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">
                  Toggle switch single
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setLeftSingleToggle(!leftSingleToggle)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      leftSingleToggle ? 'bg-[#175cd3]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        leftSingleToggle ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-slate-600 font-normal">I agree with terms and conditions</span>
                </label>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 3: IMAGE CHECK */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-base font-bold text-[#175cd3] mb-5 tracking-tight">Image Check</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-3">
                Image Check
              </label>

              {/* 3 x 2 Grid of Pastel Cards */}
              <div className="grid grid-cols-3 gap-4">
                {imageCardData.map((card) => {
                  const isChecked = selectedImages.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => toggleImageCheck(card.id)}
                      className={`relative aspect-[4/3] rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center p-3 select-none ${card.bg} ${
                        isChecked ? 'border-[#175cd3] shadow-sm ring-2 ring-[#175cd3]/10' : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      {/* Checkbox badge in top-left corner */}
                      <div className="absolute top-2.5 left-2.5">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-[#175cd3] text-white' : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Center Placeholder Graphic */}
                      <div className="flex flex-col items-center justify-center">
                        <div className={`p-2.5 rounded-xl bg-white/70 backdrop-blur-xs ${card.iconColor} shadow-xs mb-1`}>
                          <ImageIcon className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                          Placeholder
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 4: COLOR */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-base font-bold text-[#175cd3] mb-5 tracking-tight">Color</h3>

            <div className="space-y-5">
              {/* Simple */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Simple
                </label>
                <input
                  type="text"
                  value={simpleColor}
                  onChange={(e) => setSimpleColor(e.target.value)}
                  placeholder=""
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all"
                />
              </div>

              {/* Pick Your Color */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pick Your Color
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-[#175cd3] focus-within:ring-2 focus-within:ring-[#175cd3]/10 transition-all relative">
                  <input
                    type="text"
                    value={pickerColor}
                    onChange={(e) => setPickerColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 focus:outline-none"
                  />
                  <label className="px-3.5 py-2.5 bg-slate-50 border-l border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shrink-0 cursor-pointer">
                    <Pipette className="w-4 h-4" />
                    <input
                      type="color"
                      value={pickerColor}
                      onChange={(e) => setPickerColor(e.target.value)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Color Input (Palette swatches) */}
              <div className="form-group">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Color Input
                </label>
                <div className="flex items-center gap-2.5">
                  {colorPalette.map((color) => {
                    const isSelected = selectedPalette === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setSelectedPalette(color);
                          setPickerColor(color);
                        }}
                        style={{ backgroundColor: color }}
                        className={`w-7 h-7 rounded-md cursor-pointer transition-transform hover:scale-105 relative ${
                          isSelected ? 'ring-2 ring-offset-2 ring-[#175cd3]' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN */}
        {/* ======================================================================= */}
        <div className="space-y-6">
          {/* --------------------------------------------------------------------- */}
          {/* CARD 5: SELECT */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-base font-bold text-[#175cd3] mb-5 tracking-tight">Select</h3>

            <div className="space-y-7">
              {/* Sub-section: Default */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-1.5 bg-[#175cd3] rounded-full" />
                  <h4 className="text-sm font-bold text-slate-800">Default</h4>
                </div>
                <div className="form-group">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Default Select
                  </label>
                  <div className="relative">
                    <select
                      value={defaultSelect}
                      onChange={(e) => setDefaultSelect(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all pr-10 cursor-pointer"
                    >
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Sub-section: Select 2 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-1.5 bg-[#175cd3] rounded-full" />
                  <h4 className="text-sm font-bold text-slate-800">Select 2</h4>
                </div>

                <div className="space-y-4">
                  {/* Select2 Single with Search (Matching Screenshot 1) */}
                  <div className="form-group relative" data-popover-id="select2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Select2
                    </label>
                    <div
                      onClick={() => togglePopover('select2')}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 flex items-center justify-between cursor-pointer transition-all ${
                        activePopover === 'select2'
                          ? 'border-[#175cd3] ring-2 ring-[#175cd3]/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{select2Value}</span>
                      {activePopover === 'select2' ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {/* Popover Dropdown */}
                    {activePopover === 'select2' && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in duration-150">
                        {/* Search Input */}
                        <div className="p-2 border-b border-slate-100">
                          <div className="relative">
                            <input
                              type="text"
                              value={select2Search}
                              onChange={(e) => setSelect2Search(e.target.value)}
                              placeholder="Search..."
                              autoFocus
                              className="w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#175cd3]"
                            />
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                        {/* Option List */}
                        <div className="max-h-48 overflow-y-auto py-1">
                          {select2Options
                            .filter((opt) => opt.toLowerCase().includes(select2Search.toLowerCase()))
                            .map((opt) => {
                              const isSelected = opt === select2Value;
                              return (
                                <div
                                  key={opt}
                                  onClick={() => {
                                    setSelect2Value(opt);
                                    setActivePopover(null);
                                  }}
                                  className={`px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors ${
                                    isSelected
                                      ? 'bg-[#175cd3] text-white font-semibold'
                                      : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  {opt}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Select2 Multiple with Tag Chips (Matching Screenshot 2) */}
                  <div className="form-group relative" data-popover-id="select2-multi">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Select2 Multiple
                    </label>
                    <div
                      onClick={() => togglePopover('select2-multi')}
                      className={`w-full min-h-[44px] px-3 py-2 bg-white border rounded-xl text-sm flex flex-wrap items-center gap-1.5 cursor-pointer transition-all ${
                        activePopover === 'select2-multi'
                          ? 'border-[#175cd3] ring-2 ring-[#175cd3]/10'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {select2MultiValues.length === 0 && (
                        <span className="text-slate-400 text-xs">Select options...</span>
                      )}
                      {select2MultiValues.map((val) => (
                        <span
                          key={val}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#175cd3] text-white text-xs font-medium rounded-md shadow-xs"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelect2MultiValues(select2MultiValues.filter((v) => v !== val));
                            }}
                            className="hover:text-red-200 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {val}
                        </span>
                      ))}
                    </div>

                    {/* Popover Dropdown */}
                    {activePopover === 'select2-multi' && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1 animate-in fade-in duration-150">
                        {select2MultiOptions.map((opt) => {
                          const isSelected = select2MultiValues.includes(opt);
                          return (
                            <div
                              key={opt}
                              onClick={() => {
                                if (isSelected) {
                                  setSelect2MultiValues(select2MultiValues.filter((v) => v !== opt));
                                } else {
                                  setSelect2MultiValues([...select2MultiValues, opt]);
                                }
                              }}
                              className={`px-3.5 py-2 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between ${
                                isSelected
                                  ? 'bg-[#175cd3] text-white font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sub-section: jQuery Selectric */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-1.5 bg-[#175cd3] rounded-full" />
                  <h4 className="text-sm font-bold text-slate-800">jQuery Selectric</h4>
                </div>

                <div className="space-y-4">
                  {/* jQuery Selectric Single */}
                  <div className="form-group">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      jQuery Selectric
                    </label>
                    <div className="relative">
                      <select
                        value={selectricVal}
                        onChange={(e) => setSelectricVal(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all pr-10 cursor-pointer"
                      >
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* jQuery Selectric Multiple */}
                  <div className="form-group">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      jQuery Selectric Multiple
                    </label>
                    <div className="relative">
                      <select
                        value={selectricMultiVal}
                        onChange={(e) => setSelectricMultiVal(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10 transition-all pr-10 cursor-pointer"
                      >
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-section: Select Group Button */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-1.5 bg-[#175cd3] rounded-full" />
                  <h4 className="text-sm font-bold text-slate-800">Select Group Button</h4>
                </div>

                <div className="space-y-4">
                  {/* Size: S, M, L, XL */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Size
                    </label>
                    <div className="grid grid-cols-4 rounded-xl border border-slate-200 overflow-hidden divide-x divide-slate-200">
                      {['S', 'M', 'L', 'XL'].map((size) => {
                        const isActive = sizeGroup === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSizeGroup(size)}
                            className={`py-2 text-xs font-semibold transition-colors cursor-pointer text-center ${
                              isActive
                                ? 'bg-[#175cd3] text-white shadow-xs'
                                : 'bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Icons input: Smartphone, Tablet, Monitor, Laptop */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Icons input
                    </label>
                    <div className="grid grid-cols-4 rounded-xl border border-slate-200 overflow-hidden divide-x divide-slate-200">
                      {[
                        { key: 'phone', icon: Smartphone },
                        { key: 'tablet', icon: Tablet },
                        { key: 'monitor', icon: Monitor },
                        { key: 'laptop', icon: Laptop },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = iconInputGroup === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setIconInputGroup(item.key)}
                            className={`py-2.5 flex items-center justify-center transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-[#175cd3] text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Icon input (Circular radio buttons): Sun, Moon, Cloud-Rain, Cloud */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Icon input
                    </label>
                    <div className="flex items-center gap-3">
                      {[
                        { key: 'sun', icon: Sun },
                        { key: 'moon', icon: Moon },
                        { key: 'rain', icon: CloudRain },
                        { key: 'cloud', icon: Cloud },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = radioIconGroup === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setRadioIconGroup(item.key)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#175cd3] text-white shadow-sm ring-2 ring-[#175cd3]/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Your skills: HTML, CSS, PHP, JavaScript, Ruby, C++ */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Your skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill) => {
                        const isActive = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#175cd3] text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 6: TOGGLE SWITCHES (Right Side Variant) */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-base font-bold text-[#175cd3] mb-5 tracking-tight">Toggle Switches</h3>

            <div className="space-y-6">
              {/* Toggle switches list */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">
                  Toggle switches
                </label>
                <div className="space-y-3">
                  {[
                    { key: 'opt1', label: 'Option 1' },
                    { key: 'opt2', label: 'Option 2' },
                    { key: 'opt3', label: 'Option 3' },
                  ].map((item) => {
                    const isChecked = rightToggles[item.key as keyof typeof rightToggles];
                    return (
                      <label key={item.key} className="flex items-center gap-3 cursor-pointer select-none">
                        <div
                          onClick={() =>
                            setRightToggles((prev) => ({
                              ...prev,
                              [item.key]: !prev[item.key as keyof typeof rightToggles],
                            }))
                          }
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                            isChecked ? 'bg-[#175cd3]' : 'bg-slate-200'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                              isChecked ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-slate-700 font-medium">{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Toggle switch single */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">
                  Toggle switch single
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div
                    onClick={() => setRightSingleToggle(!rightSingleToggle)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      rightSingleToggle ? 'bg-[#175cd3]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        rightSingleToggle ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-slate-600 font-normal">I agree with terms and conditions</span>
                </label>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 7: DATE & TIME PICKER (Real Interactive Selection + Direct Typing) */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
            <h3 className="text-base font-bold text-[#175cd3] mb-5 tracking-tight">Date & Time Picker</h3>

            <div className="space-y-5">
              {/* 1. Date Range Picker With Button (Matching Screenshot 4) */}
              <div className="form-group relative" data-popover-id="range-preset">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Date Range Picker With Button
                </label>
                <button
                  type="button"
                  onClick={() => togglePopover('range-preset')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#175cd3] hover:bg-[#1450be] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Choose Date</span>
                  {selectedRangePreset && (
                    <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[11px] font-normal">
                      {selectedRangePreset}
                    </span>
                  )}
                </button>

                {/* Preset Popover Menu */}
                {activePopover === 'range-preset' && (
                  <div className="absolute z-30 left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in duration-150">
                    {rangePresets.map((preset) => {
                      const isSelected = preset.label === selectedRangePreset;
                      return (
                        <div
                          key={preset.label}
                          onClick={() => {
                            setSelectedRangePreset(preset.label);
                            if (preset.range === 'custom') {
                              togglePopover('date-range');
                            } else {
                              setDateRangeVal(preset.range);
                              setActivePopover(null);
                              showToast(`Rentang tanggal: ${preset.range}`, 'success');
                            }
                          }}
                          className={`px-4 py-2 text-xs font-medium cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#175cd3] text-white font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {preset.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Date Picker (Interactive Calendar + Direct Input) */}
              <div className="form-group relative" data-popover-id="date-picker">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date Picker
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={datePickerVal}
                    onChange={(e) => {
                      setDatePickerVal(e.target.value);
                      setTempDateStr(e.target.value);
                    }}
                    onFocus={() => setActivePopover('date-picker')}
                    onClick={() => setActivePopover('date-picker')}
                    placeholder="YYYY-MM-DD"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 transition-all cursor-text focus:outline-none ${
                      activePopover === 'date-picker'
                        ? 'border-[#175cd3] ring-2 ring-[#175cd3]/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePopover('date-picker')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>

                {/* Month Calendar Popover */}
                {activePopover === 'date-picker' && (
                  <div className="absolute z-30 left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 animate-in fade-in duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-800">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span>
                        {FULL_MONTH_NAMES[pickerMonth]} {pickerYear}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500 mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {getCalendarGrid(pickerYear, pickerMonth).map((cell, idx) => {
                        const isSelected = cell.dateStr === tempDateStr;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setTempDateStr(cell.dateStr)}
                            className={`py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#175cd3] text-white font-bold shadow-xs'
                                : cell.isCurrentMonth
                                ? 'text-slate-700 hover:bg-slate-100'
                                : 'text-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {cell.day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActivePopover(null)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDatePickerVal(tempDateStr);
                          setActivePopover(null);
                        }}
                        className="px-4 py-1.5 bg-[#175cd3] hover:bg-[#1450be] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Date Time Picker (Interactive Calendar + Hour/Min selects + Direct Input) */}
              <div className="form-group relative" data-popover-id="datetime-picker">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date Time Picker
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dateTimePickerVal}
                    onChange={(e) => setDateTimePickerVal(e.target.value)}
                    onFocus={() => setActivePopover('datetime-picker')}
                    onClick={() => setActivePopover('datetime-picker')}
                    placeholder="YYYY-MM-DD HH:mm"
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-800 transition-all cursor-text focus:outline-none ${
                      activePopover === 'datetime-picker'
                        ? 'border-[#175cd3] ring-2 ring-[#175cd3]/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePopover('datetime-picker')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>

                {/* Calendar with Time Selects */}
                {activePopover === 'datetime-picker' && (
                  <div className="absolute z-30 left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 animate-in fade-in duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-800">
                      <button
                        type="button"
                        onClick={handleDtPrevMonth}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span>
                        {FULL_MONTH_NAMES[dtMonth]} {dtYear}
                      </span>
                      <button
                        type="button"
                        onClick={handleDtNextMonth}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500 mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {getCalendarGrid(dtYear, dtMonth).map((cell, idx) => {
                        const isSelected = cell.dateStr === dtSelectedDate;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setDtSelectedDate(cell.dateStr)}
                            className={`py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#175cd3] text-white font-bold shadow-xs'
                                : cell.isCurrentMonth
                                ? 'text-slate-700 hover:bg-slate-100'
                                : 'text-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {cell.day}
                          </button>
                        );
                      })}
                    </div>

                    {/* Time Selectors Row: [15 v] : [17 v] */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={dtHour}
                          onChange={(e) => setDtHour(e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#175cd3] cursor-pointer"
                        >
                          {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                        <span className="text-slate-500 font-bold">:</span>
                        <select
                          value={dtMinute}
                          onChange={(e) => setDtMinute(e.target.value)}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#175cd3] cursor-pointer"
                        >
                          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActivePopover(null)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const formatted = `${dtSelectedDate} ${dtHour}:${dtMinute}`;
                          setDateTimePickerVal(formatted);
                          setActivePopover(null);
                        }}
                        className="px-4 py-1.5 bg-[#175cd3] hover:bg-[#1450be] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Date Range Picker (Real Dual-Month Range Picking + Direct Input) */}
              <div className="form-group relative" data-popover-id="date-range">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date Range Picker
                </label>
                <div
                  className={`flex rounded-xl border overflow-hidden transition-all ${
                    activePopover === 'date-range'
                      ? 'border-[#175cd3] ring-2 ring-[#175cd3]/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => togglePopover('date-range')}
                    className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={dateRangeVal}
                    onChange={(e) => setDateRangeVal(e.target.value)}
                    onFocus={() => setActivePopover('date-range')}
                    onClick={() => setActivePopover('date-range')}
                    placeholder="YYYY-MM-DD - YYYY-MM-DD"
                    className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                {/* Dual-Month Popover with Full Range Selection */}
                {activePopover === 'date-range' && (
                  <div className="absolute z-30 left-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-[560px] max-w-[calc(100vw-2rem)] animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Left Month Calendar */}
                      <div>
                        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-800">
                          <button
                            type="button"
                            onClick={handleRangePrev}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span>
                            {MONTH_NAMES[rangeMonth]} {rangeYear}
                          </span>
                          <span className="w-4" />
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500 mb-2">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
                          {getCalendarGrid(rangeYear, rangeMonth).map((cell, idx) => {
                            const isStart = cell.dateStr === rangeStart;
                            const isEnd = cell.dateStr === rangeEnd;
                            const effectiveEnd = rangeEnd || rangeHover;
                            const inRange =
                              rangeStart &&
                              effectiveEnd &&
                              cell.dateStr > rangeStart &&
                              cell.dateStr < effectiveEnd;

                            let bgClass = cell.isCurrentMonth ? 'text-slate-700' : 'text-slate-300';
                            if (isStart && isEnd) {
                              bgClass = 'bg-[#175cd3] text-white font-bold rounded-md';
                            } else if (isStart) {
                              bgClass = 'bg-[#175cd3] text-white font-bold rounded-l-md';
                            } else if (isEnd) {
                              bgClass = 'bg-[#175cd3] text-white font-bold rounded-r-md';
                            } else if (inRange) {
                              bgClass = 'bg-[#e0f2fe] text-[#0369a1] font-medium';
                            }

                            return (
                              <button
                                key={`m1-${idx}`}
                                type="button"
                                onClick={() => handleDateRangeClick(cell.dateStr)}
                                onMouseEnter={() => {
                                  if (rangeStart && !rangeEnd) {
                                    setRangeHover(cell.dateStr);
                                  }
                                }}
                                className={`py-1 text-xs cursor-pointer transition-colors ${bgClass}`}
                              >
                                {cell.day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Month Calendar */}
                      <div>
                        <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-800">
                          <span className="w-4" />
                          <span>
                            {MONTH_NAMES[nextMonthIdx]} {nextMonthYear}
                          </span>
                          <button
                            type="button"
                            onClick={handleRangeNext}
                            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500 mb-2">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>
                        <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
                          {getCalendarGrid(nextMonthYear, nextMonthIdx).map((cell, idx) => {
                            const isStart = cell.dateStr === rangeStart;
                            const isEnd = cell.dateStr === rangeEnd;
                            const effectiveEnd = rangeEnd || rangeHover;
                            const inRange =
                              rangeStart &&
                              effectiveEnd &&
                              cell.dateStr > rangeStart &&
                              cell.dateStr < effectiveEnd;

                            let bgClass = cell.isCurrentMonth ? 'text-slate-700' : 'text-slate-300';
                            if (isStart && isEnd) {
                              bgClass = 'bg-[#175cd3] text-white font-bold rounded-md';
                            } else if (isStart) {
                              bgClass = 'bg-[#175cd3] text-white font-bold rounded-l-md';
                            } else if (isEnd) {
                              bgClass = 'bg-[#175cd3] text-white font-bold rounded-r-md';
                            } else if (inRange) {
                              bgClass = 'bg-[#e0f2fe] text-[#0369a1] font-medium';
                            }

                            return (
                              <button
                                key={`m2-${idx}`}
                                type="button"
                                onClick={() => handleDateRangeClick(cell.dateStr)}
                                onMouseEnter={() => {
                                  if (rangeStart && !rangeEnd) {
                                    setRangeHover(cell.dateStr);
                                  }
                                }}
                                className={`py-1 text-xs cursor-pointer transition-colors ${bgClass}`}
                              >
                                {cell.day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">
                        {rangeStart ? rangeStart : 'Start Date'} - {rangeEnd ? rangeEnd : (rangeHover ? rangeHover : 'End Date')}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRangeHover(null);
                            setActivePopover(null);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (rangeStart) {
                              const finalEnd = rangeEnd || rangeStart;
                              const result = `${rangeStart} - ${finalEnd}`;
                              setDateRangeVal(result);
                            }
                            setRangeHover(null);
                            setActivePopover(null);
                          }}
                          className="px-4 py-1.5 bg-[#175cd3] hover:bg-[#1450be] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Time Picker (Real spinner + Direct Input) */}
              <div className="form-group relative" data-popover-id="time-picker">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Time Picker
                </label>
                <div
                  className={`flex rounded-xl border overflow-hidden transition-all ${
                    activePopover === 'time-picker'
                      ? 'border-[#175cd3] ring-2 ring-[#175cd3]/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => togglePopover('time-picker')}
                    className="px-3.5 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={timePickerVal}
                    onChange={(e) => handleMainTimeInputChange(e.target.value)}
                    onFocus={() => setActivePopover('time-picker')}
                    onClick={() => setActivePopover('time-picker')}
                    placeholder="HH:MM AM/PM"
                    className="w-full px-3.5 py-2.5 bg-white text-sm text-slate-800 focus:outline-none"
                  />
                </div>

                {/* Spinner Popover with Direct Editable Numbers */}
                {activePopover === 'time-picker' && (
                  <div className="absolute z-30 left-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-60 animate-in fade-in duration-150">
                    <div className="flex items-center justify-center gap-2">
                      {/* Hour Column */}
                      <div className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newH = timeHour >= 12 ? 1 : timeHour + 1;
                            updateTimeVal(newH, timeMinute, timeAmPm);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          maxLength={2}
                          value={timeHourInput}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            setTimeHourInput(raw);
                            const num = parseInt(raw, 10);
                            if (!isNaN(num) && num >= 1 && num <= 12) {
                              setTimeHour(num);
                              setTimePickerVal(`${num}:${String(timeMinute).padStart(2, '0')} ${timeAmPm}`);
                            }
                          }}
                          onBlur={() => {
                            let num = parseInt(timeHourInput, 10);
                            if (isNaN(num) || num < 1) num = 1;
                            if (num > 12) num = 12;
                            setTimeHour(num);
                            setTimeHourInput(String(num));
                            setTimePickerVal(`${num}:${String(timeMinute).padStart(2, '0')} ${timeAmPm}`);
                          }}
                          className="w-10 py-1 text-center text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 focus:border-[#175cd3] focus:bg-white focus:ring-1 focus:ring-[#175cd3] rounded-lg outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newH = timeHour <= 1 ? 12 : timeHour - 1;
                            updateTimeVal(newH, timeMinute, timeAmPm);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-slate-500 font-bold mb-0.5">:</span>

                      {/* Minute Column (with blue border box as in Screenshot 8) */}
                      <div className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newM = (timeMinute + 5) % 60;
                            updateTimeVal(timeHour, newM, timeAmPm);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          maxLength={2}
                          value={timeMinuteInput}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            setTimeMinuteInput(raw);
                            const num = parseInt(raw, 10);
                            if (!isNaN(num) && num >= 0 && num <= 59) {
                              setTimeMinute(num);
                              setTimePickerVal(`${timeHour}:${String(num).padStart(2, '0')} ${timeAmPm}`);
                            }
                          }}
                          onBlur={() => {
                            let num = parseInt(timeMinuteInput, 10);
                            if (isNaN(num) || num < 0) num = 0;
                            if (num > 59) num = 59;
                            setTimeMinute(num);
                            setTimeMinuteInput(String(num).padStart(2, '0'));
                            setTimePickerVal(`${timeHour}:${String(num).padStart(2, '0')} ${timeAmPm}`);
                          }}
                          className="w-10 py-1 text-center text-sm font-bold text-slate-800 border-2 border-[#175cd3] rounded-lg outline-none bg-white focus:ring-2 focus:ring-[#175cd3]/20"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newM = timeMinute <= 0 ? 55 : timeMinute - 5;
                            updateTimeVal(timeHour, newM, timeAmPm);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* AM / PM Column */}
                      <div className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => {
                            const newA = timeAmPm === 'AM' ? 'PM' : 'AM';
                            updateTimeVal(timeHour, timeMinute, newA);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newA = timeAmPm === 'AM' ? 'PM' : 'AM';
                            updateTimeVal(timeHour, timeMinute, newA);
                          }}
                          className="w-10 py-1 text-center text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          {timeAmPm}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newA = timeAmPm === 'AM' ? 'PM' : 'AM';
                            updateTimeVal(timeHour, timeMinute, newA);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
