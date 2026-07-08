import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const SEED = [
  { id: 'ea1', type: 'Interaksi Obat', title: 'Amlodipine + Simvastatin', desc: 'Kombinasi ini dapat meningkatkan risiko miopati. Konsultasikan ke apoteker.', severity: 'warning', date: '2026-07-05', read: false },
  { id: 'ea2', type: 'Alergi Terdeteksi', title: 'Penicillin Allergy Alert', desc: 'Resep baru mengandung Amoxicillin (golongan Penicillin). Anda memiliki riwayat alergi.', severity: 'critical', date: '2026-07-06', read: false },
];

export default function EmergencyAlertScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      let data = await getData(KEYS.EMERGENCY_ALERTS);
      if (!data || data.length === 0) { data = SEED; await setData(KEYS.EMERGENCY_ALERTS, data); }
      setAlerts(data);
    })();
  }, []));

  const markRead = async (id) => {
    const updated = alerts.map(a => a.id === id ? { ...a, read: true } : a);
    setAlerts(updated);
    await setData(KEYS.EMERGENCY_ALERTS, updated);
  };

  const callEmergency = () => {
    Alert.alert('Panggilan Darurat', 'Menghubungi 119 (Ambulans)...\n\n(Simulasi)');
  };

  const deleteAlert = async (id) => {
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    await setData(KEYS.EMERGENCY_ALERTS, updated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.danger }} />
      <LinearGradient colors={[COLORS.danger, '#B91C1C']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Safety Alert</Text>
          <TouchableOpacity onPress={callEmergency} style={styles.emergBtn}>
            <Ionicons name="call" size={18} color={COLORS.white} />
            <Text style={styles.emergText}>119</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={alerts}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={[styles.card, item.severity === 'critical' && styles.cardCritical, item.read && { opacity: 0.6 }]}>
            <View style={styles.cardTop}>
              <View style={[styles.typeBadge, { backgroundColor: item.severity === 'critical' ? COLORS.dangerLight : COLORS.warningLight }]}>
                <Ionicons name={item.severity === 'critical' ? 'alert-circle' : 'warning'} size={14} color={item.severity === 'critical' ? COLORS.danger : COLORS.warning} />
                <Text style={[styles.typeText, { color: item.severity === 'critical' ? COLORS.danger : COLORS.warning }]}>{item.type}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteAlert(item.id)}>
                <Ionicons name="close" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
            <Text style={styles.alertTitle}>{item.title}</Text>
            <Text style={styles.alertDesc}>{item.desc}</Text>
            <Text style={styles.alertDate}>{item.date}</Text>
            {!item.read && (
              <TouchableOpacity onPress={() => markRead(item.id)} style={styles.readBtn}>
                <Text style={styles.readText}>Tandai Sudah Dibaca</Text>
              </TouchableOpacity>
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
  emergBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full },
  emergText: { color: COLORS.white, fontWeight: '800', marginLeft: 4, fontSize: 14 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  cardCritical: { borderLeftWidth: 4, borderLeftColor: COLORS.danger },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  typeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  typeText: { fontSize: 11, fontWeight: '700', marginLeft: 4 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  alertDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, lineHeight: 19 },
  alertDate: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
  readBtn: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center', marginTop: SPACING.md },
  readText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
});
