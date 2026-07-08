import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, KEYS } from '../utils/storage';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const data = await getData(KEYS.ORDERS);
    setOrders(data || []);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={64} color={COLORS.textLight} />
          <Text style={[FONTS.medium, { color: COLORS.textSecondary, marginTop: SPACING.sm }]}>Belum ada pesanan</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: SPACING.lg }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardDate}>{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Dalam Perjalanan</Text>
                </View>
              </View>
              {item.items.map((it, idx) => (
                <Text key={idx} style={styles.itemText}>{it.name} x{it.qty}</Text>
              ))}
              <View style={styles.divider} />
              <View style={styles.footer}>
                <Text style={styles.totalLabel}>Total Belanja</Text>
                <Text style={styles.totalVal}>Rp{item.total.toLocaleString('id-ID')}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerGrad: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  cardDate: { fontSize: 12, color: COLORS.textLight, fontWeight: '600' },
  statusBadge: { backgroundColor: COLORS.accentLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  statusText: { color: COLORS.accent, fontSize: 11, fontWeight: '700' },
  itemText: { fontSize: 14, color: COLORS.text, marginBottom: 2, fontWeight: '500' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 12, color: COLORS.textSecondary },
  totalVal: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
});