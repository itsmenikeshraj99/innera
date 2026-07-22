import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CompetitiveSubjects'>;

const CATEGORIES = [
  { id: 'jee', name: 'JEE', emoji: '⚛️', sub: 'Mains · Advanced' },
  { id: 'bank', name: 'Bank Exams', emoji: '🏦', sub: 'IBPS · SBI · RBI' },
  { id: 'ssc', name: 'SSC Exams', emoji: '📝', sub: 'CGL · CHSL · MTS · GD' },
  { id: 'railway', name: 'Railway Exams', emoji: '🚂', sub: 'NTPC · Group D · ALP' },
  { id: 'defence', name: 'Defence Exams', emoji: '🎖️', sub: 'NDA · Agniveer · Airforce' },
  { id: 'ugc', name: 'UGC NET', emoji: '🎓', sub: 'Paper 1 · Subject Papers' },
];

export default function CompetitiveSubjectsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.ink} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Competitive Exams</Text>
        <Text style={styles.headerSub}>Choose your exam category</Text>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CompetitiveExams', {
              categoryId: item.id,
              categoryName: item.name,
              categoryEmoji: item.emoji,
            })}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <View style={styles.textBlock}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>{item.sub}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  header: {
    backgroundColor: COLORS.ink,
    padding: 24,
    paddingBottom: 28,
  },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: COLORS.paperDark,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.rule,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.ink,
  },
  emoji: { fontSize: 28 },
  textBlock: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.ink },
  sub: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  arrow: { fontSize: 22, color: COLORS.ink, fontWeight: '700' },
});