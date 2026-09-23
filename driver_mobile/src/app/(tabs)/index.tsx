// src/app/(tabs)/index.tsx

import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

import { Screen } from '@/components/layout/Screen';
import { Spacing } from '@/constants/spacing';
import { LeafletMap, type MapMarker } from '@/components/map/leaflet-map';
import { useMe } from '@/features/auth/hooks/useMe';
import { useSession } from '@/features/auth/hooks/useSession';
import { CapabilityTabs } from '@/features/provider/components/CapabilityTabs';
import { CommunityHome } from '@/features/provider/components/CommunityHome';
import { HomeHeader } from '@/features/provider/components/HomeHeader';
import { ProfessionalHome } from '@/features/provider/components/ProfessionalHome';
import { useProviderStore } from '@/features/provider/store/provider.store';
import type { ProviderCapability } from '@/features/provider/types/provider.types';

export default function HomeScreen() {
  const { user } = useSession();
  const profile = useProviderStore((s) => s.profile);

  // Fetch current user + provider profile
  useMe();

  const capabilities = useMemo(
    () => profile?.capabilities ?? [],
    [profile?.capabilities],
  );

  const [activeCapability, setActiveCapability] =
    useState<ProviderCapability>('PROFESSIONAL_SERVICE');

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const loc = await Location.getCurrentPositionAsync({});
        if (mounted) {
          setLocation({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          });
        }
      } catch {
        // Ignore — location optional
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (capabilities.length === 0) return;
    if (capabilities.includes(activeCapability)) return;
    setActiveCapability(capabilities[0]);
  }, [capabilities, activeCapability]);

  const firstName = user?.full_name?.split(' ')[0] ?? 'there';

  const hasProfessional = capabilities.includes('PROFESSIONAL_SERVICE');
  const hasCommunity = capabilities.includes('COMMUNITY_JOURNEY');

  const markers: MapMarker[] = useMemo(() => {
    if (!location) return [];
    return [
      {
        id: 'driver',
        lat: location.lat,
        lng: location.lng,
        label: user?.full_name ?? 'You',
        status: 'ONLINE',
        type: 'PROVIDER',
      },
    ];
  }, [location, user?.full_name]);

  const renderContent = () => {
    if (capabilities.length === 0) {
      return <ProfessionalHome />;
    }

    if (hasProfessional && hasCommunity) {
      return activeCapability === 'PROFESSIONAL_SERVICE' ? (
        <ProfessionalHome />
      ) : (
        <CommunityHome />
      );
    }

    if (hasProfessional) return <ProfessionalHome />;
    if (hasCommunity) return <CommunityHome />;

    return null;
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader firstName={firstName} />

        {location ? (
          <LeafletMap
            markers={markers}
            center={location}
            zoom={14}
            height={220}
          />
        ) : null}

        {hasProfessional && hasCommunity ? (
          <CapabilityTabs
            capabilities={capabilities}
            active={activeCapability}
            onChange={setActiveCapability}
          />
        ) : null}

        {renderContent()}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: Spacing.five,
    paddingBottom: Spacing.eight,
  },
});
