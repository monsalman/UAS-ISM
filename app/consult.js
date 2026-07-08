import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';

const DOCTORS = [
  { id: '1', name: 'dr. Andi Wijaya, Sp.PD', specialty: 'Spesialis Penyakit Dalam', rating: '4.9', experience: '12 tahun', price: 50000, image: 'person-outline', online: true },
  { id: '2', name: 'dr. Rina Lestari, Sp.A', specialty: 'Spesialis Anak', rating: '4.8', experience: '8 tahun', price: 45000, image: 'person-outline', online: true },
  { id: '3', name: 'dr. Budi Santoso, Sp.THT', specialty: 'Spesialis THT', rating: '4.7', experience: '10 tahun', price: 40000, image: 'person-outline', online: false },
];

export default function ConsultScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleConsult = (doc) => {
    Alert.alert(
      'Mulai Konsultasi',
      `Menghubungkan ke ${doc.name} via Halodoc...\n\n(Simulasi Telemedicine - e-Prescription otomatis akan disinkronkan ke KF-DHE setelah selesai)`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Konsultasi Dokter</Text>
          <View style={styles.halodocBadge}>
            <Text style={styles.halodocText}>Halodoc Partner</Text>
          </View>
        </View>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textLight} />
          <TextInput style={styles.searchInput} placeholder="Cari dokter atau spesialisasi..." placeholderTextColor={COLORS.textLight} value={search} onChangeText={setSearch} />
        </View>
      </LinearGradient>

      <FlatList
        data={DOCTORS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.docCard}>
            <View style={styles.avatarWrap}>
              <Ionicons name={item.image} size={32} color={COLORS.primary} />
              {item.online && <View style={styles.onlineDot} />}
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.sm }}>
              <Text style={[FONTS.medium, { fontSize: 16 }]}>{item.name}</Text>
              <Text style={FONTS.caption}>{item.specialty}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="star" size={14} color={COLORS.warning} />
                <Text style={styles.metaText}>{item.rating}  •  {item.experience}</Text>
              </View>
              <Text style={styles.priceText}>Rp{item.price.toLocaleString('id-ID')}</Text>
            </View>
            <TouchableOpacity style={[styles.chatBtn, !item.online && { backgroundColor: COLORS.textLight }]} onPress={() => handleConsult(item)} disabled={!item.online}>
              <Text style={styles.chatBtnText}>{item.online ? 'Chat' : 'Offline'}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerGrad: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  halodocBadge: { backgroundColor: COLORS.accent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  halodocText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, marginTop: SPACING.md, ...SHADOWS.sm },
  searchInput: { flex: 1, paddingVertical: 12, paddingLeft: SPACING.xs, fontSize: 14 },
  docCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  avatarWrap: { width: 56, height: 56, borderRadius: RADIUS.full, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  onlineDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.white },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 4 },
  priceText: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 4 },
  chatBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 4, borderRadius: RADIUS.md, ...SHADOWS.sm },
  chatBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
});