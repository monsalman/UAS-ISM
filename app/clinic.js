import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const CLINICS = [
  { id: 'c1', name: 'Klinik KF Juanda', address: 'Jl. Ir. H. Juanda No.30', doctors: ['dr. Andi Wijaya, Sp.PD', 'dr. Sari M., Sp.KK'], hours: '08:00 - 20:00' },
  { id: 'c2', name: 'Klinik KF Kebayoran', address: 'Jl. Kebayoran Baru No.15', doctors: ['dr. Budi Santoso, Sp.THT'], hours: '08:00 - 17:00' },
];

export default function ClinicScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      const data = await getData(KEYS.CLINIC_APPOINTMENTS);
      setAppointments(data || []);
    })();
  }, []));

  const bookAppointment = async (clinic, doctor) => {
    const appt = { id: Date.now().toString(), clinic: clinic.name, doctor, date: '2026-07-10', time: '10:00', status: 'confirmed' };
    const updated = [...appointments, appt];
    setAppointments(updated);
    await setData(KEYS.CLINIC_APPOINTMENTS, updated);
    Alert.alert('Janji Temu Dibuat', `${doctor}\n${clinic.name}\n10 Jul 2026, 10:00`);
  };

  const cancelAppt = async (id) => {
    const updated = appointments.filter(a => a.id !== id);
    setAppointments(updated);
    await setData(KEYS.CLINIC_APPOINTMENTS, updated);
    Alert.alert('Janji temu dibatalkan');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Klinik Kimia Farma</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={[...CLINICS]}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        ListHeaderComponent={
          appointments.length > 0 ? (
            <View style={{ marginBottom: SPACING.md }}>
              <Text style={[FONTS.h3, { marginBottom: SPACING.sm }]}>Janji Temu Anda</Text>
              {appointments.map(a => (
                <View key={a.id} style={styles.apptCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.apptDoctor}>{a.doctor}</Text>
                    <Text style={styles.apptMeta}>{a.clinic} • {a.date} {a.time}</Text>
                  </View>
                  <TouchableOpacity onPress={() => cancelAppt(a.id)} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null
        }
        renderItem={({ item: clinic }) => (
          <View style={styles.card}>
            <Text style={styles.clinicName}>{clinic.name}</Text>
            <Text style={styles.clinicAddr}>{clinic.address}</Text>
            <Text style={styles.clinicHours}>{clinic.hours}</Text>
            <View style={styles.divider} />
            {clinic.doctors.map((doc, i) => (
              <TouchableOpacity key={i} style={styles.docRow} onPress={() => bookAppointment(clinic, doc)}>
                <Ionicons name="person" size={16} color={COLORS.primary} />
                <Text style={styles.docName}>{doc}</Text>
                <LinearGradient colors={COLORS.gradient.primary} style={styles.bookBtn}>
                  <Text style={styles.bookText}>Book</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
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
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.md },
  clinicName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  clinicAddr: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  clinicHours: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  docRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  docName: { flex: 1, fontSize: 14, color: COLORS.text, marginLeft: SPACING.sm, fontWeight: '500' },
  bookBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.md },
  bookText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  apptCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  apptDoctor: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  apptMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  cancelBtn: { borderWidth: 1, borderColor: COLORS.danger, borderRadius: RADIUS.md, paddingHorizontal: 10, paddingVertical: 6 },
  cancelText: { color: COLORS.danger, fontWeight: '700', fontSize: 12 },
});
