import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { PROMOS, DEFAULT_PROFILE } from '../../constants/mockData';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { icon: 'document-text', label: 'Upload\nResep', route: '/upload-prescription', gradient: COLORS.gradient.primary },
  { icon: 'medkit', label: 'Konsultasi\nDokter', route: '/consult', gradient: COLORS.gradient.accent },
  { icon: 'cart', label: 'Pesan\nObat', route: '/(tabs)/medicines', gradient: COLORS.gradient.secondary },
  { icon: 'folder-open', label: 'Rekam\nMedis', route: '/medical-record', gradient: COLORS.gradient.dark },
  { icon: 'location', label: 'Cari\nApotek', route: '/pharmacy', gradient: COLORS.gradient.secondary },
  { icon: 'chatbubble-ellipses', label: 'KAI\nAssistant', route: '/(tabs)/chat', gradient: COLORS.gradient.primary },
  { icon: 'gift', label: 'KF\nRewards', route: '/rewards', gradient: COLORS.gradient.secondary },
  { icon: 'receipt', label: 'Riwayat\nPesanan', route: '/orders', gradient: COLORS.gradient.dark },
];

const MORE_FEATURES = [
  { icon: 'car', label: 'Smart Delivery', desc: 'Tracking pengiriman obat real-time', route: '/smart-delivery', color: COLORS.primary },
  { icon: 'shield-checkmark', label: 'Staff Portal', desc: 'Portal apoteker, kasir & kurir', route: '/staff-portal', color: '#8B5CF6' },
  { icon: 'checkmark-done-circle', label: 'Verifikasi Resep', desc: 'Workflow verifikasi oleh apoteker', route: '/prescription-verify', color: COLORS.success },
  { icon: 'globe', label: 'Inventori Nasional', desc: 'Stok obat seluruh apotek Indonesia', route: '/national-inventory', color: COLORS.accent },
  { icon: 'refresh-circle', label: 'Smart Refill', desc: 'Auto-refill obat rutin Anda', route: '/smart-refill', color: COLORS.secondary },
  { icon: 'ticket', label: 'Antrian Digital', desc: 'Ambil nomor antrian apotek', route: '/digital-queue', color: '#0EA5E9' },
  { icon: 'flask', label: 'Hasil Lab', desc: 'Integrasi hasil laboratorium', route: '/lab-results', color: '#6366F1' },
  { icon: 'business', label: 'Klinik KF', desc: 'Booking klinik Kimia Farma', route: '/clinic', color: '#14B8A6' },
  { icon: 'fitness', label: 'Vaksinasi', desc: 'Jadwal & booking vaksin', route: '/vaccination', color: COLORS.danger },
  { icon: 'people', label: 'Akun Keluarga', desc: 'Kelola kesehatan keluarga', route: '/family-account', color: '#F59E0B' },
  { icon: 'card', label: 'Asuransi', desc: 'BPJS & asuransi swasta', route: '/insurance', color: '#10B981' },
  { icon: 'warning', label: 'Penarikan Obat', desc: 'Notifikasi drug recall', route: '/drug-recall', color: COLORS.danger },
  { icon: 'alert-circle', label: 'Safety Alert', desc: 'Peringatan interaksi & alergi obat', route: '/emergency-alert', color: '#DC2626' },
  { icon: 'bar-chart', label: 'Executive Dashboard', desc: 'BI dashboard manajemen', route: '/executive-dashboard', color: COLORS.primary },
];

export default function HomeScreen() {
  const router = useRouter();
  const profile = DEFAULT_PROFILE;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 17 ? 'Selamat Siang' : 'Selamat Malam';

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Header dengan background gradient */}
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGradient}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.name}>{profile.name}</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <View style={styles.notifBadge} />
              <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Health Score Card */}
          <TouchableOpacity style={styles.healthCard} onPress={() => router.push('/health-score')} activeOpacity={0.9}>
            <View style={styles.healthGlow} />
            <View style={styles.healthLeft}>
              <Text style={styles.healthTitle}>Health Score</Text>
              <Text style={styles.healthScore}>{profile.healthScore}</Text>
              <View style={styles.healthMaxRow}>
                <Text style={styles.healthMax}>dari 100</Text>
                <Ionicons name="arrow-up" size={12} color={COLORS.successLight} />
                <Text style={styles.healthTrend}>+5%</Text>
              </View>
            </View>
            <View style={styles.healthDivider} />
            <View style={styles.healthRight}>
              {Object.entries(profile.healthBreakdown).map(([key, val]) => (
                <View key={key} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${val}%` }]} />
                  </View>
                  <Text style={styles.breakdownVal}>{val}%</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Layanan Cepat</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickItem}
              onPress={() => item.route && router.push(item.route)}
              activeOpacity={0.85}
            >
              <LinearGradient colors={item.gradient} style={styles.quickIconWrap}>
                <Ionicons name={item.icon} size={22} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promo Banner */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Promo & Info</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lainnya</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={PROMOS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: SPACING.md }}
          renderItem={({ item }) => (
            <LinearGradient colors={item.id === '1' ? COLORS.gradient.mint : item.id === '2' ? COLORS.gradient.accent : COLORS.gradient.sunset} style={styles.promoCard}>
              <Ionicons name={item.icon} size={26} color={COLORS.white} style={{ marginBottom: SPACING.xs }} />
              <Text style={styles.promoTitle}>{item.title}</Text>
              <Text style={styles.promoSub}>{item.subtitle}</Text>
            </LinearGradient>
          )}
        />

        {/* Medicine Reminder Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pengingat Obat</Text>
        </View>
        <TouchableOpacity style={styles.reminderPreview} onPress={() => router.push('/(tabs)/reminders')} activeOpacity={0.7}>
          <LinearGradient colors={[COLORS.successLight, COLORS.white]} style={styles.reminderIconWrap}>
            <Ionicons name="alarm" size={24} color={COLORS.primary} />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: SPACING.sm }}>
            <Text style={FONTS.h4}>Medicine Reminder</Text>
            <Text style={FONTS.caption}>Atur & pantau pengingat minum obat Anda</Text>
          </View>
          <View style={styles.reminderArrow}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        {/* More Features */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fitur Lainnya</Text>
        </View>
        {MORE_FEATURES.map((item, i) => (
          <TouchableOpacity key={i} style={styles.featureRow} onPress={() => router.push(item.route)} activeOpacity={0.7}>
            <View style={[styles.featureIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.sm }}>
              <Text style={styles.featureLabel}>{item.label}</Text>
              <Text style={styles.featureDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}

        {/* Spacer for tab bar */}
        <View style={{ height: SPACING.xxl + 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerGradient: { paddingBottom: SPACING.lg, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontWeight: '500', marginBottom: 2 },
  name: { color: COLORS.white, fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  notifBtn: { width: 42, height: 42, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  notifBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger, zIndex: 1 },
  healthCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: SPACING.lg, borderRadius: RADIUS.xl, padding: SPACING.md, overflow: 'hidden' },
  healthGlow: { position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.08)' },
  healthLeft: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.md },
  healthTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  healthScore: { color: COLORS.white, fontSize: 44, fontWeight: '800', letterSpacing: -1, marginTop: 2 },
  healthMaxRow: { flexDirection: 'row', alignItems: 'center', marginTop: -4 },
  healthMax: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  healthTrend: { color: COLORS.successLight, fontSize: 11, fontWeight: '600', marginLeft: 2 },
  healthDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: SPACING.sm },
  healthRight: { flex: 1, justifyContent: 'center', paddingLeft: SPACING.sm },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  breakdownLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11, width: 62 },
  barBg: { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginHorizontal: 4 },
  barFill: { height: 5, backgroundColor: COLORS.white, borderRadius: 3 },
  breakdownVal: { color: COLORS.white, fontSize: 11, fontWeight: '600', width: 28, textAlign: 'right' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  sectionTitle: { ...FONTS.h3 },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.sm + 4, justifyContent: 'space-between' },
  quickItem: { width: (width - 64) / 3, alignItems: 'center', marginBottom: SPACING.md },
  quickIconWrap: { width: 52, height: 52, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs, ...SHADOWS.sm },
  quickLabel: { fontSize: 11, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 15 },
  promoCard: { width: 220, borderRadius: RADIUS.lg, padding: SPACING.md, marginRight: SPACING.sm, ...SHADOWS.md },
  promoEmoji: { fontSize: 28, marginBottom: 4 },
  promoTitle: { color: COLORS.white, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  promoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '500' },
  reminderPreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, padding: SPACING.md, borderRadius: RADIUS.lg, ...SHADOWS.md },
  reminderIconWrap: { width: 48, height: 48, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  reminderArrow: { width: 32, height: 32, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  featureRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, padding: SPACING.md, borderRadius: RADIUS.lg, marginBottom: SPACING.sm, ...SHADOWS.sm },
  featureIcon: { width: 40, height: 40, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  featureLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  featureDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
});
