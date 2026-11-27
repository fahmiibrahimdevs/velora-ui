import {
  AlertCircle,
  Bike,
  Boxes,
  Columns3,
  FileText,
  Flame,
  MoreHorizontal,
  Plug,
  Shapes,
  Square,
  User,
} from 'lucide-react';
import type { NavSection } from '../../types';

export const navSections: NavSection[] = [
  {
    title: 'DASHBOARD',
    items: [
      {
        id: 'dashboard-group',
        label: 'Dashboard',
        icon: Flame,
        children: [
          { id: 'general-dashboard', label: 'General Dashboard' },
          { id: 'ecommerce-dashboard', label: 'Ecommerce Dashboard' },
        ],
      },
    ],
  },
  {
    title: 'STARTER',
    items: [
      {
        id: 'layout-group',
        label: 'Layout',
        icon: Columns3,
        children: [
          { id: 'layout-default', label: 'Default Layout' },
          { id: 'layout-top-navigation', label: 'Top Navigation' },
        ],
      },
      {
        id: 'blank-page',
        label: 'Blank Page',
        icon: Square,
      },
      {
        id: 'bootstrap-group',
        label: 'Bootstrap',
        icon: Boxes,
        children: [
          { id: 'alert', label: 'Alert' },
          { id: 'badge', label: 'Badge' },
          { id: 'breadcrumb', label: 'Breadcrumb' },
          { id: 'buttons', label: 'Buttons' },
          { id: 'card', label: 'Card' },
          { id: 'carousel', label: 'Carousel' },
          { id: 'collapse', label: 'Collapse' },
          { id: 'dropdown', label: 'Dropdown' },
          { id: 'form', label: 'Form' },
          { id: 'list-group', label: 'List Group' },
          { id: 'media-object', label: 'Media Object' },
          { id: 'modal', label: 'Modal' },
          { id: 'nav', label: 'Nav' },
          { id: 'navbar', label: 'Navbar' },
          { id: 'pagination', label: 'Pagination' },
          { id: 'popover', label: 'Popover' },
          { id: 'progress', label: 'Progress' },
          { id: 'table', label: 'Table' },
          { id: 'tooltip', label: 'Tooltip' },
          { id: 'typography', label: 'Typography' },
        ],
      },
    ],
  },
  {
    title: 'VELORA UI',
    items: [
      {
        id: 'components-group',
        label: 'Components',
        icon: Shapes,
        children: [
          { id: 'article', label: 'Article' },
          { id: 'avatar', label: 'Avatar' },
          { id: 'chat-box', label: 'Chat Box' },
          { id: 'empty-states', label: 'Empty & Skeleton' },
          { id: 'gallery', label: 'Gallery' },
          { id: 'multiple-upload', label: 'Multiple Upload' },
          { id: 'statistic', label: 'Statistic' },
          { id: 'tab', label: 'Tab' },
          { id: 'components-table', label: 'Table' },
          { id: 'user', label: 'User' },
        ],
      },
      {
        id: 'forms-group',
        label: 'Forms',
        icon: FileText,
        children: [
          { id: 'advanced-form', label: 'Advanced Form' },
          { id: 'editor', label: 'Editor' },
          { id: 'validation', label: 'Validation' },
          { id: 'upload-files', label: 'Upload Files' },
        ],
      },
      {
        id: 'modules-group',
        label: 'Modules',
        icon: Plug,
        children: [
          { id: 'calendar', label: 'Calendar' },
          { id: 'chartjs', label: 'ChartJS' },
          { id: 'datatables', label: 'DataTables' },
          { id: 'flag', label: 'Flag' },
          { id: 'font-awesome', label: 'Font Awesome' },
          { id: 'ion-icons', label: 'Ion Icons' },
          { id: 'owl-carousel', label: 'Owl Carousel' },
          { id: 'sparkline', label: 'Sparkline' },
          { id: 'sweet-alert', label: 'Sweet Alert' },
          { id: 'toastr', label: 'Toastr' },
          { id: 'vector-map', label: 'Vector Map' },
          { id: 'weather-icon', label: 'Weather Icon' },
        ],
      },
    ],
  },
  {
    title: 'PAGES',
    items: [
      {
        id: 'auth-group',
        label: 'Auth',
        icon: User,
        children: [
          { id: 'forgot-password', label: 'Forgot Password' },
          { id: 'login', label: 'Login' },
          { id: 'login-2', label: 'Login 2' },
          { id: 'register', label: 'Register' },
          { id: 'reset-password', label: 'Reset Password' },
        ],
      },
      {
        id: 'errors-group',
        label: 'Errors',
        icon: AlertCircle,
        children: [
          { id: 'error-503', label: '503' },
          { id: 'error-403', label: '403' },
          { id: 'error-404', label: '404' },
          { id: 'error-500', label: '500' },
        ],
      },
      {
        id: 'features-group',
        label: 'Features',
        icon: Bike,
        children: [
          { id: 'activities', label: 'Activities' },
          { id: 'chat-inbox', label: 'Chat Inbox' },
          { id: 'file-manager', label: 'File Manager' },
          { id: 'kanban', label: 'Kanban' },
          { id: 'notifications', label: 'Notification Center' },
          { id: 'post-create', label: 'Post Create' },
          { id: 'posts', label: 'Posts' },
          { id: 'profile', label: 'Profile' },
          { id: 'settings', label: 'Settings' },
          { id: 'setting-detail', label: 'Setting Detail' },
          { id: 'tickets', label: 'Tickets' },
        ],
      },
      {
        id: 'utilities-group',
        label: 'Utilities',
        icon: MoreHorizontal,
        children: [
          { id: 'contact', label: 'Contact' },
          { id: 'invoice', label: 'Invoice' },
          { id: 'subscribe', label: 'Subscribe' },
        ],
      },
    ],
  },
];

export interface SearchNavEntry {
  id: string;
  label: string;
  group: string;
  section: string;
}

export const searchableNavItems: SearchNavEntry[] = navSections.flatMap((sec) =>
  sec.items.flatMap((item) =>
    item.children && item.children.length > 0
      ? item.children.map((child) => ({
          id: child.id,
          label: child.label,
          group: item.label,
          section: sec.title,
        }))
      : [
          {
            id: item.id,
            label: item.label,
            group: sec.title,
            section: sec.title,
          },
        ],
  ),
);

const BREADCRUMB_ROUTE_MAP: Record<string, string> = {
  'Velora UI': 'general-dashboard',
  Dashboard: 'general-dashboard',
  Starter: 'layout-default',
  Layout: 'layout-default',
  Bootstrap: 'modal',
  'Bootstrap Components': 'modal',
  Components: 'empty-states',
  Forms: 'advanced-form',
  Modules: 'datatables',
  Features: 'activities',
  Utilities: 'invoice',
};

export function resolveBreadcrumbRoute(crumb: string): string {
  return BREADCRUMB_ROUTE_MAP[crumb] ?? 'general-dashboard';
}
