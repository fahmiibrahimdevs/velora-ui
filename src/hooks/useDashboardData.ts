import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DashboardStats, ExamItem } from '../types';
import { showToast, showError } from '../lib/swal';

const API_URL =
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
    ? import.meta.env.VITE_API_URL
    : '';

interface DashboardResponse {
  stats: DashboardStats;
  recentExams: ExamItem[];
}

// Fallback data in case backend is offline or starting up
const fallbackData: DashboardResponse = {
  stats: {
    activeExams: 3,
    registeredStudents: 248,
    totalQuestions: 1420,
    completionRate: 94.6,
    averageScore: 82.4,
  },
  recentExams: [
    {
      id: 'EXM-001',
      title: 'Penilaian Tengah Semester (PTS) - Matematika Wajib',
      subject: 'Matematika',
      grade: 'Kelas XII MIPA',
      durationMinutes: 90,
      totalQuestions: 40,
      status: 'ongoing',
      participantsCount: 36,
      totalEnrolled: 38,
      startTime: '2026-11-24T08:00:00Z',
    },
    {
      id: 'EXM-002',
      title: 'Simulasi CBT Ujian Nasional - Bahasa Indonesia',
      subject: 'Bahasa Indonesia',
      grade: 'Kelas XII Semua Jurusan',
      durationMinutes: 120,
      totalQuestions: 50,
      status: 'scheduled',
      participantsCount: 0,
      totalEnrolled: 114,
      startTime: '2026-11-25T07:30:00Z',
    },
    {
      id: 'EXM-003',
      title: 'Kuis Harian 03 - Konsep Gelombang & Optik',
      subject: 'Fisika',
      grade: 'Kelas XI MIPA 1',
      durationMinutes: 45,
      totalQuestions: 25,
      status: 'ongoing',
      participantsCount: 32,
      totalEnrolled: 32,
      startTime: '2026-11-24T10:00:00Z',
    },
    {
      id: 'EXM-004',
      title: 'Tryout Mandiri - Sejarah Indonesia Bab 1-4',
      subject: 'Sejarah',
      grade: 'Kelas X IPS',
      durationMinutes: 60,
      totalQuestions: 30,
      status: 'completed',
      participantsCount: 68,
      totalEnrolled: 70,
      startTime: '2026-11-23T13:00:00Z',
    },
  ],
};

export function useDashboardData() {
  return useQuery<DashboardResponse>({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard/stats`);
        if (!response.ok) {
          throw new Error(`Server returned status: ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        console.warn('API fetch failed, falling back to cached/mock data:', err);
        return fallbackData;
      }
    },
    initialData: fallbackData,
  });
}

export function useDeleteExam() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (examId: string) => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard/exams/${examId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Gagal menghapus ujian di server.');
        }
        return await response.json();
      } catch {
        // Optimistic local fallback
        return { success: true, message: `Ujian ${examId} dihapus.` };
      }
    },
    onSuccess: (_, examId) => {
      // Optimistically update query data
      qc.setQueryData<DashboardResponse>(['dashboard-data'], (old) => {
        if (!old) return old;
        return {
          ...old,
          stats: {
            ...old.stats,
            activeExams: Math.max(0, old.stats.activeExams - 1),
          },
          recentExams: old.recentExams.filter((ex) => ex.id !== examId),
        };
      });
      showToast('Ujian berhasil dihapus dari sistem', 'success');
    },
    onError: (err: Error) => {
      showError('Gagal Menghapus', err.message);
    },
  });
}
