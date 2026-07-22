import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, ScrollView, Animated, Pressable, } from 'react-native';
import ReanimatedAnimated, { useSharedValue, useAnimatedStyle, useAnimatedProps,
  withSpring, withTiming, withRepeat, } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { doc, getDoc } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';
import { auth, db } from '../firebase/firebase';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const AnimatedCircle = ReanimatedAnimated.createAnimatedComponent(Circle);

const QUOTES = [
  "Confidence before marks. 🌿",
  "Ek topic aaj, ek sapna kal. ✨",
  "Padhai karo, khud pe bharosa rakho. 💪",
  "Consistency is the key. 🔑",
  "Aaj ka effort, kal ka result. 🎯",
  "Knowledge is your superpower. ⚡",
];

const QUOTES_Images = [
  require('../assets/images/banner-dark.png'),
  require('../assets/images/banner-quote.png'),
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

// ---------- Circular Progress Ring ----------
function CircularProgress({
  progress, size = 68, strokeWidth = 7,
  color = COLORS.primary, trackColor = COLORS.rule,
}: { progress: number; size?: number; strokeWidth?: number; color?: string; trackColor?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 900 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={trackColor} strokeWidth={strokeWidth} fill="none"
      />
      <AnimatedCircle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        animatedProps={animatedProps}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}

// ---------- Pulsing Streak Flame ----------
function StreakFlame() {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.15, { duration: 700 }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <ReanimatedAnimated.Text style={[{ fontSize: 30 }, style]}>🔥</ReanimatedAnimated.Text>;
}

// ---------- Press-scale wrapper with haptics ----------
function PressableCard({
  style, onPress, children,
}: { style?: any; onPress: () => void; children: React.ReactNode }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <ReanimatedAnimated.View style={animatedStyle}>
      <Pressable
        style={style}
        onPressIn={() => { scale.value = withSpring(0.96); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
      >
        {children}
      </Pressable>
    </ReanimatedAnimated.View>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const user = auth.currentUser;
  const firstName = user?.displayName?.split(' ')[0] ?? 'Student';
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const pillOpacity = useRef(new Animated.Value(1)).current;
  const pillTranslate = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  const [progress, setProgress] = useState({ streak: 0, dailyGoal: 2, completedToday: 0 });

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'meta', 'progress'));
        if (snap.exists()) {
          const data = snap.data();
          setProgress({
            streak: data.streak ?? 0,
            dailyGoal: data.dailyGoal ?? 2,
            completedToday: data.completedToday ?? 0,
          });
        }
      } catch (e) {
        console.log('progress fetch error', e);
      }
    };
    fetchProgress();
  }, [user]);

  const goalProgress = Math.min(progress.completedToday / Math.max(progress.dailyGoal, 1), 1);

  const flipRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const flipOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 1],
  });

  const rotateQuote = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pillOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(pillTranslate, { toValue: -10, duration: 300, useNativeDriver: true }),
      ]),
      Animated.timing(pillTranslate, { toValue: 10, duration: 0, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(pillOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(pillTranslate, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
    setQuoteIndex(prev => (prev + 1) % QUOTES.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      flipAnim.setValue(0);
      Animated.timing(flipAnim, { toValue: 1, duration: 800, useNativeDriver: false }).start();
      setImageIndex(prev => (prev + 1) % QUOTES_Images.length);
      rotateQuote();
    }, 4000);
    return () => clearInterval(interval);
  }, [flipAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{firstName} 👋</Text>
          </View>
        </View>

        {/* Banner Quote */}
        <Animated.View style={[styles.quoteCard, { transform: [{ perspective: 1000 }, { rotateY: flipRotation }], opacity: flipOpacity }]}>
          <Image source={QUOTES_Images[imageIndex]} style={styles.bannerImage} resizeMode="contain" />
        </Animated.View>

        {/* Rotating Quote */}
        <Animated.View style={[styles.rotatingPill, { opacity: pillOpacity, transform: [{ translateY: pillTranslate }] }]}>
          <Text style={[styles.quoteText, styles.rotatingPillText]}>{QUOTES[quoteIndex]}</Text>
        </Animated.View>

        {/* Streak + Daily Goal Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <StreakFlame />
            <Text style={styles.statNumber}>{progress.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <CircularProgress progress={goalProgress} />
            <Text style={styles.statLabel}>{progress.completedToday}/{progress.dailyGoal} Today</Text>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>📖 Start Learning Today.</Text>

        {/* School Card */}
        <PressableCard
          style={[styles.card, { backgroundColor: COLORS.primary }]}
          onPress={() => navigation.navigate('SchoolSubjects')}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardEmoji}>🏫</Text>
            <View style={[styles.badge, { backgroundColor: COLORS.primaryDark }]}>
              <Text style={styles.badgeText}>Class 6–12</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>School</Text>
          <Text style={styles.cardSub}>NCERT · CBSE Syllabus · Science · Maths</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>Mathematics · Science · English · Hindi</Text>
          </View>
        </PressableCard>

        {/* Competitive Card */}
        <PressableCard
          style={[styles.card, { backgroundColor: COLORS.ink }]}
          onPress={() => navigation.navigate('CompetitiveSubjects')}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardEmoji}>🎯</Text>
            <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Text style={styles.badgeText}>JEE · SSC · Defence</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>Competitive</Text>
          <Text style={styles.cardSub}>Bank · Railway · NDA · Agniveer</Text>
          <View style={[styles.cardFooter, { borderTopColor: 'rgba(255,255,255,0.1)' }]}>
            <Text style={styles.cardFooterText}>JEE · NEET · SSC · Railway · Defence</Text>
          </View>
        </PressableCard>

        {/* Coming Soon Features */}
        <Text style={styles.sectionTitle}>🚀 Coming Soon</Text>
        <View style={styles.comingRow}>
          {[
            { emoji: '⚡', label: 'Quiz' },
            { emoji: '🏆', label: 'Rank' },
          ].map(item => (
            <View key={item.label} style={styles.comingItem}>
              <Text style={styles.comingEmoji}>{item.emoji}</Text>
              <Text style={styles.comingLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Logo */}
        <View style={styles.logoSection}>
          <Image source={require('../assets/images/icon.png')} style={styles.circleIcon} resizeMode="contain" />
          <Image source={require('../assets/images/wordmark.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.footer}>NCERT / CBSE based content · Innera</Text>
        <Text style={styles.footer}>©️ 2026 Innera Education Pvt. Ltd. All rights reserved.
          Designed & Developed by Innera. Protected by copyright laws.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: { fontSize: 13, color: COLORS.inkSoft },
  userName: { fontSize: 20, fontWeight: '800', color: COLORS.ink },
  logoSection: { alignItems: 'center', paddingVertical: 16 },
  circleIcon: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  logo: { width: 140, height: 44 },
  quoteCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  bannerImage: { width: '100%', height: 300 },
  quoteText: { fontSize: 14, color: COLORS.primaryDark, fontWeight: '600', fontStyle: 'italic', textAlign: 'center' },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.paperDark,
    borderRadius: 14,
    paddingVertical: 18,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.rule,
    elevation: 1,
    gap: 6,
  },
  statNumber: { fontSize: 20, fontWeight: '800', color: COLORS.ink },
  statLabel: { fontSize: 11, fontWeight: '600', color: COLORS.inkSoft },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.ink, paddingHorizontal: 20, marginTop: 4, marginBottom: 10 },
  card: { borderRadius: 16, padding: 20, marginHorizontal: 20, marginBottom: 14, elevation: 3 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  cardEmoji: { fontSize: 30 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  cardSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 12 },
  cardFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 10 },
  cardFooterText: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  comingRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 24, gap: 10 },
  comingItem: {
    flex: 1,
    backgroundColor: COLORS.paperDark,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.rule,
    elevation: 1,
  },
  comingEmoji: { fontSize: 24 },
  comingLabel: { fontSize: 11, fontWeight: '600', color: COLORS.inkSoft },
  footer: { textAlign: 'center', marginBottom: 24, fontSize: 11, color: COLORS.rule, letterSpacing: 0.3 },
  rotatingPill: {
    backgroundColor: '#1B8A4D15',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#1B8A4D30',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  rotatingPillText: { color: '#1B8A4D', fontSize: 13, fontWeight: '600', textAlign: 'center' },
});