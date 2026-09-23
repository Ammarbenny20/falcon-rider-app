// src/app/passenger/matching.tsx

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/spacing';
import { useCancelRiderRequest } from '@/features/rider-requests/hooks/useCancelRiderRequest';
import { useRiderRequest } from '@/features/rider-requests/hooks/useRiderRequest';
import { useRideDraftStore } from '@/store/ride-draft.store';
import { useTheme } from '@/hooks/use-theme';

type StatusCopy = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

function copyForStatus(status: string): StatusCopy {
  switch (status) {
    case 'DRAFT':
    case 'SUBMITTED':
    case 'MATCHING':
      return {
        icon: 'search',
        title: 'Finding your ride',
        description: 'Searching for available drivers nearby…',
      };
    case 'MATCHED':
      return {
        icon: 'checkmark-circle',
        title: 'Driver found',
        description: 'A driver is on the way to your pickup point.',
      };
    case 'BOOKED':
      return {
        icon: 'checkmark-circle',
        title: 'Ride confirmed',
        description: 'Your ride has been booked successfully.',
      };
    case 'NO_MATCH_FOUND':
      return {
        icon: 'close-circle',
        title: 'No ride found',
        description:
          'We couldn’t find a ride right now. Try adjusting your trip.',
      };
    case 'CANCELLED':
      return {
        icon: 'close-circle',
        title: 'Request cancelled',
        description: 'This ride request was cancelled.',
      };
    case 'FULFILLED':
      return {
        icon: 'checkmark-done-circle',
        title: 'Ride completed',
        description: 'Your ride has been fulfilled.',
      };
    default:
      return {
        icon: 'time',
        title: 'Processing',
        description: 'We’re working on your ride.',
      };
  }
}

export default function MatchingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { requestId } = useLocalSearchParams<{ requestId: string }>();

  const { data: request, isError } = useRiderRequest(requestId);
  const cancel = useCancelRiderRequest();
  const resetDraft = useRideDraftStore((s) => s.reset);

  const handleCancel = () => {
    Alert.alert(
      'Cancel request',
      'Are you sure you want to cancel this ride request?',
      [
        { text: 'Keep searching', style: 'cancel' },
        {
          text: 'Cancel request',
          style: 'destructive',
          onPress: async () => {
            if (!requestId) return;
            try {
              await cancel.mutateAsync({ id: requestId });
              resetDraft();
              router.replace('/(tabs)');
            } catch {
              Alert.alert('Could not cancel', 'Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleChangeTrip = () => {
    resetDraft();
    router.replace('/passenger/search');
  };

  if (isError) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.centered}>
          <ThemedText type="title3">Could not load request</ThemedText>
          <Button
            label="Back to home"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const status = request?.status ?? 'SUBMITTED';
  const copy = copyForStatus(status);

  // Show cancel button only while the request is still active.
  const isSearching =
    status === 'DRAFT' ||
    status === 'SUBMITTED' ||
    status === 'MATCHING';

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: theme.backgroundSelected },
            ]}
          >
            <Ionicons name={copy.icon} size={36} color={theme.primary} />
          </View>
          <ThemedText type="title2">{copy.title}</ThemedText>
          <ThemedText
            type="body"
            themeColor="textSecondary"
            style={styles.center}
          >
            {copy.description}
          </ThemedText>
        </View>

        <Card style={styles.summaryCard}>
          <View style={styles.row}>
            <View style={[styles.dot, { backgroundColor: theme.primary }]} />
            <ThemedText type="body" numberOfLines={1} style={styles.flexText}>
              {request?.origin.label ?? 'Pickup'}
            </ThemedText>
          </View>
          <View
            style={[styles.connector, { backgroundColor: theme.border }]}
          />
          <View style={styles.row}>
            <Ionicons name="location" size={14} color={theme.danger} />
            <ThemedText type="body" numberOfLines={1} style={styles.flexText}>
              {request?.destination.label ?? 'Destination'}
            </ThemedText>
          </View>
        </Card>

        <Card style={styles.summaryCard}>
          <ThemedText type="small" themeColor="textSecondary">
            Status
          </ThemedText>
          <ThemedText type="body">{status}</ThemedText>
        </Card>

        {isSearching ? (
          <Button
            label="Cancel request"
            variant="secondary"
            size="lg"
            onPress={handleCancel}
            loading={cancel.isPending}
          />
        ) : null}

        <Button
          label="Change trip"
          variant="ghost"
          onPress={handleChangeTrip}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
    maxWidth: 280,
  },
  summaryCard: { gap: Spacing.two },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  connector: {
    width: 1.5,
    height: 16,
    marginLeft: 5,
  },
  flexText: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
});