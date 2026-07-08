import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const VACCINES = [
  { id: 'v1', name: 'Influenza', desc: 'Vaksin flu musiman', price: 350000 },
  { id: 'v2', name: 'Hepatitis B', desc: 'Perlindungan hati', price: 250000 },
  { id: 'v3', name: 'HPV', desc: 'Pencegahan kanker serviks', price: 1500000 },
  { id: 'v4', name: 'COVID-19 Booster', desc: 'Booster terbaru', price: 0 },
];

export default function VaccinationScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);

  useFocusEffect(useCallback(() => {
    (async () => {
      const data = await getData(KEYS.VACCINATIONS);
      setBookings(data || []);
    })();
  }, []));

  const book = async (vaccine) => {
    const booking = { id: Date.now().toString(), vaccine: vaccine.name, date: '2026-07-15', time: '09:00', location: 'KF Juanda, Jakarta', status: 'booked' };
    const updated = [...bookings, booking];
    setBookings(updated);
    await setData(KEYS.VACCINATIONS, updated);
    Alert.alert('Vaksinasi Terjadwal', `${vaccine.name}\n15 Jul 2026, 09:00\nKF Juanda, Jakarta`);
  };

  const cancel = async (id) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    await setData(KEYS.VACCINATIONS, updated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pusat Vaksinasi</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      <FlatList
        data={VACCINES}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        ListHeaderComponent={
          bookings.length > 0 ? (
            <View style={{ marginBottom: SPACING.md }}>
              <Text style={[FONTS.h3, { marginBottom: SPACING.sm }]}>Jadwal Vaksinasi Anda</Text>
              {bookings.map(b => (
                <View key={b.id} style={styles.bookingCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bookingVax}>{b.vaccine}</Text>
                    <Text style={styles.bookingMeta}>{b.location} • {b.date} {b.time}</Text>
                  </View>
                  <TouchableOpacity onPress={() => cancel(b.id)} style={styles.cancelBtn}>
                    <Ionicons name="close" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.vaxName}>{item.name}</Text>
              <Text style={styles.vaxDesc}>{item.desc}</Text>
              <Text style={styles.vaxPrice}>{item.price > 0 ? `Rp${item.price.toLocaleString('id-ID')}` : 'GRATIS'}</Text>
            </View>
            <TouchableOpacity onPress={() => book(item)}>
              <LinearGradient colors={COLORS.gradient.primary} style={styles.bookBtn}>
                <Text style={styles.bookText}>Booking</Text>
              </LinearGradient>
            </TouchableOpacity>
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  vaxName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  vaxDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  vaxPrice: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 4 },
  bookBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.md },
  bookText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  bookingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  bookingVax: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  bookingMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  cancelBtn: { width: 32, height: 32, borderRadius: RADIUS.full, backgroundColor: COLORS.dangerLight, justifyContent: 'center', alignItems: 'center' },
});
