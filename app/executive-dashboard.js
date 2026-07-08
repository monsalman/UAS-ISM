import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';

const METRICS = [
  { label: 'Total Transaksi', value: 'Rp 2.4M', change: '+12%', icon: 'cash', color: COLORS.primary },
  { label: 'Resep Diproses', value: '1,247', change: '+8%', icon: 'document-text', color: COLORS.success },
  { label: 'Pasien Aktif', value: '3,891', change: '+15%', icon: 'people', color: COLORS.accent },
  { label: 'Stok Kritis', value: '23', change: '-5%', icon: 'alert-circle', color: COLORS.danger },
];

const TOP_MEDICINES = [
  { name: 'Paracetamol 500mg', sold: 1250, revenue: 'Rp 6.8M' },
  { name: 'Amoxicillin 500mg', sold: 890, revenue: 'Rp 7.3M' },
  { name: 'Vitamin C 1000mg', sold: 780, revenue: 'Rp 11.7M' },
  { name: 'Omeprazole 20mg', sold: 650, revenue: 'Rp 7.8M' },
  { name: 'Cetirizine 10mg', sold: 520, revenue: 'Rp 3.4M' },
];

const BRANCHES = [
  { name: 'KF Juanda', revenue: 'Rp 850jt', growth: '+18%' },
  { name: 'KF Matraman', revenue: 'Rp 720jt', growth: '+12%' },
  { name: 'KF Kebayoran', revenue: 'Rp 680jt', growth: '+9%' },
  { name: 'KF Dago', revenue: 'Rp 550jt', growth: '+22%' },
];

export default function ExecutiveDashboardScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Executive Dashboard</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.headerSub}>Periode: Juli 2026</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          {METRICS.map((m, i) => (
            <View key={i} style={styles.kpiCard}>
              <View style={[styles.kpiIcon, { backgroundColor: m.color + '20' }]}>
                <Ionicons name={m.icon} size={20} color={m.color} />
              </View>
              <Text style={styles.kpiVal}>{m.value}</Text>
              <Text style={styles.kpiLabel}>{m.label}</Text>
              <Text style={[styles.kpiChange, { color: m.change.startsWith('+') ? COLORS.success : COLORS.danger }]}>{m.change}</Text>
            </View>
          ))}
        </View>

        {/* Top Medicines */}
        <Text style={styles.sectionTitle}>Top 5 Obat Terlaris</Text>
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCol, { flex: 2 }]}>Obat</Text>
            <Text style={styles.tableCol}>Terjual</Text>
            <Text style={styles.tableCol}>Revenue</Text>
          </View>
          {TOP_MEDICINES.map((m, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 0 && { backgroundColor: COLORS.background }]}>
              <Text style={[styles.tableCell, { flex: 2, fontWeight: '600' }]}>{m.name}</Text>
              <Text style={styles.tableCell}>{m.sold}</Text>
              <Text style={[styles.tableCell, { color: COLORS.primary, fontWeight: '700' }]}>{m.revenue}</Text>
            </View>
          ))}
        </View>

        {/* Branch Performance */}
        <Text style={styles.sectionTitle}>Performa Cabang</Text>
        {BRANCHES.map((b, i) => (
          <View key={i} style={styles.branchCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.branchName}>{b.name}</Text>
              <Text style={styles.branchRev}>{b.revenue}</Text>
            </View>
            <View style={[styles.growthBadge, { backgroundColor: COLORS.successLight }]}>
              <Text style={[styles.growthText, { color: COLORS.success }]}>{b.growth}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center', marginTop: 4 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  kpiCard: { width: '48%', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOWS.md },
  kpiIcon: { width: 36, height: 36, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  kpiVal: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  kpiLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  kpiChange: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  sectionTitle: { ...FONTS.h3, marginBottom: SPACING.sm, marginTop: SPACING.sm },
  tableCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.md, marginBottom: SPACING.md },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.primary, padding: SPACING.sm },
  tableCol: { flex: 1, color: COLORS.white, fontSize: 12, fontWeight: '700' },
  tableRow: { flexDirection: 'row', padding: SPACING.sm },
  tableCell: { flex: 1, fontSize: 12, color: COLORS.text },
  branchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  branchName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  branchRev: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  growthBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.md },
  growthText: { fontSize: 14, fontWeight: '800' },
});
