import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
  ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { COLORS } from '../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (error: any) {
      let msg = 'Failed to send reset email.';
      if (error.code === 'auth/user-not-found') msg = 'No account found with this email.';
      if (error.code === 'auth/invalid-email') msg = 'Invalid email address.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paper} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.logoSection}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <View style={styles.form}>
          {!sent ? (
            <>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your email and we'll send you a reset link.
              </Text>

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.inkSoft}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleReset}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.resetBtnText}>Send Reset Link</Text>
                }
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successBox}>
              <Text style={styles.successEmoji}>📧</Text>
              <Text style={styles.successTitle}>Email Sent!</Text>
              <Text style={styles.successText}>
                Check your inbox and follow the link to reset your password.
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  inner: { flex: 1, justifyContent: 'center', padding: 24 },
  logoSection: { alignItems: 'center', marginBottom: 28 },
  icon: { width: 80, height: 80, borderRadius: 40 },
  form: {
    backgroundColor: COLORS.paperDark,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.rule,
  },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.ink, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.inkSoft, marginBottom: 20, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.ink, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.paper,
    borderWidth: 1,
    borderColor: COLORS.rule,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: COLORS.ink,
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  resetBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backBtn: { alignItems: 'center' },
  backText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  successBox: { alignItems: 'center', paddingVertical: 20, gap: 10 },
  successEmoji: { fontSize: 48 },
  successTitle: { fontSize: 20, fontWeight: '800', color: COLORS.ink },
  successText: { fontSize: 14, color: COLORS.inkSoft, textAlign: 'center', lineHeight: 20 },
});