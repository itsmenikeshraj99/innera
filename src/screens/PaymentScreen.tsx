import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView, Alert, Modal
} from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme/colors';
import { db, auth } from '../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

const RAZORPAY_KEY = 'rzp_test_T9kccAOnsiS0nC';

export const PLANS: Record<string, {
  name: string;
  monthly: number;
  oneTime: number;
  original: number;
}> = {
  'class6-8': { name: 'Class 6–8', monthly: 149, oneTime: 1199, original: 1799 },
  'class9-10': { name: 'Class 9–10', monthly: 249, oneTime: 1999, original: 2999 },
  'class11-12': { name: 'Class 11–12', monthly: 449, oneTime: 4499, original: 5500 },
  'jee': { name: 'JEE', monthly: 999, oneTime: 9999, original: 11999 },
  'bank': { name: 'Bank Exams', monthly: 999, oneTime: 9999, original: 11999 },
  'ssc': { name: 'SSC Exams', monthly: 799, oneTime: 8000, original: 9600 },
  'railway': { name: 'Railway Exams', monthly: 399, oneTime: 3999, original: 4800 },
  'defence': { name: 'Defence Exams', monthly: 999, oneTime: 9999, original: 11999 },
  'ugc': { name: 'UGC NET', monthly: 999, oneTime: 5000, original: 6000 },
};

export default function PaymentScreen({ route, navigation }: Props) {
  const { planId } = route.params;
  const plan = PLANS[planId];
  const [selected, setSelected] = useState<'monthly' | 'onetime'>('onetime');
  const [showWebView, setShowWebView] = useState(false);

  if (!plan) {
    return (
      <View style={styles.center}>
        <Text>Plan not found</Text>
      </View>
    );
  }

  const discount = Math.round(((plan.original - plan.oneTime) / plan.original) * 100);
  const amount = selected === 'monthly' ? plan.monthly : plan.oneTime;
  const user = auth.currentUser;

  // Razorpay HTML
  const razorpayHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body>
  <script>
    var options = {
      key: '${RAZORPAY_KEY}',
      amount: ${amount * 100},
      currency: 'INR',
      name: 'Innera',
      description: '${plan.name} — ${selected === 'monthly' ? 'Monthly Plan' : '1 Year Access'}',
      image: '',
      prefill: {
        name: '${user?.displayName ?? ''}',
        email: '${user?.email ?? ''}',
      },
      theme: {
        color: '${COLORS.primary}'
      },
      handler: function(response) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        }));
      },
      modal: {
        ondismiss: function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            success: false,
            cancelled: true,
          }));
        }
      }
    };
    var rzp = new Razorpay(options);
    rzp.open();
    rzp.on('payment.failed', function(response) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        success: false,
        error: response.error.description,
      }));
    });
  </script>
</body>
</html>
  `;

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setShowWebView(false);

      if (data.success) {
        // Payment success — Firestore me update karo
        const user = auth.currentUser;
        if (user) {
          await updateDoc(doc(db, 'users', user.uid), {
            isPaid: true,
            plan: selected,
            planId: planId,
            paymentId: data.paymentId,
            planActivatedAt: new Date().toISOString(),
            planExpiresAt: selected === 'monthly'
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }

        Alert.alert(
          '🎉 Payment Successful!',
          `Welcome to Premium!\nPayment ID: ${data.paymentId}`,
          [{ text: 'Start Learning', onPress: () => navigation.navigate('Home') }]
        );
      } else if (data.cancelled) {
        Alert.alert('Payment Cancelled', 'Aapne payment cancel ki.');
      } else {
        Alert.alert('Payment Failed', data.error ?? 'Kuch gadbad ho gayi. Dobara try karein.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>Premium Access</Text>
        <Text style={styles.headerTitle}>{plan.name}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>✨ Premium Benefits.</Text>
          {[
            '📚 Complete syllabus access.',
            '🎯 All chapters unlock.',
            '📖 Hindi + English Both.',
            '🔄 1 year validity.',
            '📱 On any device.',
            '⭐ Priority support',
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Plan Selection */}
        <Text style={styles.sectionTitle}>Plan chunein:</Text>

        {/* One Time Plan */}
        <TouchableOpacity
          style={[styles.planCard, selected === 'onetime' && styles.planCardActive]}
          onPress={() => setSelected('onetime')}
        >
          <View style={styles.planTop}>
            <View style={styles.radioOuter}>
              {selected === 'onetime' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>1 Year Access</Text>
              <Text style={styles.planDesc}>Pay once, get 1 year of access.</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          </View>
          <View style={styles.planPriceRow}>
            <Text style={styles.planPrice}>₹{plan.oneTime}</Text>
            <Text style={styles.planOriginal}>₹{plan.original}</Text>
            <Text style={styles.planSaving}>Save ₹{plan.original - plan.oneTime}</Text>
          </View>
        </TouchableOpacity>

        {/* Monthly Plan */}
        <TouchableOpacity
          style={[styles.planCard, selected === 'monthly' && styles.planCardActive]}
          onPress={() => setSelected('monthly')}
        >
          <View style={styles.planTop}>
            <View style={styles.radioOuter}>
              {selected === 'monthly' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Monthly Plan</Text>
              <Text style={styles.planDesc}>Renews every month.</Text>
            </View>
          </View>
          <View style={styles.planPriceRow}>
            <Text style={styles.planPrice}>₹{plan.monthly}</Text>
            <Text style={styles.perMonth}>/month</Text>
          </View>
        </TouchableOpacity>

        {/* Pay Button */}
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => setShowWebView(true)}
        >
          <Text style={styles.payBtnText}>
            🔒 Pay ₹{amount}{selected === 'monthly' ? '/mo' : ' — 1 Year Access'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.secureText}>🔐 100% Secure Payment via Razorpay</Text>
        <Text style={styles.refundText}>✅ 7-day refund policy</Text>

      </ScrollView>

      {/* Razorpay WebView Modal */}
      <Modal visible={showWebView} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity onPress={() => setShowWebView(false)}>
              <Text style={styles.webViewClose}>✕ Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.webViewTitle}>Secure Payment</Text>
          </View>
          <WebView
            source={{ html: razorpayHTML }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
          />
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.paper },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: COLORS.primary,
    padding: 24,
    paddingBottom: 28,
  },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 4 },
  featuresCard: {
    backgroundColor: COLORS.paperDark,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.rule,
    gap: 10,
  },
  featuresTitle: { fontSize: 15, fontWeight: '700', color: COLORS.ink, marginBottom: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'center' },
  featureText: { fontSize: 14, color: COLORS.ink },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.ink, marginBottom: 12 },
  planCard: {
    backgroundColor: COLORS.paperDark,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.rule,
  },
  planCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
  },
  planTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  planInfo: { flex: 1 },
  planName: { fontSize: 15, fontWeight: '700', color: COLORS.ink },
  planDesc: { fontSize: 12, color: COLORS.inkSoft, marginTop: 2 },
  discountBadge: {
    backgroundColor: '#E53935',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
  },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 34 },
  planPrice: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  planOriginal: { fontSize: 14, color: COLORS.inkSoft, textDecorationLine: 'line-through' },
  planSaving: { fontSize: 12, color: '#2F6B3F', fontWeight: '600' },
  perMonth: { fontSize: 14, color: COLORS.inkSoft },
  payBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14, padding: 16,
    alignItems: 'center', marginTop: 8,
    marginBottom: 12, elevation: 3,
  },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  secureText: { textAlign: 'center', fontSize: 13, color: COLORS.inkSoft, marginBottom: 4 },
  refundText: { textAlign: 'center', fontSize: 13, color: COLORS.inkSoft, marginBottom: 20 },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primary,
    gap: 16,
  },
  webViewClose: { color: '#fff', fontSize: 14, fontWeight: '600' },
  webViewTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
});