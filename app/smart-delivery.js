import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const STEPS = ['Verifikasi Farmasis', 'Packing', 'Kurir Mengambil', 'Dalam Perjalanan', 'Terkirim'];

export default function SmartDeliveryScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      let data = await getData(KEYS.ORDERS);
      if (!data || data.length === 0) {
        data = [
          { id: 'd1', items: [{ name: 'Paracetamol 500mg', qty: 2, price: 5500 }], total: 11000, date: new Date().toISOString(), step: 0, pharmacist: 'Apt. Dewi S., S.Farm' },
          { id: 'd2', items: [{ name: 'Amoxicillin 500mg', qty: 1, price: 8200 }], total: 8200, date: new Date().toISOString(), step: 3, pharmacist: 'Apt. Rina K., S.Farm' },
        ];
        await setData(KEYS.ORDERS, data);
      }
      setOrders(data.map(o => ({ ...o, step: o.step ?? 0 })));
    })();
  }, []));

  const advanceStep = async (id) => {
    const updated = orders.map(o => {
      if (o.id === id && (o.step ?? 0) < STEPS.length - 1) return { ...o, step: (o.step ?? 0) + 1 };
      return o;
    });
    setOrders(updated);
    await setData(KEYS.ORDERS, updated);
    const order = updated.find(o => o.id === id);
    Alert.alert('Status Updated', `Pesanan ${id} → ${STEPS[order.step]}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Smart Delivery</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={orders}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => {
          const step = item.step ?? 0;
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.orderId}>#{item.id}</Text>
                <Text style={styles.pharmacist}>{item.pharmacist || '-'}</Text>
              </View>
              {item.items?.map((it, idx) => (
                <Text key={idx} style={styles.itemText}>{it.name} x{it.qty}</Text>
              ))}
              <View style={styles.tracker}>
                {STEPS.map((s, i) => (
                  <View key={i} style={styles.stepRow}>
                    <View style={[styles.dot, i <= step && styles.dotActive]} />
                    {i < STEPS.length - 1 && <View style={[styles.line, i < step && styles.lineActive]} />}
                    <Text style={[styles.stepLabel, i <= step && { color: COLORS.primary, fontWeight: '700' }]}>{s}</Text>
                  </View>
                ))}
              </View>
              {step < STEPS.length - 1 ? (
                <TouchableOpacity onPress={() => advanceStep(item.id)}>
                  <LinearGradient colors={COLORS.gradient.primary} style={styles.advBtn}>
                    <Text style={styles.advText}>Lanjut ke: {STEPS[step + 1]}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.doneBadge}><Text style={styles.doneText}>Terkirim</Text></View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  orderId: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  pharmacist: { fontSize: 11, color: COLORS.textSecondary },
  itemText: { fontSize: 14, color: COLORS.text, marginBottom: 2 },
  tracker: { marginTop: SPACING.md, marginBottom: SPACING.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.border, marginRight: SPACING.sm },
  dotActive: { backgroundColor: COLORS.primary },
  line: { position: 'absolute', left: 5, top: 12, width: 2, height: 18, backgroundColor: COLORS.border },
  lineActive: { backgroundColor: COLORS.primary },
  stepLabel: { fontSize: 13, color: COLORS.textLight },
  advBtn: { borderRadius: RADIUS.lg, padding: SPACING.sm + 2, alignItems: 'center', marginTop: SPACING.xs },
  advText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  doneBadge: { backgroundColor: COLORS.successLight, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center', marginTop: SPACING.xs },
  doneText: { color: COLORS.success, fontWeight: '700' },
});
