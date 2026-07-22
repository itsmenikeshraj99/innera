import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'SchoolClasses'>;

const CLASSES = [
  { id: 'class6', name: 'Class 06' },
  { id: 'class7', name: 'Class 07' },
  { id: 'class8', name: 'Class 08' },
  { id: 'class9', name: 'Class 09' },
  { id: 'class10', name: 'Class 10' },
  { id: 'class11', name: 'Class 11' },
  { id: 'class12', name: 'Class 12' },
];

export default function SchoolClassesScreen({ navigation, route }: Props) {
  const { subjectId, subjectName } = route.params;

  const goToSubjectContent = (classId: string, className: string) => {
    if (subjectId === 'science') {
      navigation.navigate('ScienceSubjects', { classId, className });
    } else if (subjectId === 'social_science') {
      navigation.navigate('SocialScienceSubjects', { classId, className });
    } else if (subjectId === 'english') {
      navigation.navigate('EnglishSubjects', { classId, className });
    } else if (subjectId === 'hindi') {
      navigation.navigate('HindiSubjects', { classId, className });
    } else if (subjectId === 'sanskrit') {
      navigation.navigate('SanskritSubjects', { classId, className });
    } else {
      navigation.navigate('SubjectHome', {
        classId, className,
        subjectId, subjectName,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerSub}>{subjectName}</Text>
        <Text style={styles.headerTitle}>Select Class</Text>
      </View>

      <FlatList
        data={CLASSES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => goToSubjectContent(item.id, item.name)}
          >
            <Text style={styles.cardText}>{item.name}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  header: { backgroundColor: COLORS.primary, padding: 20, paddingBottom: 24 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 4 },
  card: {
    backgroundColor: COLORS.paperDark,
    padding: 18, borderRadius: 12, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    elevation: 2, borderLeftWidth: 4, borderLeftColor: COLORS.primary,
  },
  cardText: { fontSize: 17, fontWeight: '700', color: COLORS.ink },
  arrow: { fontSize: 22, color: COLORS.primary, fontWeight: '700' },
});