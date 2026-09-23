// src/app/(auth)/onboarding.tsx

import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Spacing } from '@/constants/spacing';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { CapabilityCard } from '@/features/onboarding/components/CapabilityCard';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';
import { useProviderStore } from '@/features/provider/store/provider.store';
import { useTheme } from '@/hooks/use-theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const onboarding = useOnboarding();
  const setProfile = useProviderStore((s) => s.setProfile);

  const handleComplete = () => {
    // Phase 2: mock local update. Phase 3: submit to backend.
    setProfile({
      id: 'mock-provider',
      user_id: 'mock-user',
      full_name: onboarding.identity?.full_name ?? '',
      phone_number: onboarding.contact?.phone_number ?? null,
      email: onboarding.contact?.email ?? null,
      verification_status: 'PENDING',
      capabilities: onboarding.selectedCapabilities,
      capability_status: {
        PROFESSIONAL_SERVICE: onboarding.selectedCapabilities.includes(
          'PROFESSIONAL_SERVICE',
        )
          ? 'PENDING_REVIEW'
          : 'NOT_ENABLED',
        COMMUNITY_JOURNEY: onboarding.selectedCapabilities.includes(
          'COMMUNITY_JOURNEY',
        )
          ? 'PENDING_REVIEW'
          : 'NOT_ENABLED',
      },
      professional_availability: 'OFFLINE',
      community_availability: 'NOT_SHARING',
      rating: null,
      total_trips: 0,
      created_at: new Date().toISOString(),
    });

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.body}>
        <AuthHeader
          title="Set up your provider profile"
          subtitle="Tell us how you want to use Falcon Rider."
          showBack={false}
        />

        {/* Identity */}
        <Input
          label="Full name"
          value={onboarding.identity?.full_name ?? ''}
          onChangeText={(text) =>
            onboarding.setIdentity({ full_name: text })
          }
          autoCapitalize="words"
        />

        {/* Contact */}
        <Input
          label="Phone number"
          keyboardType="phone-pad"
          value={onboarding.contact?.phone_number ?? ''}
          onChangeText={(text) =>
            onboarding.setContact({
              phone_number: text,
              email: onboarding.contact?.email ?? '',
            })
          }
          placeholder="+255700000000"
        />

        <Input
          label="Email (optional)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={onboarding.contact?.email ?? ''}
          onChangeText={(text) =>
            onboarding.setContact({
              phone_number: onboarding.contact?.phone_number ?? '',
              email: text,
            })
          }
        />

        {/* Vehicle */}
        <Card style={styles.vehicleCard}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Vehicle
          </ThemedText>
          <Input
            label="License plate"
            autoCapitalize="characters"
            value={onboarding.vehicle?.license_plate ?? ''}
            onChangeText={(text) =>
              onboarding.setVehicle({
                transport_mode: onboarding.vehicle?.transport_mode ?? 'CAR',
                make: onboarding.vehicle?.make ?? '',
                model: onboarding.vehicle?.model ?? '',
                year: onboarding.vehicle?.year ?? '',
                license_plate: text,
                capacity: onboarding.vehicle?.capacity ?? '4',
                color: onboarding.vehicle?.color ?? '',
              })
            }
          />
          <Input
            label="Capacity (seats)"
            keyboardType="number-pad"
            value={onboarding.vehicle?.capacity ?? ''}
            onChangeText={(text) =>
              onboarding.setVehicle({
                transport_mode: onboarding.vehicle?.transport_mode ?? 'CAR',
                make: onboarding.vehicle?.make ?? '',
                model: onboarding.vehicle?.model ?? '',
                year: onboarding.vehicle?.year ?? '',
                license_plate: onboarding.vehicle?.license_plate ?? '',
                capacity: text,
                color: onboarding.vehicle?.color ?? '',
              })
            }
          />
        </Card>

        {/* Capability selection */}
        <View style={styles.capabilityBlock}>
          <ThemedText type="title3">
            How do you want to use Falcon Rider?
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Select one or both. You can add capabilities later.
          </ThemedText>

          <CapabilityCard
            capability="PROFESSIONAL_SERVICE"
            selected={onboarding.hasCapability('PROFESSIONAL_SERVICE')}
            onPress={() =>
              onboarding.toggleCapability('PROFESSIONAL_SERVICE')
            }
          />
          <CapabilityCard
            capability="COMMUNITY_JOURNEY"
            selected={onboarding.hasCapability('COMMUNITY_JOURNEY')}
            onPress={() =>
              onboarding.toggleCapability('COMMUNITY_JOURNEY')
            }
          />
        </View>

        <Button
          label="Continue"
          size="lg"
          onPress={handleComplete}
          disabled={!onboarding.isReadyForReview()}
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
  vehicleCard: { gap: Spacing.three },
  capabilityBlock: { gap: Spacing.three },
});