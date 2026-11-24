import React, { useState } from 'react';
import { Clock, Users, Play, Trash2, Eye, Calendar, Sparkles } from 'lucide-react';
import type { ExamItem } from '../../types';
import { confirmDialog, showSuccess } from '../../lib/swal';
import { useDeleteExam } from '../../hooks/useDashboardData';
import { TablePagination, ShowEntriesSelector } from '../common/TablePagination';

interface RecentExamsTableProps {
  exams: ExamItem[];
}

export const RecentExamsTable: React.FC<RecentExamsTableProps> = ({ exams }) => {
  const deleteMutation = useDeleteExam();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedExams = exams.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleDelete = async (exam: ExamItem) => {
    const confirmed = await confirmDialog({
      title: 'Hapus Jadwal Ujian?',
      text: `Apakah Anda yakin ingin menghapus ujian "${exam.title}"? Seluruh data sesi dan riwayat token akan dihapus.`,
      confirmButtonText: 'Ya, Hapus Ujian',
      cancelButtonText: 'Batal',
      isDangerous: true,
      icon: 'warning',
    });

    if (confirmed) {
      deleteMutation.mutate(exam.id);
    }
  };

  const handleStartExam = (exam: ExamItem) => {
    showSuccess(
      'Mulai Sesi Ujian CBT',
      `Sesi "${exam.title}" berhasil diaktifkan. Token ujian telah digenerate dan dapat dibagikan kepada peserta kelas ${exam.grade}.`
    );
  };

  const handleViewDetail = (exam: ExamItem) => {
    showSuccess(
      'Detail Paket Ujian',
      `Mata Pelajaran: ${exam.subject} | Kelas: ${exam.grade} | Durasi: ${exam.durationMinutes} menit | Total Soal: ${exam.totalQuestions} PG.`
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800">
              Monitoring Jadwal & Sesi Ujian CBT
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              Live CBT Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar paket ujian yang sedang berlangsung dan terjadwal di sistem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ShowEntriesSelector
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            options={[3, 5, 10, 20]}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11.5px] uppercase tracking-wider text-slate-500 font-semibold">
              <th className="py-3 px-5 sm:px-6">Ujian & Mata Pelajaran</th>
              <th className="py-3 px-4">Tingkat Kelas</th>
              <th className="py-3 px-4">Durasi & Soal</th>
              <th className="py-3 px-4">Peserta Masuk</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 sm:px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedExams.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  Belum ada paket ujian terdaftar. Klik "+ Buat Ujian Baru" untuk memulai.
                </td>
              </tr>
            ) : (
              paginatedExams.map((exam) => {
                const percentAttended =
                  exam.totalEnrolled > 0
                    ? Math.round((exam.participantsCount / exam.totalEnrolled) * 100)
                    : 0;

                return (
                  <tr
                    key={exam.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Title & Subject */}
                    <td className="py-3.5 px-5 sm:px-6">
                      <div className="font-semibold text-slate-900 group-hover:text-[#0c255e] transition-colors leading-snug">
                        {exam.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-normal">
                        <span className="font-medium text-slate-600">{exam.subject}</span>
                        <span>&bull;</span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {exam.id}
                        </span>
                      </div>
                    </td>

                    {/* Grade */}
                    <td className="py-3.5 px-4 font-normal text-slate-600 whitespace-nowrap">
                      {exam.grade}
                    </td>

                    {/* Duration & Questions */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exam.durationMinutes} Menit</span>
                      </div>
                      <div className="text-xs text-slate-500 font-normal mt-0.5">
                        {exam.totalQuestions} Butir PG
                      </div>
                    </td>

                    {/* Participants Progress */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {exam.participantsCount} / {exam.totalEnrolled}
                        </span>
                      </div>
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            exam.status === 'ongoing'
                              ? 'bg-blue-600'
                              : exam.status === 'completed'
                              ? 'bg-emerald-500'
                              : 'bg-slate-300'
                          }`}
                          style={{ width: `${percentAttended}%` }}
                        />
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {exam.status === 'ongoing' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          Berlangsung
                        </span>
                      )}
                      {exam.status === 'scheduled' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          Terjadwal
                        </span>
                      )}
                      {exam.status === 'completed' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          Selesai
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-5 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {exam.status === 'scheduled' && (
                          <button
                            onClick={() => handleStartExam(exam)}
                            title="Aktifkan Ujian Sekarang"
                            className="p-1.5 text-emerald-600 hover:text-white hover:bg-emerald-600 rounded-lg transition-colors border border-emerald-200"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleViewDetail(exam)}
                          title="Lihat Detail Ujian"
                          className="p-1.5 text-slate-600 hover:text-[#0c255e] hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(exam)}
                          title="Hapus Ujian"
                          className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-600 rounded-lg transition-colors border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <TablePagination
        currentPage={currentPage}
        totalEntries={exams.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[3, 5, 10, 20]}
      />
    </div>
  );
};
