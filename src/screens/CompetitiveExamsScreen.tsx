import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CompetitiveExams'>;

const EXAMS: Record<string, { id: string; name: string; fullName: string }[]> = {
  jee: [
    { id: 'jee_mains', name: 'JEE Mains', fullName: 'Joint Entrance Exam — Mains' },
    { id: 'jee_advanced', name: 'JEE Advanced', fullName: 'Joint Entrance Exam — Advanced' },
  ],
  bank: [
    { id: 'ibps_po', name: 'IBPS PO', fullName: 'IBPS Probationary Officer' },
    { id: 'ibps_clerk', name: 'IBPS Clerk', fullName: 'IBPS Clerical Cadre' },
    { id: 'sbi_po', name: 'SBI PO', fullName: 'SBI Probationary Officer' },
    { id: 'sbi_clerk', name: 'SBI Clerk', fullName: 'SBI Junior Associates' },
    { id: 'rbi_grade_b', name: 'RBI Grade B', fullName: 'RBI Grade B Officer' },
    { id: 'rrb_po', name: 'RRB PO', fullName: 'Regional Rural Bank PO' },
  ],
  ssc: [
    { id: 'ssc_cgl', name: 'SSC CGL', fullName: 'Combined Graduate Level' },
    { id: 'ssc_chsl', name: 'SSC CHSL', fullName: 'Combined Higher Secondary Level' },
    { id: 'ssc_mts', name: 'SSC MTS', fullName: 'Multi-Tasking Staff' },
    { id: 'ssc_gd', name: 'SSC GD', fullName: 'Constable General Duty' },
    { id: 'ssc_cpo', name: 'SSC CPO', fullName: 'Central Police Organisation' },
  ],
  railway: [
    { id: 'rrb_ntpc', name: 'RRB NTPC', fullName: 'Non-Technical Popular Categories' },
    { id: 'rrb_group_d', name: 'RRB Group D', fullName: 'Level 1 Posts' },
    { id: 'rrb_alp', name: 'RRB ALP', fullName: 'Assistant Loco Pilot' },
    { id: 'rrb_je', name: 'RRB JE', fullName: 'Junior Engineer' },
  ],
  defence: [
    { id: 'nda', name: 'NDA', fullName: 'National Defence Academy' },
    { id: 'agniveer_army', name: 'Agniveer Army', fullName: 'Agnipath — Indian Army' },
    { id: 'agniveer_navy', name: 'Agniveer Navy', fullName: 'Agnipath — Indian Navy' },
    { id: 'airforce_agniveer', name: 'Agniveer Airforce', fullName: 'Agnipath — Indian Airforce' },
    { id: 'cds', name: 'CDS', fullName: 'Combined Defence Services' },
  ],
};

export default function CompetitiveExamsScreen({ navigation, route }: Props) {
  const { categoryId, categoryName, categoryEmoji } = route.params;
  const exams = EXAMS[categoryId] ?? [];

  return (
    <View style={styles.container}>
      <FlatList
        data={exams}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>{categoryEmoji}</Text>
            <Text style={styles.headerTitle}>{categoryName}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              // Aage SubjectHome ya koi screen navigate karenge
              // Abhi ke liye placeholder
            }}
          >
            <View style={styles.textBlock}>
              <Text style={styles.examName}>{item.name}</Text>
              <Text style={styles.fullName}>{item.fullName}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  headerEmoji: { fontSize: 44, marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#222' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  textBlock: { flex: 1 },
  examName: { fontSize: 16, fontWeight: '700', color: '#222' },
  fullName: { fontSize: 12, color: '#888', marginTop: 2 },
  arrow: { fontSize: 22, color: COLORS.primary, fontWeight: '700' },
});