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

type Props = NativeStackScreenProps<RootStackParamList, 'EnglishChapters'>;

export default function EnglishChaptersScreen({ route }: Props) {
  const { classId, bookCode } = route.params;
  const [chapters, setChapters] = useState<any[]>([]);
  const [openChapters, setOpenChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchChapters(); }, []);

  const fetchChapters = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'syllabus', 'english', 'classes', classId));
      if (docSnap.exists()) {
        const subjects = docSnap.data().subjects;
        setChapters(subjects[bookCode]?.chapters ?? []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleChapter = (index: number) => {
    setOpenChapters(prev =>
      prev.includes(index) ? prev.filter(n => n !== index) : [...prev, index]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#1A3A5C" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item, index }) => {
            const isOpen = openChapters.includes(index);
            return (
              <View style={styles.chapterCard}>
                <TouchableOpacity
                  style={styles.chapterHeader}
                  onPress={() => toggleChapter(index)}
                >
                  <View style={styles.numBadge}>
                    <Text style={styles.numText}>{index + 1}</Text>
                  </View>
                  <View style={styles.titleBlock}>
                    <Text style={styles.chTitle}>{item.title}</Text>
                    {item.type ? (
                      <Text style={styles.chType}>{item.type}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.arrow}>{isOpen ? '▼' : '▶'}</Text>
                </TouchableOpacity>

                {isOpen && item.topics?.length > 0 && (
                  <View style={styles.topicsContainer}>
                    {item.topics.map((topic: string, i: number) => (
                      <View key={i} style={styles.topicRow}>
                        <Text style={styles.bullet}>▸</Text>
                        <Text style={styles.topicText}>{topic}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.empty}>No chapters found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  chapterCard: {
    backgroundColor: COLORS.paperDark,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.rule,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  numBadge: {
    width: 30, height: 30,
    borderRadius: 8,
    backgroundColor: '#1A3A5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  titleBlock: { flex: 1 },
  chTitle: { fontSize: 14, fontWeight: '600', color: COLORS.ink },
  chType: { fontSize: 11, color: COLORS.inkSoft, marginTop: 2 },
  arrow: { color: '#1A3A5C', fontSize: 12 },
  topicsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.rule,
    padding: 12, gap: 8,
    backgroundColor: COLORS.paper,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6, paddingVertical: 3,
  },
  bullet: { color: '#1A3A5C', fontSize: 12, marginTop: 2 },
  topicText: { flex: 1, fontSize: 13, color: COLORS.inkSoft, lineHeight: 20 },
  empty: { textAlign: 'center', color: COLORS.inkSoft, marginTop: 40 },
});