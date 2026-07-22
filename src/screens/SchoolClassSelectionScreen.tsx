import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'SchoolClassSelection'>;

const CLASSES = [
  { id: 'class6', name: 'Class 06', sub: 'Foundation' },
  { id: 'class7', name: 'Class 07', sub: 'Building Concepts' },
  { id: 'class8', name: 'Class 08', sub: 'Expanding Knowledge' },
  { id: 'class9', name: 'Class 09', sub: 'Secondary Level' },
  { id: 'class10', name: 'Class 10', sub: 'Board Level' },
  { id: 'class11', name: 'Class 11', sub: 'Higher Studies' },
  { id: 'class12', name: 'Class 12', sub: 'Advanced Level' },
];

export default function SchoolClassSelectionScreen({ navigation, route }: Props) {
  const { subjectId, subjectName, emoji } = route.params;

  const handleClassSelect = (classId: string, className: string) => {
    switch (subjectId) {
      case 'mathematics':
        navigation.navigate('SubjectHome', {
          classId, className,
          subjectId: 'mathematics',
          subjectName: 'Mathematics',
        });
        break;
      case 'science':
        navigation.navigate('ScienceSubjects', { classId, className });
        break;
      case 'english':
        navigation.navigate('EnglishSubjects', { classId, className });
        break;
      case 'hindi':
        navigation.navigate('HindiSubjects', { classId, className });
        break;
      case 'sanskrit':
        navigation.navigate('SanskritSubjects', { classId, className });
        break;
      case 'social_science':
        navigation.navigate('SocialScienceSubjects', { classId, className });
        break;
      default:
        navigation.navigate('SubjectHome', {
          classId, className,
          subjectId,
          subjectName,
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerEmoji}>{emoji}</Text>
        <Text style={styles.headerTitle}>{subjectName}</Text>
        <Text style={styles.headerSub}>Kaunsi class ke liye?</Text>
      </View>

      <FlatList
        data={CLASSES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handleClassSelect(item.id, item.name)}
          >
            <View style={styles.numBox}>
              <Text style={styles.numText}>{item.name.split(' ')[1]}</Text>
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.className}>{item.name}</Text>
              <Text style={styles.classSub}>{item.sub}</Text>
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
    alignItems: 'center',
    gap: 4,
  },
  headerEmoji: { fontSize: 40, marginBottom: 4 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
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
  },
  numBox: {
    width: 48, height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  textBlock: { flex: 1 },
  className: { fontSize: 16, fontWeight: '700', color: COLORS.ink },
  classSub: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  arrow: { fontSize: 22, color: COLORS.primary, fontWeight: '700' },
});