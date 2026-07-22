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

type Props = NativeStackScreenProps<RootStackParamList, 'SocialScienceChapters'>;

export default function SocialScienceChaptersScreen({ navigation, route }: Props) {
  const { classId, className, subjectCode, subjectName } = route.params;
  const [chapters, setChapters] = useState<any[]>([]);
  const [openChapters, setOpenChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
  try {
    const docSnap = await getDoc(doc(db, 'syllabus', 'socialScience', 'classes', classId));
    if (docSnap.exists()) {
      const subjects = docSnap.data().subjects;
      const subject = subjects[subjectCode];

      if (subject) {
        // Data array of objects hai jisme topics_en, topics_hi fields hain
        if (Array.isArray(subject)) {
          setChapters(subject);
        } else if (subject.chapters) {
          setChapters(subject.chapters);
        } else {
          setChapters([]);
        }
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};

  const toggleChapter = (num: number) => {
    setOpenChapters(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Language Toggle */}
      <View style={styles.langRow}>
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setLang(lang === 'en' ? 'hi' : 'en')}
        >
          <Text style={styles.langText}>{lang === 'en' ? 'हिं' : 'EN'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item, index }) => {
  const chapterNum = item.chapter_number ?? (index + 1);
  const isOpen = openChapters.includes(chapterNum);

  // Title directly en/hi field me hai
  const title = item[lang] ?? item.en ?? item.hi ?? `Chapter ${chapterNum}`;

  // Topics bhi alag fields me hain
  const topics = item[`topics_${lang}`] ?? item.topics_en ?? item.topics ?? [];

  return (
    <View style={styles.chapterCard}>
      <TouchableOpacity
        style={styles.chapterHeader}
        onPress={() => toggleChapter(chapterNum)}
      >
        <View style={styles.numBadge}>
          <Text style={styles.numText}>{chapterNum}</Text>
        </View>
        <Text style={styles.chTitle}>{title}</Text>
        <Text style={styles.arrow}>{isOpen ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {isOpen && topics.length > 0 && (
        <View style={styles.topicsContainer}>
          {topics.map((topic: any, i: number) => (
            <View key={i} style={styles.topicRow}>
              <Text style={styles.bullet}>▸</Text>
              <Text style={styles.topicText}>
                {typeof topic === 'string' ? topic : topic[lang] ?? topic.en ?? ''}
              </Text>
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
  langRow: { flexDirection: 'row', justifyContent: 'flex-end', padding: 12 },
  langBtn: {
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
    borderColor: COLORS.primary,
  },
  langText: { color: COLORS.primary, fontWeight: '600' },
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
    backgroundColor: '#7B3F00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  chTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.ink },
  arrow: { color: COLORS.primary, fontSize: 12 },
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
  bullet: { color: '#7B3F00', fontSize: 12, marginTop: 2 },
  topicText: { flex: 1, fontSize: 13, color: COLORS.inkSoft, lineHeight: 20 },
  empty: { textAlign: 'center', color: COLORS.inkSoft, marginTop: 40 },
});