// src/features/rider-requests/constants/ride-options.ts

import type {
  RideAccessType,
  TransportMode,
} from '@/features/rider-requests/types/riderRequest.types';

export type TransportModeOption = {
  mode: TransportMode;
  label: string;
  icon: string;
  supportsShared: boolean;
};

export const TRANSPORT_MODES: TransportModeOption[] = [
  {
    mode: 'BODA',
    label: 'Boda Boda',
    icon: 'bicycle-outline',
    supportsShared: false,
  },
  {
    mode: 'BAJAI',
    label: 'Bajaji',
    icon: 'car-sport-outline',
    supportsShared: true,
  },
  {
    mode: 'CAR',
    label: 'Car',
    icon: 'car-outline',
    supportsShared: true,
  },
  {
    mode: 'VAN',
    label: 'Van',
    icon: 'bus-outline',
    supportsShared: true,
  },
  {
    mode: 'BUS',
    label: 'Bus',
    icon: 'bus-outline',
    supportsShared: true,
  },
];

export function eligibleModesFor(
  accessType: RideAccessType,
): TransportModeOption[] {
  return TRANSPORT_MODES.filter((m) => {
    if (accessType === 'SHARED') return m.supportsShared;
    return true;
  });
}