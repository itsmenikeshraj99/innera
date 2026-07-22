import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';

const SEARCH_DATA = [
  // School subjects
  { id: '1', title: 'Mathematics', subtitle: 'School • Class 6-12', emoji: '📐', type: 'subject', screen: 'SchoolClasses' },
  { id: '2', title: 'Science', subtitle: 'School • Class 6-12', emoji: '🔬', type: 'subject', screen: 'SchoolClasses' },
  { id: '3', title: 'English', subtitle: 'School • Class 6-12', emoji: '📖', type: 'subject', screen: 'SchoolClasses' },
  { id: '4', title: 'Hindi', subtitle: 'School • Class 6-12', emoji: '🖊️', type: 'subject', screen: 'SchoolClasses' },
  { id: '5', title: 'Sanskrit', subtitle: 'School • Class 6-12', emoji: '🕉️', type: 'subject', screen: 'SchoolClasses' },
  { id: '6', title: 'Social Science', subtitle: 'School • Class 6-12', emoji: '🌍', type: 'subject', screen: 'SchoolClasses' },
  // Competitive
  { id: '7', title: 'JEE', subtitle: 'Competitive • Engineering', emoji: '⚛️', type: 'competitive', screen: 'CompetitiveSubjects' },
  { id: '8', title: 'Bank Exams', subtitle: 'Competitive • Banking', emoji: '🏦', type: 'competitive', screen: 'CompetitiveSubjects' },
  { id: '9', title: 'SSC Exams', subtitle: 'Competitive • Government', emoji: '📝', type: 'competitive', screen: 'CompetitiveSubjects' },
  { id: '10', title: 'Railway Exams', subtitle: 'Competitive • Railway', emoji: '🚂', type: 'competitive', screen: 'CompetitiveSubjects' },
  { id: '11', title: 'Defence Exams', subtitle: 'Competitive • Defence', emoji: '🎖️', type: 'competitive', screen: 'CompetitiveSubjects' },
  { id: '12', title: 'UGC NET', subtitle: 'Competitive • Teaching', emoji: '🎓', type: 'competitive', screen: 'CompetitiveSubjects' },
  // Classes
  { id: '13', title: 'Class 06', subtitle: 'School • Foundation', emoji: '🏫', type: 'class', screen: 'SchoolClasses' },
  { id: '14', title: 'Class 07', subtitle: 'School • Building Concepts', emoji: '🏫', type: 'class', screen: 'SchoolClasses' },
  { id: '15', title: 'Class 08', subtitle: 'School • Expanding Algebra', emoji: '🏫', type: 'class', screen: 'SchoolClasses' },
  { id: '16', title: 'Class 09', subtitle: 'School • Secondary', emoji: '🏫', type: 'class', screen: 'SchoolClasses' },
  { id: '17', title: 'Class 10', subtitle: 'School • Board Level', emoji: '🏫', type: 'class', screen: 'SchoolClasses' },
  { id: '18', title: 'Class 11', subtitle: 'School • Higher Studies', emoji: '🏫', type: 'class', screen: 'SchoolClasses' },
  { id: '19', title: 'Class 12', subtitle: 'School • Advanced', emoji: '🏫', type: 'class', screen: 'SchoolClasses' },
];

const TYPE_COLORS: Record<string, string> = {
  subject: COLORS.primary,
  competitive: COLORS.ink,
  class: '#1A5276',
};

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');

  const filtered = query.length > 0
    ? SEARCH_DATA.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Text style={styles.headerSub}>Find subjects, classes & exams</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search subjects, classes..."
          placeholderTextColor={COLORS.inkSoft}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {query.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Search karo</Text>
          <Text style={styles.emptySub}>Subject, class ya exam ka naam type karo</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>😕</Text>
          <Text style={styles.emptyTitle}>Kuch nahi mila</Text>
          <Text style={styles.emptySub}>"{query}" ke liye koi result nahi</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.resultEmoji}>{item.emoji}</Text>
              <View style={styles.resultText}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultSub}>{item.subtitle}</Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[item.type] }]}>
                <Text style={styles.typeText}>{item.type}</Text>
              </View>
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
    padding: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.ink },
  headerSub: { fontSize: 13, color: COLORS.inkSoft, marginTop: 2 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paperDark,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.rule,
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.ink,
  },
  clearBtn: { fontSize: 14, color: COLORS.inkSoft, padding: 4 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 80,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.ink },
  emptySub: { fontSize: 14, color: COLORS.inkSoft, textAlign: 'center' },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paperDark,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.rule,
  },
  resultEmoji: { fontSize: 24 },
  resultText: { flex: 1 },
  resultTitle: { fontSize: 15, fontWeight: '700', color: COLORS.ink },
  resultSub: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  typeBadge: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});