import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: 'primary' | 'danger' | 'warning' | 'info';
  children?: { id: string; label: string }[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface ExamItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  durationMinutes: number;
  totalQuestions: number;
  status: 'ongoing' | 'scheduled' | 'completed';
  participantsCount: number;
  totalEnrolled: number;
  startTime: string;
}

export interface DashboardStats {
  activeExams: number;
  registeredStudents: number;
  totalQuestions: number;
  completionRate: number;
  averageScore: number;
}
