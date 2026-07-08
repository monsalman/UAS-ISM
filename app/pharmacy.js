import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';

const PHARMACIES = [
  { id: '1', name: 'Apotek Kimia Farma Juanda', address: 'Jl. Ir. H. Juanda No.30, Jakarta Pusat', distance: '1.2 km', phone: '021-3844444', hours: 'Buka 24 Jam' },
  { id: '2', name: 'Apotek Kimia Farma Matraman', address: 'Jl. Matraman Raya No.100, Jakarta Timur', distance: '3.5 km', phone: '021-8581111', hours: 'Buka 24 Jam' },
  { id: '3', name: 'Apotek Kimia Farma Kebayoran', address: 'Jl. Kebayoran Baru No.15, Jakarta Selatan', distance: '4.8 km', phone: '021-7202222', hours: '07:00 - 22:00' },
];

export default function PharmacyFinderScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleCall = (p) => {
    Alert.alert('Hubungi Apotek', `Menghubungi ${p.name} di nomor ${p.phone}...`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cari Apotek</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textLight} />
          <TextInput style={styles.searchInput} placeholder="Cari apotek terdekat..." placeholderTextColor={COLORS.textLight} value={search} onChangeText={setSearch} />
        </View>
      </LinearGradient>

      <FlatList
        data={PHARMACIES.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{item.distance}</Text>
              </View>
            </View>
            <Text style={styles.cardAddress}>{item.address}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={14} color={COLORS.primary} />
              <Text style={styles.metaText}>{item.hours}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => handleCall(item)}>
                <Ionicons name="call" size={16} color={COLORS.primary} />
                <Text style={styles.actionText}>Telepon</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={() => router.push({ pathname: '/inventory', params: { pharmacy: item.name } })}>
                <Ionicons name="cube-outline" size={16} color={COLORS.white} />
                <Text style={[styles.actionText, { color: COLORS.white }]}>Cek Stok</Text>
              </TouchableOpacity>
            </View>
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
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, marginTop: SPACING.md, ...SHADOWS.sm },
  searchInput: { flex: 1, paddingVertical: 12, paddingLeft: SPACING.xs, fontSize: 14 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: SPACING.sm },
  distanceBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  distanceText: { color: COLORS.primary, fontSize: 11, fontWeight: '700' },
  cardAddress: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  metaText: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 4, fontWeight: '500' },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.sm },
  actionRow: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: SPACING.sm },
  actionBtnPrimary: { backgroundColor: COLORS.primary },
  actionText: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginLeft: 4 },
});