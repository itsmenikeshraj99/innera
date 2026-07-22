import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'TopicDetail'>;

export default function TopicDetailScreen({ route }: Props) {
  const { topicTitle } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{topicTitle}</Text>
        <View style={styles.comingSoon}>
          <Text style={styles.emoji}>🚧</Text>
          <Text style={styles.comingSoonText}>
            Detailed content coming soon!
          </Text>
          <Text style={styles.sub}>
            Notes, explanations aur practice questions jald aayenge.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  content: { padding: 20 },
  title: {
    fontSize: 20, fontWeight: '800',
    color: COLORS.ink, marginBottom: 32,
    lineHeight: 28,
  },
  comingSoon: {
    alignItems: 'center', gap: 12,
    backgroundColor: COLORS.paperDark,
    borderRadius: 16, padding: 32,
    borderWidth: 1, borderColor: COLORS.rule,
  },
  emoji: { fontSize: 48 },
  comingSoonText: { fontSize: 18, fontWeight: '700', color: COLORS.ink },
  sub: { fontSize: 14, color: COLORS.inkSoft, textAlign: 'center', lineHeight: 22 },
});