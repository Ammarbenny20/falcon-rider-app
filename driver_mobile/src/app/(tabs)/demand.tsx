// src/app/(tabs)/demand.tsx

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { ThemedText } from '@/components/theme/ThemedText';
import { Spacing } from '@/constants/spacing';
import { DemandHeatmap } from '@/features/map/components/DemandHeatmap';

export default function DemandScreen() {
  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="title2">Mahitaji ya Wateja</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Maeneo yenye rangi nyekundu yana mahitaji makubwa
          </ThemedText>
        </View>

        <View style={styles.legend}>
          <LegendItem color="#00ff00" label="Chini" />
          <LegendItem color="#ffff00" label="Kati" />
          <LegendItem color="#ff8800" label="Juu" />
          <LegendItem color="#ff0000" label="Juu Sana" />
        </View>

        <DemandHeatmap height={500} />
      </ScrollView>
    </Screen>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <ThemedText type="small">{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    gap: Spacing.four,
    padding: Spacing.four,
    paddingBottom: Spacing.eight,
  },
  header: { gap: Spacing.one },
  legend: {
    flexDirection: 'row',
    gap: Spacing.four,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
