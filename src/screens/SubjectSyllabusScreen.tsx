import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, ActivityIndicator,
  StatusBar, Modal
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';
import { db, auth } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'SubjectSyllabus'>;
type Lang = 'hi' | 'en';

export default function SubjectSyllabusScreen({ route, navigation }: Props) {
  const { subjectId, subjectName, classId } = route.params;
  const [lang, setLang] = useState<Lang>('en');
  const [openChapters, setOpenChapters] = useState<number[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [freeChapters, setFreeChapters] = useState<number[]>([1]);
  const [freeTopics, setFreeTopics] = useState<number[]>([0, 1, 2]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const color = COLORS.primary;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setIsPaid(userDoc.data().isPaid ?? false);
        }
      }

      const syllabusDoc = await getDoc(doc(db, 'syllabus', subjectId, 'classes', classId));
      if (syllabusDoc.exists()) {
        setChapters(syllabusDoc.data().chapters ?? []);
      }

      const freeDoc = await getDoc(doc(db, 'freeContent', subjectId));
      if (freeDoc.exists()) {
        const classConfig = freeDoc.data()[classId];
        if (classConfig) {
          setFreeChapters(classConfig.freeChapters ?? [1]);
          const topicsConfig = classConfig.freeTopicsInChapter;
          if (topicsConfig && topicsConfig[1]) {
            setFreeTopics(topicsConfig[1]);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isChapterFree = (chapterNum: number) => {
    return isPaid || freeChapters.includes(chapterNum);
  };

  const isTopicFree = (chapterNum: number, topicIndex: number) => {
    if (isPaid) return true;
    if (!freeChapters.includes(chapterNum)) return false;
    return freeTopics.includes(topicIndex);
  };

  const toggleChapter = (num: number) => {
    if (!isChapterFree(num)) {
      setShowUpgradeModal(true);
      return;
    }
    setOpenChapters(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const getPlanId = () => {
    if (['class6', 'class7', 'class8'].includes(classId)) return 'class6-8';
    if (['class9', 'class10'].includes(classId)) return 'class9-10';
    if (['class11', 'class12'].includes(classId)) return 'class11-12';
    return 'class6-8';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />

      {/* Language Toggle */}
      <View style={styles.langRow}>
        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setLang(lang === 'hi' ? 'en' : 'hi')}
        >
          <Text style={styles.langText}>{lang === 'en' ? 'हिं' : 'EN'}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={color} />
          <Text style={[styles.loadingText, { color }]}>Loading syllabus...</Text>
        </View>
      ) : chapters.length > 0 ? (
        <ScrollView contentContainerStyle={{ padding: 16 }}>

          {/* Free plan banner */}
          {!isPaid && (
            <View style={styles.freeBanner}>
              <Text style={styles.freeBannerText}>
                🆓 Free Plan — Chapter 1 & first 3 topics free
              </Text>
              <TouchableOpacity onPress={() => setShowUpgradeModal(true)}>
                <Text style={styles.upgradeLink}>Upgrade →</Text>
              </TouchableOpacity>
            </View>
          )}

          {chapters.map((chapter: any) => {
            const chFree = isChapterFree(chapter.num);
            return (
              <View key={chapter.num} style={[styles.chapterCard, !chFree && styles.chapterLocked]}>
                <TouchableOpacity
                  style={styles.chapterHeader}
                  onPress={() => toggleChapter(chapter.num)}
                >
                  <View style={[styles.numBadge, { backgroundColor: chFree ? color : '#999' }]}>
                    <Text style={styles.numText}>{chapter.num}</Text>
                  </View>
                  <Text style={[styles.chTitle, !chFree && styles.lockedText]}>
                    {chapter.title[lang]}
                  </Text>
                  {chFree ? (
                    <Text style={[styles.arrow, { color }]}>
                      {openChapters.includes(chapter.num) ? '▼' : '▶'}
                    </Text>
                  ) : (
                    <Text style={styles.lockIcon}>🔒</Text>
                  )}
                </TouchableOpacity>

                {openChapters.includes(chapter.num) && chFree && (
                  <View style={styles.topicsContainer}>
                    {chapter.topics.map((topic: any, i: number) => {
                      const topicFree = isTopicFree(chapter.num, i);
                      return (
                        <View key={i} style={[styles.topicRow, !topicFree && styles.topicLocked]}>
                          {topicFree ? (
                            <Text style={[styles.bullet, { color }]}>▸</Text>
                          ) : (
                            <Text style={styles.bullet}>🔒</Text>
                          )}
                          <Text style={[styles.topicText, !topicFree && styles.lockedText]}>
                            {topic[lang]}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.center}>
          <Text style={styles.comingSoonEmoji}>🚧</Text>
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonSub}>
            {subjectName} syllabus will be available soon.
          </Text>
        </View>
      )}

      {/* Upgrade Modal */}
      <Modal visible={showUpgradeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalEmoji}>🔒</Text>
            <Text style={styles.modalTitle}>Premium Content</Text>
            <Text style={styles.modalSub}>
              Ye content sirf Premium users ke liye available hai.{'\n'}
              Upgrade karo aur poora syllabus access karo!
            </Text>
            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={() => {
                setShowUpgradeModal(false);
                navigation.navigate('Payment', { planId: getPlanId() });
              }}
            >
              <Text style={styles.upgradeBtnText}>🚀 Upgrade to Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowUpgradeModal(false)}
            >
              <Text style={styles.cancelBtnText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, marginTop: 8 },
  freeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  freeBannerText: {
    fontSize: 12, color: COLORS.primaryDark,
    fontWeight: '600', flex: 1,
  },
  upgradeLink: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  chapterCard: {
    backgroundColor: COLORS.paperDark,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.rule,
  },
  chapterLocked: { opacity: 0.7 },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  numBadge: {
    width: 30, height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  chTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.ink },
  lockedText: { color: COLORS.inkSoft },
  arrow: { fontSize: 12 },
  lockIcon: { fontSize: 16 },
  topicsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.rule,
    padding: 12,
    gap: 8,
    backgroundColor: COLORS.paper,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingVertical: 3,
  },
  topicLocked: { opacity: 0.5 },
  bullet: { fontSize: 12, marginTop: 2 },
  topicText: { flex: 1, fontSize: 13, color: COLORS.inkSoft, lineHeight: 20 },
  comingSoonEmoji: { fontSize: 48 },
  comingSoonTitle: { fontSize: 20, fontWeight: '700', color: COLORS.ink },
  comingSoonSub: {
    fontSize: 14, color: COLORS.inkSoft,
    textAlign: 'center', paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: COLORS.paper,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  modalEmoji: { fontSize: 48 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.ink },
  modalSub: {
    fontSize: 14, color: COLORS.inkSoft,
    textAlign: 'center', lineHeight: 22,
  },
  upgradeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 14,
    width: '100%',
    alignItems: 'center',
  },
  upgradeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { padding: 8 },
  cancelBtnText: { color: COLORS.inkSoft, fontSize: 14 },
});