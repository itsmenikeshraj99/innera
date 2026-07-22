import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'SchoolSubjects'>;

const SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', nameHi: 'गणित', emoji: '📐' },
  { id: 'science', name: 'Science', nameHi: 'विज्ञान', emoji: '🔬' },
  { id: 'english', name: 'English', nameHi: 'अंग्रेज़ी', emoji: '📖' },
  { id: 'hindi', name: 'Hindi', nameHi: 'हिंदी', emoji: '🖊️' },
  { id: 'sanskrit', name: 'Sanskrit', nameHi: 'संस्कृत', emoji: '🕉️' },
  { id: 'social_science', name: 'Social Science', nameHi: 'सामाजिक विज्ञान', emoji: '🌍' },
];

export default function SchoolSubjectsScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Subject</Text>
        <Text style={styles.headerSub}>Kaunsa subject padhna hai?</Text>
      </View>

      <FlatList
        data={SUBJECTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SchoolClassSelection', {
              subjectId: item.id,
              subjectName: item.name,
              emoji: item.emoji,
            })}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <View style={styles.textBlock}>
              <Text style={styles.subjectName}>{item.name}</Text>
              <Text style={styles.subjectNameHi}>{item.nameHi}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingBottom: 24,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: COLORS.paperDark,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.rule,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  emoji: { fontSize: 26 },
  textBlock: { flex: 1 },
  subjectName: { fontSize: 16, fontWeight: '700', color: COLORS.ink },
  subjectNameHi: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  arrow: { fontSize: 22, color: COLORS.primary, fontWeight: '700' },
});