import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { MEDICINES, CATEGORIES } from '../../constants/mockData';
import { getData, setData, KEYS } from '../../utils/storage';

const { width } = Dimensions.get('window');

const CAT_ICONS = {
  Semua: 'apps',
  Analgesik: 'fitness',
  Vitamin: 'flask',
  Lambung: 'restaurant',
  Antibiotik: 'medkit',
  Antihistamin: 'flower',
  Herbal: 'leaf',
  'Batuk & Flu': 'thermometer',
  Pencernaan: 'nutrition',
  Kortikosteroid: 'shield-checkmark',
  Lainnya: 'ellipsis-horizontal',
};

export default function MedicinesScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [cart, setCart] = useState([]);

  const filtered = MEDICINES.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Semua' || m.category === category;
    return matchSearch && matchCat;
  });

  const addToCart = async (med) => {
    const existing = cart.find(c => c.id === med.id);
    let updated;
    if (existing) {
      updated = cart.map(c => c.id === med.id ? { ...c, qty: c.qty + 1 } : c);
    } else {
      updated = [...cart, { ...med, qty: 1 }];
    }
    setCart(updated);
    await setData(KEYS.CART, updated);
  };

  const checkout = async () => {
    if (cart.length === 0) return Alert.alert('Keranjang Kosong', 'Tambahkan obat terlebih dahulu');
    const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    Alert.alert(
      'Checkout Berhasil',
      `Total: Rp${total.toLocaleString('id-ID')}\n${cart.length} item telah dipesan.\n\n(Simulasi — data disimpan lokal)`,
      [{ text: 'OK' }]
    );
    const order = { id: Date.now().toString(), items: cart, total, date: new Date().toISOString() };
    const orders = (await getData(KEYS.ORDERS)) || [];
    await setData(KEYS.ORDERS, [...orders, order]);
    setCart([]);
    await setData(KEYS.CART, []);
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <View style={styles.container}>
        {/* Gradient Header */}
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Katalog Obat</Text>
            <View style={styles.cartIcon}>
              <Ionicons name="cart" size={20} color={COLORS.white} />
              {cartCount > 0 && <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>}
            </View>
          </View>
          {/* Search */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={COLORS.textLight} />
            <TextInput style={styles.searchInput} placeholder="Cari obat..." placeholderTextColor={COLORS.textLight} value={search} onChangeText={setSearch} />
          </View>
        </LinearGradient>

        {/* Categories */}
        <View style={{ height: 50 }}>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingHorizontal: SPACING.md, alignItems: 'center' }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.catChip, category === item && styles.catChipActive]}
                onPress={() => setCategory(item)}
              >
                <Ionicons name={CAT_ICONS[item]} size={16} color={category === item ? COLORS.white : COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={[styles.catText, category === item && styles.catTextActive]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Medicine List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.medCard}>
              <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.medIconWrap}>
                <Ionicons name={item.icon} size={26} color={COLORS.primary} />
              </LinearGradient>
              <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                <Text style={[FONTS.medium, { fontSize: 15 }]}>{item.name}</Text>
                <Text style={[FONTS.caption, { fontSize: 11 }]}>{item.desc}</Text>
                <Text style={[styles.priceText]}>Rp{item.price.toLocaleString('id-ID')}</Text>
              </View>
              <TouchableOpacity style={styles.addCartBtn} onPress={() => addToCart(item)}>
                <Ionicons name="add" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Cart Bar */}
        {cart.length > 0 && (
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={[styles.cartBar, { bottom: tabBarHeight }]}>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{cartCount} item dipilih</Text>
              <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: '800' }}>Rp{cartTotal.toLocaleString('id-ID')}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={checkout}>
              <Text style={styles.checkoutText}>Checkout</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGrad: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  headerTitle: { color: COLORS.white, fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  cartIcon: { width: 40, height: 40, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.danger, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, marginTop: SPACING.xs, ...SHADOWS.sm },
  searchInput: { flex: 1, paddingVertical: 12, paddingLeft: SPACING.xs, fontSize: 14 },
  catChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full, backgroundColor: COLORS.white, marginRight: SPACING.xs, ...SHADOWS.sm },
  catChipActive: { backgroundColor: COLORS.primary },
  catText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  catTextActive: { color: COLORS.white },
  medCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  medIconWrap: { width: 52, height: 52, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  priceText: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: 2 },
  addCartBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOWS.sm },
  cartBar: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, ...SHADOWS.lg },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm + 2, borderRadius: RADIUS.lg, ...SHADOWS.md },
  checkoutText: { color: COLORS.primary, fontWeight: '700', marginRight: SPACING.xs, fontSize: 15 },
});
