import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const PHARMACIES = ['KF Juanda, Jakarta', 'KF Matraman, Jakarta', 'KF Kebayoran, Jakarta'];

export default function DigitalQueueScreen() {
  const router = useRouter();
  const [queue, setQueue] = useState(null);
  const [currentQueue, setCurrentQueue] = useState(12);

  useFocusEffect(useCallback(() => {
    (async () => {
      const data = await getData(KEYS.QUEUE);
      setQueue(data);
    })();
  }, []));

  const takeQueue = async (pharmacy) => {
    const ticket = { id: Date.now().toString(), pharmacy, number: currentQueue + 5, takenAt: new Date().toISOString(), status: 'waiting' };
    setQueue(ticket);
    await setData(KEYS.QUEUE, ticket);
    Alert.alert('Nomor Antrian', `Nomor Anda: ${ticket.number}\nApotek: ${pharmacy}\n\nEstimasi: ~${(ticket.number - currentQueue) * 3} menit`);
  };

  const cancelQueue = async () => {
    setQueue(null);
    await setData(KEYS.QUEUE, null);
    Alert.alert('Antrian Dibatalkan');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Antrian Digital</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      {queue ? (
        <View style={{ padding: SPACING.lg, alignItems: 'center' }}>
          <View style={styles.ticketCard}>
            <Text style={styles.ticketLabel}>NOMOR ANTRIAN ANDA</Text>
            <Text style={styles.ticketNumber}>{queue.number}</Text>
            <Text style={styles.ticketPharmacy}>{queue.pharmacy}</Text>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Antrian Saat Ini</Text>
              <Text style={styles.infoVal}>{currentQueue}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estimasi Tunggu</Text>
              <Text style={styles.infoVal}>~{(queue.number - currentQueue) * 3} menit</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sisa Antrian</Text>
              <Text style={styles.infoVal}>{queue.number - currentQueue} orang</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelQueue}>
            <Text style={styles.cancelText}>Batalkan Antrian</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={PHARMACIES}
          keyExtractor={i => i}
          contentContainerStyle={{ padding: SPACING.lg }}
          ListHeaderComponent={<Text style={[FONTS.h3, { marginBottom: SPACING.sm }]}>Pilih Apotek</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.pharmacyCard} onPress={() => takeQueue(item)}>
              <View style={styles.pharmacyIcon}>
                <Ionicons name="storefront" size={24} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                <Text style={styles.pharmacyName}>{item}</Text>
                <Text style={styles.queueInfo}>Antrian saat ini: {currentQueue}</Text>
              </View>
              <LinearGradient colors={COLORS.gradient.primary} style={styles.takeBtn}>
                <Text style={styles.takeText}>Ambil</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  ticketCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.xl, alignItems: 'center', width: '100%', ...SHADOWS.lg },
  ticketLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', letterSpacing: 1 },
  ticketNumber: { fontSize: 72, fontWeight: '800', color: COLORS.primary, marginVertical: SPACING.sm },
  ticketPharmacy: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, width: '100%', marginVertical: SPACING.md },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 6 },
  infoLabel: { fontSize: 14, color: COLORS.textSecondary },
  infoVal: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  cancelBtn: { marginTop: SPACING.lg, borderWidth: 1, borderColor: COLORS.danger, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm },
  cancelText: { color: COLORS.danger, fontWeight: '700' },
  pharmacyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  pharmacyIcon: { width: 48, height: 48, borderRadius: RADIUS.lg, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  pharmacyName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  queueInfo: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  takeBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.md },
  takeText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
});
