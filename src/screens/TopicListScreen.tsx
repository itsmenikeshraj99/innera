import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'TopicList'>;
type Lang = 'hi' | 'en';

export default function TopicListScreen({ navigation, route }: Props) {
  const { subjectId, classId, chapterNum, chapterTitle, sectionType, subjectName, branch, chapterIndex } = route.params;
  const [lang, setLang] = useState<Lang>('en');
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);

      if (subjectId === 'science') {
        const docRef = doc(db, 'syllabus', 'science', 'classes', classId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && branch !== undefined && chapterIndex !== undefined) {
          const subjects = docSnap.data().subjects;
          const chapters = subjects?.[branch] ?? [];
          setTopics(chapters[chapterIndex]?.topics ?? []);
        } else {
          setTopics([]);
        }
      } else {
        const docRef = doc(db, 'syllabus', subjectId, 'classes', classId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const chapters = docSnap.data().chapters ?? [];
          const chapter = chapters.find((c: any) => c.num === chapterNum);
          setTopics(chapter?.topics ?? []);
        } else {
          setTopics([]);
        }
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Language Toggle — sirf opposite language ka button */}
      <View style={styles.langRow}>
       <TouchableOpacity
        style={styles.langBtn}
        onPress={() => setLang(lang === 'hi' ? 'en' : 'hi')}
        >
         <Text style={styles.langText}>
         {lang === 'en' ? 'हिं' : 'EN'}
         </Text>
       </TouchableOpacity>
     </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading topics...</Text>
        </View>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={
            <Text style={styles.chapterTitle}>{chapterTitle}</Text>
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No topics found</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('TopicDetail', {
                topicId: `${classId}_ch${chapterNum}_t${index}`,
                topicTitle: item[lang],
              })}
            >
              <View style={styles.indexBadge}>
                <Text style={styles.indexText}>{index + 1}</Text>
              </View>
              <Text style={styles.topicText}>{item[lang]}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  langActive: { backgroundColor: COLORS.primary },
  langText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  langTextActive: { color: '#fff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
  loadingText: { color: '#888', fontSize: 14 },
  emptyText: { color: '#888', fontSize: 14 },
  chapterTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    elevation: 1,
  },
  indexBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  topicText: { flex: 1, fontSize: 14, color: '#333', lineHeight: 20 },
});