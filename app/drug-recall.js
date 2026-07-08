import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const SEED = [
  { id: 'dr1', drug: 'Ranitidine 150mg', batch: 'RAN-2026-A01', reason: 'Kontaminasi NDMA melebihi batas aman', severity: 'high', date: '2026-07-01', acknowledged: false },
  { id: 'dr2', drug: 'Metformin XR 500mg', batch: 'MET-2026-B12', reason: 'Kesalahan label dosis pada kemasan', severity: 'medium', date: '2026-06-28', acknowledged: false },
  { id: 'dr3', drug: 'Losartan 50mg', batch: 'LOS-2025-C05', reason: 'Impuritas di atas batas yang diizinkan', severity: 'high', date: '2026-06-15', acknowledged: true },
];

export default function DrugRecallScreen() {
  const router = useRouter();
  const [recalls, setRecalls] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      let data = await getData(KEYS.DRUG_RECALLS);
      if (!data || data.length === 0) { data = SEED; await setData(KEYS.DRUG_RECALLS, data); }
      setRecalls(data);
    })();
  }, []));

  const acknowledge = async (id) => {
    const updated = recalls.map(r => r.id === id ? { ...r, acknowledged: true } : r);
    setRecalls(updated);
    await setData(KEYS.DRUG_RECALLS, updated);
    Alert.alert('Dikonfirmasi', 'Anda telah membaca peringatan penarikan obat ini.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.danger }} />
      <LinearGradient colors={[COLORS.danger, '#B91C1C']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Penarikan Obat</Text>
          <Ionicons name="warning" size={24} color={COLORS.white} />
        </View>
      </LinearGradient>

      <FlatList
        data={recalls}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={[styles.card, item.severity === 'high' && styles.cardHigh]}>
            <View style={styles.cardTop}>
              <Text style={styles.drugName}>{item.drug}</Text>
              <View style={[styles.sevBadge, { backgroundColor: item.severity === 'high' ? COLORS.dangerLight : COLORS.warningLight }]}>
                <Text style={[styles.sevText, { color: item.severity === 'high' ? COLORS.danger : COLORS.warning }]}>
                  {item.severity === 'high' ? 'KRITIS' : 'SEDANG'}
                </Text>
              </View>
            </View>
            <Text style={styles.batch}>Batch: {item.batch}</Text>
            <Text style={styles.reason}>{item.reason}</Text>
            <Text style={styles.date}>Tanggal: {item.date}</Text>
            {!item.acknowledged ? (
              <TouchableOpacity onPress={() => acknowledge(item.id)}>
                <LinearGradient colors={[COLORS.danger, '#B91C1C']} style={styles.ackBtn}>
                  <Text style={styles.ackText}>Saya Sudah Membaca</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.ackDone}><Text style={styles.ackDoneText}>Sudah dikonfirmasi</Text></View>
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
  cardHigh: { borderLeftWidth: 4, borderLeftColor: COLORS.danger },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  drugName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  sevText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  batch: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  reason: { fontSize: 14, color: COLORS.text, marginTop: SPACING.xs, lineHeight: 20 },
  date: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
  ackBtn: { borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center', marginTop: SPACING.md },
  ackText: { color: COLORS.white, fontWeight: '700' },
  ackDone: { backgroundColor: COLORS.successLight, borderRadius: RADIUS.md, padding: SPACING.sm, alignItems: 'center', marginTop: SPACING.md },
  ackDoneText: { color: COLORS.success, fontWeight: '600' },
});
