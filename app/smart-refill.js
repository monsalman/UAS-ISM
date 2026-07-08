import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const SEED = [
  { id: 'rf1', name: 'Amlodipine 5mg', dosage: '1x sehari', remaining: 5, totalDays: 30, nextRefill: '2026-07-11', autoRefill: true },
  { id: 'rf2', name: 'Metformin 500mg', dosage: '2x sehari', remaining: 12, totalDays: 30, nextRefill: '2026-07-18', autoRefill: false },
  { id: 'rf3', name: 'Vitamin D3 1000IU', dosage: '1x sehari', remaining: 20, totalDays: 60, nextRefill: '2026-07-26', autoRefill: true },
];

export default function SmartRefillScreen() {
  const router = useRouter();
  const [refills, setRefills] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      let data = await getData(KEYS.REFILLS);
      if (!data || data.length === 0) { data = SEED; await setData(KEYS.REFILLS, data); }
      setRefills(data);
    })();
  }, []));

  const toggleAuto = async (id) => {
    const updated = refills.map(r => r.id === id ? { ...r, autoRefill: !r.autoRefill } : r);
    setRefills(updated);
    await setData(KEYS.REFILLS, updated);
  };

  const refillNow = async (item) => {
    const updated = refills.map(r => r.id === item.id ? { ...r, remaining: r.totalDays } : r);
    setRefills(updated);
    await setData(KEYS.REFILLS, updated);
    Alert.alert('Refill Berhasil', `${item.name} telah di-refill untuk ${item.totalDays} hari.\n\n(Simulasi — pesanan otomatis dibuat)`);
  };

  const deleteRefill = async (id) => {
    const updated = refills.filter(r => r.id !== id);
    setRefills(updated);
    await setData(KEYS.REFILLS, updated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Smart Refill</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={refills}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => {
          const pct = Math.round((item.remaining / item.totalDays) * 100);
          const urgent = pct <= 20;
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.medName}>{item.name}</Text>
                <TouchableOpacity onPress={() => deleteRefill(item.id)}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
              <Text style={styles.dosage}>{item.dosage}</Text>
              <View style={styles.barRow}>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: urgent ? COLORS.danger : COLORS.primary }]} />
                </View>
                <Text style={[styles.remaining, urgent && { color: COLORS.danger }]}>{item.remaining} hari</Text>
              </View>
              <Text style={styles.nextRefill}>Refill berikutnya: {item.nextRefill}</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.autoBtn, item.autoRefill && styles.autoBtnActive]} onPress={() => toggleAuto(item.id)}>
                  <Ionicons name={item.autoRefill ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={item.autoRefill ? COLORS.white : COLORS.primary} />
                  <Text style={[styles.autoText, item.autoRefill && { color: COLORS.white }]}>Auto-Refill</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => refillNow(item)} style={{ flex: 1 }}>
                  <LinearGradient colors={COLORS.gradient.primary} style={styles.refillBtn}>
                    <Text style={styles.refillText}>Refill Sekarang</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  medName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  dosage: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm },
  barBg: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, marginRight: SPACING.sm },
  barFill: { height: 8, borderRadius: 4 },
  remaining: { fontSize: 13, fontWeight: '700', color: COLORS.primary, width: 60, textAlign: 'right' },
  nextRefill: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
  actionRow: { flexDirection: 'row', marginTop: SPACING.md, gap: SPACING.sm },
  autoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.sm },
  autoBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  autoText: { color: COLORS.primary, fontWeight: '600', marginLeft: 4, fontSize: 13 },
  refillBtn: { borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center' },
  refillText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
});
