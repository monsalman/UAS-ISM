import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const SEED = [
  { id: 'lb1', type: 'Darah Lengkap', date: '2026-07-01', lab: 'Lab KF Juanda', status: 'completed', results: [{ name: 'Hemoglobin', value: '14.2', unit: 'g/dL', normal: '13-17', flag: 'normal' }, { name: 'Leukosit', value: '8500', unit: '/µL', normal: '4000-11000', flag: 'normal' }, { name: 'Trombosit', value: '250000', unit: '/µL', normal: '150000-400000', flag: 'normal' }] },
  { id: 'lb2', type: 'Gula Darah Puasa', date: '2026-06-15', lab: 'Lab KF Matraman', status: 'completed', results: [{ name: 'Glukosa Puasa', value: '110', unit: 'mg/dL', normal: '70-100', flag: 'high' }] },
];

export default function LabResultsScreen() {
  const router = useRouter();
  const [labs, setLabs] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useFocusEffect(useCallback(() => {
    (async () => {
      let data = await getData(KEYS.LAB_RESULTS);
      if (!data || data.length === 0) { data = SEED; await setData(KEYS.LAB_RESULTS, data); }
      setLabs(data);
    })();
  }, []));

  const deleteLab = async (id) => {
    const updated = labs.filter(l => l.id !== id);
    setLabs(updated);
    await setData(KEYS.LAB_RESULTS, updated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hasil Laboratorium</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={labs}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardTop} onPress={() => setExpanded(expanded === item.id ? null : item.id)}>
              <View>
                <Text style={styles.labType}>{item.type}</Text>
                <Text style={styles.labMeta}>{item.lab} • {item.date}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => deleteLab(item.id)} style={{ marginRight: SPACING.sm }}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                </TouchableOpacity>
                <Ionicons name={expanded === item.id ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.textLight} />
              </View>
            </TouchableOpacity>
            {expanded === item.id && (
              <View style={styles.resultsWrap}>
                {item.results.map((r, i) => (
                  <View key={i} style={styles.resultRow}>
                    <Text style={styles.resultName}>{r.name}</Text>
                    <Text style={[styles.resultVal, r.flag === 'high' && { color: COLORS.danger }, r.flag === 'low' && { color: COLORS.warning }]}>{r.value} {r.unit}</Text>
                    <Text style={styles.resultNormal}>({r.normal})</Text>
                  </View>
                ))}
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
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labType: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  labMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  resultsWrap: { marginTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.sm },
  resultRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  resultName: { flex: 1, fontSize: 14, color: COLORS.text },
  resultVal: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginRight: SPACING.sm },
  resultNormal: { fontSize: 11, color: COLORS.textLight },
});
