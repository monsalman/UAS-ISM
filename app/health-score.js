import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { DEFAULT_PROFILE } from '../constants/mockData';

export default function HealthScoreScreen() {
  const router = useRouter();
  const profile = DEFAULT_PROFILE;

  const tips = [
    { title: 'Minum Air Putih Cukup', desc: 'Konsumsi minimal 2 liter air per hari untuk menjaga hidrasi tubuh.' },
    { title: 'Rutin Berolahraga', desc: 'Lakukan aktivitas fisik sedang minimal 30 menit sehari, 5 kali seminggu.' },
    { title: 'Tidur Cukup & Teratur', desc: 'Tidur 7-8 jam setiap malam membantu pemulihan sel tubuh secara optimal.' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Score Detail</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Skor Kesehatan Anda</Text>
          <Text style={styles.scoreVal}>{profile.healthScore}</Text>
          <Text style={styles.scoreSub}>Kategori: Sangat Baik</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
        {/* Breakdown */}
        <Text style={styles.sectionTitle}>Rincian Komponen</Text>
        <View style={styles.card}>
          {Object.entries(profile.healthBreakdown).map(([key, val], i) => (
            <View key={key} style={[styles.breakdownRow, i > 0 && styles.borderTop]}>
              <Text style={styles.breakdownLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${val}%` }]} />
              </View>
              <Text style={styles.breakdownVal}>{val}%</Text>
            </View>
          ))}
        </View>

        {/* Tips */}
        <Text style={styles.sectionTitle}>Tips Kesehatan Personal</Text>
        {tips.map((t, i) => (
          <View key={i} style={styles.tipCard}>
            <Ionicons name="heart" size={20} color={COLORS.danger} style={{ marginRight: SPACING.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>{t.title}</Text>
              <Text style={styles.tipDesc}>{t.desc}</Text>
            </View>
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
  scoreCard: { alignItems: 'center', marginTop: SPACING.md },
  scoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  scoreVal: { color: COLORS.white, fontSize: 64, fontWeight: '800', marginVertical: SPACING.xs },
  scoreSub: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  sectionTitle: { ...FONTS.h3, marginBottom: SPACING.sm, marginTop: SPACING.md },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOWS.md },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
  borderTop: { borderTopWidth: 1, borderTopColor: COLORS.border },
  breakdownLabel: { fontSize: 14, color: COLORS.text, width: 80, fontWeight: '600' },
  barBg: { flex: 1, height: 8, backgroundColor: COLORS.background, borderRadius: 4, marginHorizontal: SPACING.sm },
  barFill: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  breakdownVal: { fontSize: 14, color: COLORS.text, fontWeight: '700', width: 36, textAlign: 'right' },
  tipCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  tipTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  tipDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});