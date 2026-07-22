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

type Props = NativeStackScreenProps<RootStackParamList, 'SanskritSubjects'>;

const EDITION_COLORS: Record<string, { color: string; label: string }> = {
  current: { color: '#4A235A', label: 'Current' },
  previous: { color: '#6B7A2A', label: 'Previous' },
  elective: { color: '#6C3483', label: 'Elective' },
  both: { color: '#1A5276', label: 'Core+Elective' },
};

export default function SanskritSubjectsScreen({ navigation, route }: Props) {
  const { classId, className } = route.params;
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'syllabus', 'sanskrit', 'classes', classId));
      if (docSnap.exists()) {
        const subjects = docSnap.data().subjects;
        const list = Object.entries(subjects).map(([code, val]: any) => ({
          code,
          bookName: val.bookName ?? code,
          icon: val.icon ?? '🕉️',
          note: val.note ?? '',
          edition: val.edition ?? 'current',
        }));
        setBooks(list);
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
        <Text style={styles.headerTitle}>संस्कृत (Sanskrit)</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A235A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.code}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const editionInfo = EDITION_COLORS[item.edition] ?? EDITION_COLORS.current;
            return (
              <TouchableOpacity
                style={[styles.card, { borderLeftColor: editionInfo.color }]}
                onPress={() => navigation.navigate('SanskritChapters', {
                  classId,
                  className,
                  bookCode: item.code,
                  bookName: item.bookName,
                })}
              >
                <Text style={styles.emoji}>{item.icon}</Text>
                <View style={styles.textBlock}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.bookName, { color: editionInfo.color }]} numberOfLines={2}>
                      {item.bookName}
                    </Text>
                    <View style={[styles.editionBadge, { backgroundColor: editionInfo.color }]}>
                      <Text style={styles.editionText}>{editionInfo.label}</Text>
                    </View>
                  </View>
                  {item.note ? (
                    <Text style={styles.note} numberOfLines={2}>{item.note}</Text>
                  ) : null}
                </View>
                <Text style={[styles.arrow, { color: editionInfo.color }]}>›</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  header: {
    backgroundColor: '#4A235A',
    padding: 24,
    paddingBottom: 28,
  },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 4 },
  card: {
    backgroundColor: COLORS.paperDark,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.rule,
    borderLeftWidth: 4,
  },
  emoji: { fontSize: 28 },
  textBlock: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  bookName: { fontSize: 14, fontWeight: '700', flex: 1 },
  editionBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10,
  },
  editionText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  note: { fontSize: 11, color: COLORS.inkSoft, marginTop: 4, lineHeight: 16 },
  arrow: { fontSize: 22, fontWeight: '700' },
});