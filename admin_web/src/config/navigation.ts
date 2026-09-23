/**
 * Falcon Rider Admin Portal — Navigation Configuration
 *
 * Centralized sidebar navigation.
 * Each item declares its required permission.
 * The sidebar filters items based on the current user's permissions.
 */

import {
  LayoutDashboard,
  Activity,
  Users,
  Car,
  MapPin,
  DollarSign,
  Shield,
  BarChart3,
  Bell,
  UserCog,
  FileText,
  Settings,
  AlertCircle,
  Headphones,
  type LucideIcon,
} from 'lucide-react';

import { PERMISSIONS, type Permission } from './permissions';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
  badge?: 'new' | 'beta';
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: 'Command Center',
    items: [
      {
        title: 'Overview',
        href: '/command-center',
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
      {
        title: 'Action Center',
        href: '/action-center',
        icon: AlertCircle,
        permission: PERMISSIONS.DASHBOARD_VIEW,
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        title: 'Live Operations',
        href: '/operations/live',
        icon: Activity,
        permission: PERMISSIONS.TRIPS_LIVE,
      },
      {
        title: 'Requests',
        href: '/operations/requests',
        icon: Activity,
        permission: PERMISSIONS.REQUESTS_VIEW,
      },
      {
        title: 'Matching',
        href: '/operations/matching',
        icon: Activity,
        permission: PERMISSIONS.MATCHING_VIEW,
      },
      {
        title: 'Trips',
        href: '/operations/trips',
        icon: Activity,
        permission: PERMISSIONS.TRIPS_VIEW,
      },
      {
        title: 'Bookings',
        href: '/operations/bookings',
        icon: Activity,
        permission: PERMISSIONS.BOOKINGS_VIEW,
      },
      {
        title: 'Scheduled',
        href: '/operations/scheduled',
        icon: Activity,
        permission: PERMISSIONS.TRIPS_VIEW,
      },
      {
        title: 'Community Journeys',
        href: '/operations/journeys',
        icon: MapPin,
        permission: PERMISSIONS.JOURNEYS_VIEW,
      },
      {
        title: 'Provider Availability',
        href: '/operations/availability',
        icon: Car,
        permission: PERMISSIONS.PROVIDERS_VIEW,
      },
      {
        title: 'Exceptions',
        href: '/operations/exceptions',
        icon: AlertCircle,
        permission: PERMISSIONS.OPERATIONS_VIEW,
      },
    ],
  },
  {
    title: 'People & Trust',
    items: [
      {
        title: 'Customers',
        href: '/people/customers',
        icon: Users,
        permission: PERMISSIONS.CUSTOMERS_VIEW,
      },
      {
        title: 'Providers',
        href: '/people/providers',
        icon: Car,
        permission: PERMISSIONS.PROVIDERS_VIEW,
      },
      {
        title: 'Verification',
        href: '/people/verification',
        icon: Shield,
        permission: PERMISSIONS.PROVIDERS_VERIFY,
      },
      {
        title: 'Vehicles',
        href: '/people/vehicles',
        icon: Car,
        permission: PERMISSIONS.VEHICLES_VIEW,
      },
      {
        title: 'Documents',
        href: '/people/documents',
        icon: FileText,
        permission: PERMISSIONS.DOCUMENTS_VIEW,
      },
    ],
  },
  {
    title: 'Money',
    items: [
      {
        title: 'Overview',
        href: '/money',
        icon: DollarSign,
        permission: PERMISSIONS.PAYMENTS_VIEW,
      },
      {
        title: 'Payments',
        href: '/money/payments',
        icon: DollarSign,
        permission: PERMISSIONS.PAYMENTS_VIEW,
      },
      {
        title: 'Refunds',
        href: '/money/refunds',
        icon: DollarSign,
        permission: PERMISSIONS.REFUNDS_VIEW,
      },
      {
        title: 'Payouts',
        href: '/money/payouts',
        icon: DollarSign,
        permission: PERMISSIONS.PAYOUTS_VIEW,
      },
      {
        title: 'Receipts',
        href: '/money/receipts',
        icon: FileText,
        permission: PERMISSIONS.RECEIPTS_VIEW,
      },
      {
        title: 'Disputes',
        href: '/money/disputes',
        icon: AlertCircle,
        permission: PERMISSIONS.DISPUTES_VIEW,
      },
      {
        title: 'Reconciliation',
        href: '/money/reconciliation',
        icon: BarChart3,
        permission: PERMISSIONS.RECONCILIATION_VIEW,
      },
    ],
  },
  {
    title: 'Safety',
    items: [
      {
        title: 'Overview',
        href: '/safety',
        icon: Shield,
        permission: PERMISSIONS.SAFETY_VIEW,
      },
      {
        title: 'Incidents',
        href: '/safety/incidents',
        icon: Shield,
        permission: PERMISSIONS.SAFETY_VIEW,
      },
      {
        title: 'Reports',
        href: '/safety/reports',
        icon: FileText,
        permission: PERMISSIONS.SAFETY_VIEW,
      },
      {
        title: 'Emergency Events',
        href: '/safety/emergency',
        icon: AlertCircle,
        permission: PERMISSIONS.SAFETY_VIEW,
      },
      {
        title: 'Restrictions',
        href: '/safety/restrictions',
        icon: Shield,
        permission: PERMISSIONS.SAFETY_VIEW,
      },
      {
        title: 'Appeals',
        href: '/safety/appeals',
        icon: FileText,
        permission: PERMISSIONS.SAFETY_VIEW,
      },
      {
        title: 'Support Cases',
        href: '/safety/support',
        icon: Headphones,
        permission: PERMISSIONS.SAFETY_VIEW,
      },
    ],
  },
  {
    title: 'Insights',
    items: [
      {
        title: 'Overview',
        href: '/insights',
        icon: BarChart3,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
      {
        title: 'Marketplace',
        href: '/insights/marketplace',
        icon: BarChart3,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
      {
        title: 'Mobility',
        href: '/insights/mobility',
        icon: BarChart3,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
      {
        title: 'Customers',
        href: '/insights/customers',
        icon: BarChart3,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
      {
        title: 'Providers',
        href: '/insights/providers',
        icon: BarChart3,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
      {
        title: 'Journeys',
        href: '/insights/journeys',
        icon: BarChart3,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
      {
        title: 'Finance',
        href: '/insights/finance',
        icon: BarChart3,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
      {
        title: 'Geography',
        href: '/insights/geography',
        icon: MapPin,
        permission: PERMISSIONS.ANALYTICS_VIEW,
      },
      {
        title: 'Reports',
        href: '/insights/reports',
        icon: FileText,
        permission: PERMISSIONS.REPORTS_VIEW,
      },
    ],
  },
  {
    title: 'Governance',
    items: [
      {
        title: 'Notifications',
        href: '/governance/notifications',
        icon: Bell,
        permission: PERMISSIONS.NOTIFICATIONS_VIEW,
      },
      {
        title: 'Staff',
        href: '/governance/staff',
        icon: UserCog,
        permission: PERMISSIONS.STAFF_VIEW,
      },
      {
        title: 'Roles',
        href: '/governance/roles',
        icon: UserCog,
        permission: PERMISSIONS.ROLES_VIEW,
      },
      {
        title: 'Audit Log',
        href: '/governance/audit',
        icon: FileText,
        permission: PERMISSIONS.AUDIT_VIEW,
      },
      {
        title: 'Settings',
        href: '/governance/settings',
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_VIEW,
      },
    ],
  },
];