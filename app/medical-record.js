import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';

export default function MedicalRecordScreen() {
  const router = useRouter();

  const records = [
    { date: '05 Jul 2026', diagnosis: 'Hipertensi Esensial', doctor: 'dr. Andi Wijaya, Sp.PD', clinic: 'Klinik Kimia Farma Kebayoran', prescription: 'Amlodipine 5mg' },
    { date: '20 Jun 2026', diagnosis: 'Faringitis Akut', doctor: 'dr. Rina Lestari, Sp.A', clinic: 'Telekonsultasi Halodoc', prescription: 'Amoxicillin 500mg, Paracetamol 500mg' },
  ];

  const vitals = [
    { label: 'Gol. Darah', value: 'O+' },
    { label: 'Tekanan Darah', value: '120/80' },
    { label: 'Gula Darah', value: '95 mg/dL' },
    { label: 'BMI', value: '22.4 (Normal)' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rekam Medis</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg }}>
        {/* Vitals Grid */}
        <Text style={styles.sectionTitle}>Kondisi Fisik Terakhir</Text>
        <View style={styles.vitalsGrid}>
          {vitals.map((v, i) => (
            <View key={i} style={styles.vitalCard}>
              <Text style={styles.vitalLabel}>{v.label}</Text>
              <Text style={styles.vitalValue}>{v.value}</Text>
            </View>
          ))}
        </View>

        {/* History */}
        <Text style={styles.sectionTitle}>Riwayat Diagnosa & Resep</Text>
        {records.map((r, i) => (
          <View key={i} style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordDate}>{r.date}</Text>
              <Text style={styles.recordClinic}>{r.clinic}</Text>
            </View>
            <Text style={styles.recordDiagnosis}>{r.diagnosis}</Text>
            <Text style={styles.recordDoc}>{r.doctor}</Text>
            <View style={styles.divider} />
            <View style={styles.prescriptionRow}>
              <Ionicons name="document-text-outline" size={16} color={COLORS.primary} />
              <Text style={styles.prescriptionText}>{r.prescription}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGrad: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  sectionTitle: { ...FONTS.h3, marginBottom: SPACING.sm, marginTop: SPACING.md },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  vitalCard: { width: '47%', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOWS.sm },
  vitalLabel: { fontSize: 12, color: COLORS.textSecondary },
  vitalValue: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginTop: 4 },
  recordCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  recordHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  recordDate: { fontSize: 12, color: COLORS.textLight, fontWeight: '600' },
  recordClinic: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  recordDiagnosis: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  recordDoc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, my: SPACING.sm, marginVertical: SPACING.sm },
  prescriptionRow: { flexDirection: 'row', alignItems: 'center' },
  prescriptionText: { fontSize: 13, color: COLORS.text, marginLeft: 6, fontWeight: '500' },
});