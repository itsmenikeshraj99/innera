import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'SubjectHome'>;

const OPTIONS = [
  { id: 'syllabus', label: 'Syllabus', labelHi: 'पाठ्यक्रम', emoji: '📋', available: true },
  { id: 'material', label: 'Material', labelHi: 'सामग्री', emoji: '📚', available: false },
  { id: 'classes', label: 'Classes', labelHi: 'कक्षाएँ', emoji: '🎥', available: false },
];

export default function SubjectHomeScreen({ navigation, route }: Props) {
  const { classId, className, subjectId, subjectName } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerSub}>{className}</Text>
        <Text style={styles.headerTitle}>{subjectName}</Text>
      </View>

      <View style={styles.options}>
        {OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.card, !opt.available && styles.cardDisabled]}
            activeOpacity={opt.available ? 0.8 : 1}
            onPress={() => {
              if (!opt.available) return;
              if (opt.id === 'syllabus') {
                navigation.navigate('SubjectSyllabus', {
                  classId,
                  subjectId,
                  subjectName,
                  sectionType: 'school',
                });
              }
            }}
          >
            <Text style={styles.emoji}>{opt.emoji}</Text>
            <View style={styles.textBlock}>
              <Text style={[styles.label, !opt.available && styles.labelDisabled]}>
                {opt.label}
              </Text>
              <Text style={[styles.labelHi, !opt.available && styles.labelDisabled]}>
                {opt.labelHi}
              </Text>
            </View>
            {opt.available ? (
              <Text style={styles.arrow}>›</Text>
            ) : (
              <View style={styles.soonBadge}>
                <Text style={styles.soonText}>Soon</Text>
              </View>
            )}
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
  options: { padding: 16, gap: 12 },
  card: {
    backgroundColor: COLORS.paperDark,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.rule,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardDisabled: { opacity: 0.5 },
  emoji: { fontSize: 28 },
  textBlock: { flex: 1 },
  label: { fontSize: 17, fontWeight: '700', color: COLORS.ink },
  labelHi: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  labelDisabled: { color: COLORS.inkSoft },
  arrow: { fontSize: 22, color: COLORS.primary, fontWeight: '700' },
  soonBadge: {
    backgroundColor: COLORS.rule,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  soonText: { fontSize: 11, color: COLORS.inkSoft, fontWeight: '600' },
});