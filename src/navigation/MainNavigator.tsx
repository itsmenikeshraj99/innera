import React, { useState, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import { RootStackParamList } from './types';
import { COLORS } from '../theme/colors';
import { auth } from '../firebase/firebase';
import MenuModal from '../components/MenuModal';
import TabNavigator from './TabNavigator';

// All screens
import SchoolClassSelectionScreen from '../screens/SchoolClassSelectionScreen';
import SchoolSubjectsScreen from '../screens/SchoolSubjectsScreen';
import SubjectHomeScreen from '../screens/SubjectHomeScreen';
import SubjectSyllabusScreen from '../screens/SubjectSyllabusScreen';
import TopicListScreen from '../screens/TopicListScreen';
import TopicDetailScreen from '../screens/TopicDetailScreen';
import CompetitiveSubjectsScreen from '../screens/CompetitiveSubjectsScreen';
import CompetitiveExamsScreen from '../screens/CompetitiveExamsScreen';
import ScienceSubjectsScreen from '../screens/ScienceSubjectsScreen';
import ScienceChaptersScreen from '../screens/ScienceChaptersScreen';
import SocialScienceSubjectsScreen from '../screens/SocialScienceSubjectsScreen';
import SocialScienceChaptersScreen from '../screens/SocialScienceChaptersScreen';
import EnglishSubjectsScreen from '../screens/EnglishSubjectsScreen';
import EnglishChaptersScreen from '../screens/EnglishChaptersScreen';
import HindiSubjectsScreen from '../screens/HindiSubjectsScreen';
import HindiChaptersScreen from '../screens/HindiChaptersScreen';
import SanskritSubjectsScreen from '../screens/SanskritSubjectsScreen';
import SanskritChaptersScreen from '../screens/SanskritChaptersScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PaymentScreen from '../screens/PaymentScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainNavigator() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigationRef = useRef<any>(null);

  const HamburgerMenu = ({ navigation }: { navigation: any }) => (
    <TouchableOpacity
      onPress={() => {
        navigationRef.current = navigation;
        setMenuVisible(true);
      }}
      style={{ padding: 6 }}
    >
      <View style={{ gap: 5 }}>
        <View style={{ width: 22, height: 2.5, backgroundColor: '#fff', borderRadius: 2 }} />
        <View style={{ width: 22, height: 2.5, backgroundColor: '#fff', borderRadius: 2 }} />
        <View style={{ width: 22, height: 2.5, backgroundColor: '#fff', borderRadius: 2 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          headerLeft: ({ canGoBack }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <HamburgerMenu navigation={navigation} />
              {canGoBack && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                  <Text style={{ color: '#fff', fontSize: 22, fontWeight: '600', marginTop: -2 }}>‹</Text>
                </TouchableOpacity>
              )}
              <Image
                source={require('../assets/images/icon.png')}
                style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' }}
                resizeMode="contain"
              />
            </View>
          ),
          headerRight: ({ canGoBack }) =>
            canGoBack ? (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                <Text style={{ color: '#fff', fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            ) : null,
        })}
      >
        {/* Tab Navigator as main screen */}
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        {/* All other screens */}
        <Stack.Screen name="SchoolClassSelection" component={SchoolClassSelectionScreen} options={({ route }) => ({ title: route.params.subjectName })} />
        <Stack.Screen name="SchoolSubjects" component={SchoolSubjectsScreen} options={{ title: 'School' }} />
        <Stack.Screen name="SubjectHome" component={SubjectHomeScreen} options={({ route }) => ({ title: route.params.subjectName })} />
        <Stack.Screen name="SubjectSyllabus" component={SubjectSyllabusScreen} options={{ title: 'Syllabus' }} />
        <Stack.Screen name="TopicList" component={TopicListScreen} options={({ route }) => ({ title: route.params.chapterTitle })} />
        <Stack.Screen name="TopicDetail" component={TopicDetailScreen} options={({ route }) => ({ title: route.params.topicTitle })} />
        <Stack.Screen name="CompetitiveSubjects" component={CompetitiveSubjectsScreen} options={{ title: 'Competitive Exams' }} />
        <Stack.Screen name="CompetitiveExams" component={CompetitiveExamsScreen} options={({ route }) => ({ title: route.params.categoryName })} />
        <Stack.Screen name="ScienceSubjects" component={ScienceSubjectsScreen} options={{ title: 'Science' }} />
        <Stack.Screen name="ScienceChapters" component={ScienceChaptersScreen} options={({ route }) => ({ title: route.params.branchName })} />
        <Stack.Screen name="SocialScienceSubjects" component={SocialScienceSubjectsScreen} options={{ title: 'Social Science' }} />
        <Stack.Screen name="SocialScienceChapters" component={SocialScienceChaptersScreen} options={({ route }) => ({ title: route.params.subjectName })} />
        <Stack.Screen name="EnglishSubjects" component={EnglishSubjectsScreen} options={{ title: 'English' }} />
        <Stack.Screen name="EnglishChapters" component={EnglishChaptersScreen} options={({ route }) => ({ title: route.params.bookName })} />
        <Stack.Screen name="HindiSubjects" component={HindiSubjectsScreen} options={{ title: 'Hindi' }} />
        <Stack.Screen name="HindiChapters" component={HindiChaptersScreen} options={({ route }) => ({ title: route.params.bookName })} />
        <Stack.Screen name="SanskritSubjects" component={SanskritSubjectsScreen} options={{ title: 'Sanskrit' }} />
        <Stack.Screen name="SanskritChapters" component={SanskritChaptersScreen} options={({ route }) => ({ title: route.params.bookName })} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
        <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Premium' }} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ title: 'Subscription' }} />
      </Stack.Navigator>

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigationRef.current}
      />
    </>
  );
}