import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'ScienceChapters'>;
type Lang = 'hi' | 'en';

const BRANCH_COLORS = {
  physics: { color: '#2B5D8C', bg: '#E4EEF6' },
  chemistry: { color: '#B0621A', bg: '#F7ECDC' },
  biology: { color: '#2F6B3F', bg: '#E7F1E6' },
};

export default function ScienceChaptersScreen({ navigation, route }: Props) {
  const { classId, className, branch, branchName } = route.params;
  const [lang, setLang] = useState<Lang>('en');
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const branchStyle = BRANCH_COLORS[branch];

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'syllabus', 'science', 'classes', classId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const subjects = docSnap.data().subjects;
        setChapters(subjects[branch] ?? []);
      } else {
        setChapters([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setChapters([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: branchStyle.color }]}>
        <Text style={styles.className}>{className}</Text>
        <Text style={styles.branchName}>{branchName}</Text>
      </View>

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
          <ActivityIndicator size="large" color={branchStyle.color} />
          <Text style={[styles.loadingText, { color: branchStyle.color }]}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
             style={[styles.card, { borderLeftColor: branchStyle.color, backgroundColor: branchStyle.bg }]}
             onPress={() => navigation.navigate('TopicList', {
                classId,
                chapterNum: index + 1,
                chapterTitle: item[lang],
                subjectId: 'science',
                subjectName: branchName,
                sectionType: 'school',
                branch,
                chapterIndex: index,
             })}
             >
              <View style={[styles.numBadge, { backgroundColor: branchStyle.color }]}>
                <Text style={styles.numText}>{index + 1}</Text>
              </View>
              <Text style={[styles.chapterText, { color: branchStyle.color }]}>
                {item[lang]}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No chapters found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F1E4' },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  className: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  branchName: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 4 },
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
    borderColor: '#241F16',
  },
  langText: { color: '#241F16', fontWeight: '600' },
  langTextActive: { color: '#fff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
  loadingText: { fontSize: 14, marginTop: 8 },
  emptyText: { color: '#888', fontSize: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    gap: 12,
    elevation: 1,
  },
  numBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  chapterText: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },
});