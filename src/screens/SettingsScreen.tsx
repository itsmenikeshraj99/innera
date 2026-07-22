import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Alert, Switch
} from 'react-native';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase/firebase';
import { COLORS } from '../theme/colors';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const user = auth.currentUser;
  const [notifications, setNotifications] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => await signOut(auth),
        },
      ]
    );
  };

  const SECTIONS = [
    {
      title: 'Account',
      items: [
        {
          emoji: '👤',
          label: 'My Profile',
          sub: user?.displayName ?? 'View profile',
          onPress: () => navigation.navigate('Profile'),
          type: 'nav',
        },
        {
          emoji: '⭐',
          label: 'Subscription',
          sub: 'Free Plan — Upgrade Now',
          onPress: () => navigation.navigate('Subscription'),
          type: 'nav',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          emoji: '🔔',
          label: 'Notifications',
          sub: 'Daily reminders',
          type: 'switch',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          emoji: '🌙',
          label: 'Dark Mode',
          sub: 'Coming Soon',
          type: 'coming',
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          emoji: 'ℹ️',
          label: 'About Innera',
          sub: 'Version 1.0.0',
          onPress: () => Alert.alert('Innera', 'Confidence before marks.\n\nVersion 1.0.0\n\nBuilt with Heart ❤️ for Indian students.'),
          type: 'nav',
        },
        {
          emoji: '📞',
          label: 'Contact Support',
          sub: 'Help & feedback',
          onPress: () => Alert.alert('Support', 'Email: innera.officials@gmail.com\nWhatsapp: +91 7281083293'),
          type: 'nav',
        },
        {
          emoji: '⭐',
          label: 'Rate the App',
          sub: 'Please review on Play Store',
          onPress: () => Alert.alert('Rate Us', 'Play Store link coming soon!'),
          type: 'nav',
        },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        {
          emoji: '🚪',
          label: 'Logout',
          sub: user?.email ?? '',
          onPress: handleLogout,
          type: 'danger',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />

      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* User Card */}
        <TouchableOpacity
          style={styles.userCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() ?? '?'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.displayName ?? 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          </View>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item: any, index) => (
                <View key={item.label}>
                  {index > 0 && <View style={styles.divider} />}
                  <TouchableOpacity
                    style={styles.settingRow}
                    onPress={item.onPress}
                    disabled={item.type === 'switch' || item.type === 'coming'}
                    activeOpacity={item.type === 'danger' ? 0.6 : 0.8}
                  >
                    <Text style={styles.settingEmoji}>{item.emoji}</Text>
                    <View style={styles.settingText}>
                      <Text style={[
                        styles.settingLabel,
                        item.type === 'danger' && styles.dangerText
                      ]}>
                        {item.label}
                      </Text>
                      {item.sub ? (
                        <Text style={styles.settingSub}>{item.sub}</Text>
                      ) : null}
                    </View>
                    {item.type === 'switch' && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: COLORS.rule, true: COLORS.primary }}
                        thumbColor="#fff"
                      />
                    )}
                    {item.type === 'coming' && (
                      <View style={styles.soonBadge}>
                        <Text style={styles.soonText}>Soon</Text>
                      </View>
                    )}
                    {item.type === 'nav' && (
                      <Text style={styles.navArrow}>›</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.footer}>Innera v1.0.0 • Made for Indian Students 🇮🇳</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  header: { padding: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.ink },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    elevation: 2,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  userInfo: { flex: 1 },
  userName: { color: '#fff', fontSize: 17, fontWeight: '700' },
  userEmail: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
  section: { marginBottom: 8 },
  sectionTitle: {
    fontSize: 12, fontWeight: '700',
    color: COLORS.inkSoft, letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 20, paddingBottom: 8, paddingTop: 4,
  },
  sectionCard: {
    backgroundColor: COLORS.paperDark,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.rule,
    overflow: 'hidden',
  },
  divider: { height: 1, backgroundColor: COLORS.rule, marginLeft: 56 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  settingEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  settingText: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600', color: COLORS.ink },
  settingSub: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  dangerText: { color: '#E53935' },
  navArrow: { fontSize: 20, color: COLORS.inkSoft },
  soonBadge: {
    backgroundColor: COLORS.rule,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10,
  },
  soonText: { fontSize: 10, color: COLORS.inkSoft, fontWeight: '600' },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.rule,
    padding: 20,
    paddingTop: 8,
  },
});