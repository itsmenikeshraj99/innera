import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ScienceSubjects'>;
type Lang = 'hi' | 'en';

const BRANCHES = [
  { id: 'physics', name: { en: 'Physics', hi: 'भौतिक विज्ञान' }, emoji: '⚛️', color: '#2B5D8C', bg: '#E4EEF6' },
  { id: 'chemistry', name: { en: 'Chemistry', hi: 'रसायन विज्ञान' }, emoji: '⚗️', color: '#B0621A', bg: '#F7ECDC' },
  { id: 'biology', name: { en: 'Biology', hi: 'जीव विज्ञान' }, emoji: '🧬', color: '#2F6B3F', bg: '#E7F1E6' },
];

export default function ScienceSubjectsScreen({ navigation, route }: Props) {
  const { classId, className } = route.params;
  const [lang, setLang] = useState<Lang>('en');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerSub}>{className}</Text>
        <Text style={styles.headerTitle}>{lang === 'hi' ? 'विज्ञान' : 'Science'}</Text>
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

      <View style={styles.branches}>
        {BRANCHES.map(branch => (
          <TouchableOpacity
            key={branch.id}
            style={[styles.card, { backgroundColor: branch.bg, borderLeftColor: branch.color }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ScienceChapters', {
              classId,
              className,
              branch: branch.id as 'physics' | 'chemistry' | 'biology',
              branchName: branch.name[lang],
            })}
          >
            <Text style={styles.emoji}>{branch.emoji}</Text>
            <View style={styles.textBlock}>
              <Text style={[styles.branchName, { color: branch.color }]}>{branch.name[lang]}</Text>
              <Text style={[styles.branchSub, { color: branch.color }]}>
                {lang === 'hi' ? 'अध्याय देखें' : 'View Chapters'}
              </Text>
            </View>
            <Text style={[styles.arrow, { color: branch.color }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingBottom: 28,
  },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 4 },
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
  langText: { color: COLORS.primary, fontWeight: '600' },
  langTextActive: { color: '#fff' },
  branches: { padding: 16, gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 5,
    gap: 14,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  emoji: { fontSize: 32 },
  textBlock: { flex: 1 },
  branchName: { fontSize: 18, fontWeight: '700' },
  branchSub: { fontSize: 12, marginTop: 2, opacity: 0.8 },
  arrow: { fontSize: 24, fontWeight: '700' },
});