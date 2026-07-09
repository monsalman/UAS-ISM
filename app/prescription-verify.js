import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const SEED = [
  { id: 'rx1', patient: 'Salman', doctor: 'dr. Andi Wijaya, Sp.PD', medicines: ['Amlodipine 5mg', 'Lisinopril 10mg'], status: 'pending', date: '2026-07-06' },
  { id: 'rx2', patient: 'Rina', doctor: 'dr. Rina Lestari, Sp.A', medicines: ['Amoxicillin 500mg'], status: 'pending', date: '2026-07-05' },
  { id: 'rx3', patient: 'Budi', doctor: 'dr. Budi Santoso, Sp.THT', medicines: ['Cetirizine 10mg', 'Pseudoephedrine 60mg'], status: 'verified', date: '2026-07-04' },
];

export default function PrescriptionVerifyScreen() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      const data = await getData(KEYS.PRESCRIPTIONS);
      if (!data || data.length === 0) { 
        await setData(KEYS.PRESCRIPTIONS, SEED); 
        setPrescriptions(SEED);
      } else {
        setPrescriptions(data);
      }
    })();
  }, []));

  const verify = async (id) => {
    const updated = prescriptions.map(p => p.id === id ? { ...p, status: 'verified', verifiedAt: new Date().toISOString(), verifiedBy: 'Apt. Dewi S., S.Farm' } : p);
    setPrescriptions(updated);
    await setData(KEYS.PRESCRIPTIONS, updated);
    Alert.alert('Resep Terverifikasi', 'Resep telah divalidasi oleh apoteker.');
  };

  const reject = async (id) => {
    const updated = prescriptions.map(p => p.id === id ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString() } : p);
    setPrescriptions(updated);
    await setData(KEYS.PRESCRIPTIONS, updated);
    Alert.alert('Resep Ditolak', 'Resep memerlukan klarifikasi dari dokter.');
  };

  const statusColor = { pending: COLORS.warning, verified: COLORS.success, rejected: COLORS.danger };
  const statusLabel = { pending: 'Menunggu', verified: 'Terverifikasi', rejected: 'Ditolak' };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verifikasi Resep</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={prescriptions}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.patient}>{item.patient}</Text>
              <View style={[styles.badge, { backgroundColor: statusColor[item.status] + '20' }]}>
                <Text style={[styles.badgeText, { color: statusColor[item.status] }]}>{statusLabel[item.status]}</Text>
              </View>
            </View>
            <Text style={styles.doctor}>{item.doctor} • {item.date}</Text>
            <View style={styles.medList}>
              {item.medicines.map((m, i) => (
                <View key={i} style={styles.medChip}><Text style={styles.medChipText}>{m}</Text></View>
              ))}
            </View>
            {item.status === 'pending' && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => reject(item.id)}>
                  <Text style={styles.rejectText}>Tolak</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => verify(item.id)} style={{ flex: 1 }}>
                  <LinearGradient colors={COLORS.gradient.primary} style={styles.verifyBtn}>
                    <Text style={styles.verifyText}>Verifikasi</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  patient: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  badgeText: { fontSize: 11, fontWeight: '700' },
  doctor: { fontSize: 12, color: COLORS.textSecondary },
  medList: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.sm, gap: 6 },
  medChip: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  medChipText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  actionRow: { flexDirection: 'row', marginTop: SPACING.md, gap: SPACING.sm },
  rejectBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.danger, borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center' },
  rejectText: { color: COLORS.danger, fontWeight: '700' },
  verifyBtn: { borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center' },
  verifyText: { color: COLORS.white, fontWeight: '700' },
});
