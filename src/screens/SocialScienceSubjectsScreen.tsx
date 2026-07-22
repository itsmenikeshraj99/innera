import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'SocialScienceSubjects'>;

const SUBJECT_META: Record<string, { emoji: string; color: string; bg: string }> = {
  hist: { emoji: '🏛️', color: '#7B3F00', bg: '#F5E6D3' },
  history: { emoji: '🏛️', color: '#7B3F00', bg: '#F5E6D3' },
  geo: { emoji: '🌍', color: '#1A5276', bg: '#D6EAF8' },
  geography: { emoji: '🌍', color: '#1A5276', bg: '#D6EAF8' },
  civics: { emoji: '⚖️', color: '#1E8449', bg: '#D5F5E3' },
  politicalScience: { emoji: '🏛️', color: '#6C3483', bg: '#E8DAEF' },
  politicsInIndia: { emoji: '🗳️', color: '#6C3483', bg: '#E8DAEF' },
  politicalTheory: { emoji: '📜', color: '#6C3483', bg: '#E8DAEF' },
  indianConstitution: { emoji: '📋', color: '#1E8449', bg: '#D5F5E3' },
  economics: { emoji: '💰', color: '#B7950B', bg: '#FEF9E7' },
  macroEconomics: { emoji: '📊', color: '#B7950B', bg: '#FEF9E7' },
  indiaPeopleEconomy: { emoji: '🇮🇳', color: '#C0392B', bg: '#FDEDEC' },
  physicalGeography: { emoji: '🗺️', color: '#1A5276', bg: '#D6EAF8' },
  humanGeography: { emoji: '👥', color: '#1A5276', bg: '#D6EAF8' },
};

const getSubjectMeta = (code: string) =>
  SUBJECT_META[code] ?? { emoji: '📚', color: COLORS.primary, bg: COLORS.primaryBg };

const formatSubjectName = (code: string, name: any): string => {
  if (name?.en) return name.en;
  return code
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

export default function SocialScienceSubjectsScreen({ navigation, route }: Props) {
  const { classId, className } = route.params;
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'syllabus', 'socialScience', 'classes', classId));
      if (docSnap.exists()) {
        const data = docSnap.data().subjects;
        const list = Object.entries(data).map(([code, val]: any) => ({
          code,
          name: formatSubjectName(code, val.name),
          ...getSubjectMeta(code),
        }));
        setSubjects(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>{className}</Text>
        <Text style={styles.headerTitle}>Social Science</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.code}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: item.bg, borderLeftColor: item.color }]}
              onPress={() => navigation.navigate('SocialScienceChapters', {
                classId,
                className,
                subjectCode: item.code,
                subjectName: item.name,
              })}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={[styles.subjectName, { color: item.color }]}>{item.name}</Text>
              <Text style={[styles.arrow, { color: item.color }]}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  header: {
    backgroundColor: '#7B3F00',
    padding: 24,
    paddingBottom: 28,
  },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    gap: 14,
    elevation: 2,
  },
  emoji: { fontSize: 28 },
  subjectName: { flex: 1, fontSize: 16, fontWeight: '700' },
  arrow: { fontSize: 22, fontWeight: '700' },
});