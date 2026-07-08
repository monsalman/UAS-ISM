import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';

export default function RewardsScreen() {
  const router = useRouter();

  const vouchers = [
    { title: 'Potongan Rp15.000', desc: 'Min. transaksi Rp100.000', points: 150 },
    { title: 'Gratis Ongkir s/d Rp20.000', desc: 'Tanpa min. transaksi', points: 100 },
    { title: 'Diskon 10% Produk OTC', desc: 'Maks. potongan Rp50.000', points: 200 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KF Rewards</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsLabel}>Poin Anda</Text>
            <Text style={styles.pointsVal}>1,250</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="ribbon" size={16} color={COLORS.white} />
            <Text style={styles.badgeText}>Gold Member</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
        <Text style={styles.sectionTitle}>Tukar Voucher</Text>
        {vouchers.map((v, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.cardTitle}>{v.title}</Text>
              <Text style={styles.cardDesc}>{v.desc}</Text>
            </View>
            <TouchableOpacity style={styles.redeemBtn}>
              <Text style={styles.redeemText}>{v.points} Poin</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGrad: { paddingBottom: SPACING.xl, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  pointsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: SPACING.lg, marginTop: SPACING.md, borderRadius: RADIUS.xl, padding: SPACING.md },
  pointsLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  pointsVal: { color: COLORS.white, fontSize: 32, fontWeight: '800', marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full },
  badgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700', marginLeft: 4 },
  sectionTitle: { ...FONTS.h3, marginBottom: SPACING.sm },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  cardLeft: { flex: 1, marginRight: SPACING.sm },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  redeemBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.md, ...SHADOWS.sm },
  redeemText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
});