import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, Animated, Pressable, Alert
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { COLORS } from '../theme/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

const MENU_ITEMS = [
  { id: 'home', emoji: '🏠', label: 'Home', screen: 'Home' },
  { id: 'profile', emoji: '👤', label: 'My Profile', screen: 'Profile' },
  { id: 'school', emoji: '🏫', label: 'School Classes', screen: 'SchoolClasses' },
  { id: 'competitive', emoji: '🎯', label: 'Competitive Exams', screen: 'CompetitiveSubjects' },
];

export default function MenuModal({ visible, onClose, navigation }: Props) {
  const handleNavigate = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    onClose();
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menu}>
          {/* Header */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {auth.currentUser?.displayName?.charAt(0).toUpperCase() ?? '?'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{auth.currentUser?.displayName ?? 'User'}</Text>
              <Text style={styles.userEmail}>{auth.currentUser?.email ?? ''}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Menu Items */}
          {MENU_ITEMS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleNavigate(item.screen)}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />

          {/* Coming Soon */}
          <TouchableOpacity style={[styles.menuItem, styles.disabledItem]}>
            <Text style={styles.menuEmoji}>⚙️</Text>
            <Text style={[styles.menuLabel, { color: COLORS.inkSoft }]}>Settings</Text>
            <View style={styles.soonBadge}>
              <Text style={styles.soonText}>Soon</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.disabledItem]}>
            <Text style={styles.menuEmoji}>🔔</Text>
            <Text style={[styles.menuLabel, { color: COLORS.inkSoft }]}>Notifications</Text>
            <View style={styles.soonBadge}>
              <Text style={styles.soonText}>Soon</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Logout */}
          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <Text style={styles.menuEmoji}>🚪</Text>
            <Text style={styles.logoutLabel}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  menu: {
    backgroundColor: COLORS.paper,
    width: '78%',
    minHeight: '100%',
    paddingTop: 50,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.ink,
  },
  closeBtn: { padding: 4 },
  closeText: { fontSize: 18, color: COLORS.inkSoft },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  userName: { fontSize: 15, fontWeight: '700', color: COLORS.ink },
  userEmail: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.rule, marginVertical: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  disabledItem: { opacity: 0.6 },
  menuEmoji: { fontSize: 20, width: 28 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.ink },
  menuArrow: { fontSize: 18, color: COLORS.primary, fontWeight: '700' },
  soonBadge: {
    backgroundColor: COLORS.rule,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  soonText: { fontSize: 10, color: COLORS.inkSoft, fontWeight: '600' },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  logoutLabel: { fontSize: 15, fontWeight: '600', color: '#E53935' },
});