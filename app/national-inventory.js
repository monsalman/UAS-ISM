import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';

const NETWORK = [
  { pharmacy: 'KF Juanda, Jakarta', stock: { 'Paracetamol': 150, 'Amoxicillin': 80, 'Vitamin C': 200 } },
  { pharmacy: 'KF Matraman, Jakarta', stock: { 'Paracetamol': 45, 'Amoxicillin': 120, 'Vitamin C': 30 } },
  { pharmacy: 'KF Kebayoran, Jakarta', stock: { 'Paracetamol': 200, 'Amoxicillin': 0, 'Vitamin C': 180 } },
  { pharmacy: 'KF Dago, Bandung', stock: { 'Paracetamol': 90, 'Amoxicillin': 60, 'Vitamin C': 150 } },
  { pharmacy: 'KF Tunjungan, Surabaya', stock: { 'Paracetamol': 300, 'Amoxicillin': 200, 'Vitamin C': 250 } },
];

export default function NationalInventoryScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const medicines = ['Paracetamol', 'Amoxicillin', 'Vitamin C'];
  const filtered = search ? medicines.filter(m => m.toLowerCase().includes(search.toLowerCase())) : medicines;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inventori Nasional</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textLight} />
          <TextInput style={styles.searchInput} placeholder="Cari obat..." placeholderTextColor={COLORS.textLight} value={search} onChangeText={setSearch} />
        </View>
      </LinearGradient>

      <FlatList
        data={filtered}
        keyExtractor={i => i}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item: med }) => (
          <View style={styles.card}>
            <Text style={styles.medName}>{med}</Text>
            <Text style={styles.totalStock}>Total Nasional: {NETWORK.reduce((s, n) => s + (n.stock[med] || 0), 0)} pcs</Text>
            {NETWORK.map((n, i) => {
              const qty = n.stock[med] || 0;
              return (
                <View key={i} style={styles.row}>
                  <Text style={styles.pharmacyName}>{n.pharmacy}</Text>
                  <View style={[styles.stockBadge, { backgroundColor: qty > 50 ? COLORS.successLight : qty > 0 ? COLORS.warningLight : COLORS.dangerLight }]}>
                    <Text style={[styles.stockText, { color: qty > 50 ? COLORS.success : qty > 0 ? COLORS.warning : COLORS.danger }]}>
                      {qty > 0 ? `${qty} pcs` : 'Habis'}
                    </Text>
                  </View>
                </View>
              );
            })}
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
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, marginTop: SPACING.md, ...SHADOWS.sm },
  searchInput: { flex: 1, paddingVertical: 12, paddingLeft: SPACING.xs, fontSize: 14 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.md },
  medName: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  totalStock: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: SPACING.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderTopWidth: 1, borderTopColor: COLORS.border },
  pharmacyName: { fontSize: 13, color: COLORS.textSecondary, flex: 1 },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm },
  stockText: { fontSize: 11, fontWeight: '700' },
});
