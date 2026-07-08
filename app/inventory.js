import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { MEDICINES } from '../constants/mockData';

export default function InventoryScreen() {
  const router = useRouter();
  const { pharmacy = 'Apotek Kimia Farma Juanda' } = useLocalSearchParams();
  const [search, setSearch] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: SPACING.sm }}>
            <Text style={styles.headerTitle}>Stok Apotek</Text>
            <Text style={styles.headerSub} numberOfLines={1}>{pharmacy}</Text>
          </View>
        </View>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textLight} />
          <TextInput style={styles.searchInput} placeholder="Cari obat di apotek ini..." placeholderTextColor={COLORS.textLight} value={search} onChangeText={setSearch} />
        </View>
      </LinearGradient>

      <FlatList
        data={MEDICINES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => {
          const isAvailable = item.stock > 80;
          return (
            <View style={styles.card}>
              <Text style={{ fontSize: 28 }}>{item.image}</Text>
              <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                <Text style={[FONTS.medium, { fontSize: 15 }]}>{item.name}</Text>
                <Text style={FONTS.caption}>{item.category}</Text>
                <View style={styles.stockRow}>
                  <View style={[styles.statusDot, { backgroundColor: isAvailable ? COLORS.success : COLORS.warning }]} />
                  <Text style={[styles.stockText, { color: isAvailable ? COLORS.success : COLORS.warning }]}>
                    {isAvailable ? 'Stok Tersedia' : 'Stok Terbatas'} ({item.stock} pcs)
                  </Text>
                </View>
              </View>
              <Text style={styles.priceText}>Rp{item.price.toLocaleString('id-ID')}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerGrad: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, marginTop: SPACING.md, ...SHADOWS.sm },
  searchInput: { flex: 1, paddingVertical: 12, paddingLeft: SPACING.xs, fontSize: 14 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  stockRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  stockText: { fontSize: 12, fontWeight: '600' },
  priceText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});