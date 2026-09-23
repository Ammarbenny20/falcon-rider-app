// src/features/provider/components/ProfessionalHome.tsx

import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/theme/ThemedText';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import { QuickActions } from '@/features/provider/components/QuickActions';
import { StateCard } from '@/features/provider/components/StateCard';
import { useProviderStatus } from '@/features/provider/hooks/useProviderStatus';
import { useProviderStore } from '@/features/provider/store/provider.store';

export function ProfessionalHome() {
  const router = useRouter();
  const { primaryAction, label } = useProviderStatus();
  const availability = useProviderStore((s) => s.professionalAvailability);
  const toggleOnline = useProviderStore((s) => s.toggleProfessionalOnline);

  const handleAction = () => {
    switch (primaryAction.type) {
      case 'go_online':
      case 'go_offline':
        toggleOnline();
        break;
      case 'share_journey':
        router.push('/journey/create' as never);
        break;
      case 'view_journey':
        router.push('/(tabs)/journeys');
        break;
      default:
        // onboard, pending_verification, review_match
        break;
    }
  };

  return (
    <View style={styles.container}>
      <StateCard
        primaryAction={primaryAction}
        label={label}
        onAction={handleAction}
      />

      <QuickActions
        actions={[
          {
            icon: 'list-outline',
            label: 'Activity',
            onPress: () => router.push('/(tabs)/activity'),
          },
          {
            icon: 'time-outline',
            label: 'History',
            onPress: () => router.push('/(tabs)/activity'),
          },
          {
            icon: 'cash-outline',
            label: 'Earnings',
            onPress: () => router.push('/settings/earnings' as never),
          },
        ]}
      />

      <Card style={styles.summaryCard}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Today's activity
        </ThemedText>
        <ThemedText type="title2">TZS 0</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Start completing trips to earn
        </ThemedText>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.five },
  summaryCard: { gap: Spacing.one },
});