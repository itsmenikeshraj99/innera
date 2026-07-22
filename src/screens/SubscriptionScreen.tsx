import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { PLANS } from './PaymentScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Subscription'>;

const GREEN = '#1B8A4D';

const EMOJI: Record<string, string> = {
  'class6-8': '📘',
  'class9-10': '📗',
  'class11-12': '📙',
  jee: '⚛️',
  bank: '🏦',
  ssc: '📝',
  railway: '🚂',
  defence: '🎖️',
  ugc: '🎓',
};

const isSchoolPlan = (id: string) => id.startsWith('class');

function PlanCard({ id, navigation }: { id: string; navigation: Props['navigation'] }) {
  const p = PLANS[id];
  return (
    <TouchableOpacity
      style={styles.planCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Payment', { planId: id })}
    >
      <Text style={styles.emoji}>{EMOJI[id] ?? '📖'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.planName}>{p.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{p.oneTime}</Text>
          <Text style={styles.strike}>₹{p.original}</Text>
        </View>
        <Text style={styles.monthlyNote}>ya ₹{p.monthly}/month</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

export default function SubscriptionScreen({ navigation }: Props) {
  const allIds = Object.keys(PLANS);
  const schoolIds = allIds.filter(isSchoolPlan);
  const examIds = allIds.filter((id) => !isSchoolPlan(id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Premium Access</Text>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>✨ Premium Benefits</Text>
          <Text style={styles.feature}>📚 Complete syllabus access</Text>
          <Text style={styles.feature}>🎯 All chapters unlock</Text>
          <Text style={styles.feature}>🌐 Hindi + English Both</Text>
          <Text style={styles.feature}>📅 1 Year validity</Text>
          <Text style={styles.feature}>⭐ Priority support</Text>
        </View>

        <Text style={styles.sectionHeader}>🏫 School Classes</Text>
        {schoolIds.map((id) => (
          <PlanCard key={id} id={id} navigation={navigation} />
        ))}

        <Text style={styles.sectionHeader}>🎯 Competitive Exams</Text>
        {examIds.map((id) => (
          <PlanCard key={id} id={id} navigation={navigation} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: GREEN, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 },
  headerLabel: { color: '#e2f5ea', fontSize: 14, marginBottom: 4 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  featuresCard: { backgroundColor: '#f7f5ef', borderRadius: 16, padding: 16, marginBottom: 20 },
  featuresTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 10 },
  feature: { fontSize: 14, color: '#333', marginTop: 6 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#111', marginTop: 8, marginBottom: 10 },
  planCard: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0',
    borderRadius: 14, padding: 14, marginBottom: 12, backgroundColor: '#fafafa',
  },
  emoji: { fontSize: 26, marginRight: 12 },
  planName: { fontSize: 16, fontWeight: '700', color: '#111' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  price: { fontSize: 18, fontWeight: '800', color: GREEN, marginRight: 8 },
  strike: { fontSize: 13, color: '#999', textDecorationLine: 'line-through' },
  monthlyNote: { fontSize: 12, color: '#888', marginTop: 2 },
  arrow: { fontSize: 24, color: '#999' },
});