// src/app/journey/templates.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ThemedText } from '@/components/theme/ThemedText';
import { Button } from '@/components/ui/Button';
import { Spacing } from '@/constants/spacing';
import { JourneyTemplateCard } from '@/features/journey/components/JourneyTemplateCard';
import { useJourneyTemplates } from '@/features/journey/hooks/useJourneyTemplates';
import { useTheme } from '@/hooks/use-theme';

export default function JourneyTemplatesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data: templates, isLoading } = useJourneyTemplates();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </Pressable>
        <ThemedText type="body">Recurring journeys</ThemedText>
        <View style={{ width: 26 }} />
      </View>

      {isLoading ? (
        <LoadingState />
      ) : !templates || templates.length === 0 ? (
        <EmptyState
          icon="repeat-outline"
          title="No recurring journeys"
          description="Create a recurring journey for your daily commute — e.g. Mbezi to Posta, Mon-Fri, 07:30."
          actionLabel="Create template"
          onAction={() => router.push('/journey/create' as never)}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.body}>
          {templates.map((template) => (
            <JourneyTemplateCard
              key={template.id}
              template={template}
            />
          ))}
          <Button
            label="Create template"
            onPress={() => router.push('/journey/create' as never)}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  body: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
});