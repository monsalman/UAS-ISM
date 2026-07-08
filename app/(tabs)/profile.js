import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { DEFAULT_PROFILE, MEDICINES } from '../../constants/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS, setData } from '../../utils/storage';

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'Edit Profil', color: '#2196F3', bg: '#E3F2FD', route: null },
  { icon: 'receipt-outline', label: 'Riwayat Pesanan', color: '#FF6B35', bg: '#FFF3E0', route: '/orders' },
  { icon: 'settings-outline', label: 'Pengaturan', color: '#64748B', bg: '#F1F5F9', route: null },
  { icon: 'help-circle-outline', label: 'Bantuan & FAQ', color: '#10B981', bg: '#D1FAE5', route: null },
  { icon: 'information-circle-outline', label: 'Tentang KF-DHE', color: '#8B5CF6', bg: '#EDE9FE', route: null },
];

export default function ProfileScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const profile = DEFAULT_PROFILE;

  const clearAllData = () => {
    Alert.alert('Reset Data', 'Hapus semua data lokal? (untuk demo)', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: async () => {
        await AsyncStorage.clear();
        Alert.alert('Done', 'Semua data lokal telah direset.');
      }},
    ]);
  };

  const seedDemoData = async () => {
    const reminders = [
      { id: '1', name: 'Paracetamol 500mg', dosage: '1 tablet', time: '08:00', active: true, takenToday: false },
      { id: '2', name: 'Vitamin C 1000mg', dosage: '1 tablet', time: '12:00', active: true, takenToday: false },
      { id: '3', name: 'Amoxicillin 500mg', dosage: '1 kapsul', time: '20:00', active: true, takenToday: false },
    ];
    const orders = [
      { id: 'o1', items: [{ name: 'Paracetamol 500mg', qty: 2, price: 5500 }], total: 11000, date: new Date(Date.now() - 86400000).toISOString() },
      { id: 'o2', items: [{ name: 'Vitamin C 1000mg', qty: 1, price: 15000 }, { name: 'Promag Tablet', qty: 3, price: 4000 }], total: 27000, date: new Date().toISOString() },
    ];
    await setData(KEYS.REMINDERS, reminders);
    await setData(KEYS.ORDERS, orders);
    Alert.alert('Data Demo Terisi', 'Reminder dan riwayat pesanan telah diisi dengan data contoh.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBarHeight + SPACING.lg }}>
        {/* Gradient Header */}
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
          <LinearGradient colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']} style={styles.profileCard}>
            <LinearGradient colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']} style={styles.avatarLarge}>
              <Ionicons name="person-outline" size={36} color={COLORS.white} />
            </LinearGradient>
            <Text style={styles.profileName}>{profile.name}</Text>
            <View style={styles.profileContactRow}>
              <View style={styles.contactChip}>
                <Ionicons name="mail-outline" size={13} color={COLORS.white} />
                <Text style={styles.contactText}>{profile.email}</Text>
              </View>
            </View>
            <View style={styles.contactChip}>
              <Ionicons name="call-outline" size={13} color={COLORS.white} />
              <Text style={styles.contactText}>{profile.phone}</Text>
            </View>
          </LinearGradient>
        </LinearGradient>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={[styles.menuRow, i < MENU_ITEMS.length - 1 && styles.menuBorder]} onPress={() => item.route && router.push(item.route)}>
              <View style={[styles.menuIconWrap, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={[FONTS.medium, { flex: 1, marginLeft: SPACING.sm, fontSize: 15 }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={seedDemoData}>
            <LinearGradient colors={COLORS.gradient.secondary} style={styles.actionGrad}>
              <Ionicons name="flash" size={18} color={COLORS.white} />
              <Text style={styles.actionText}>Seed Data Demo</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={clearAllData}>
            <View style={[styles.actionGrad, { backgroundColor: COLORS.dangerLight, borderRadius: RADIUS.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md }]}>
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              <Text style={[styles.actionText, { color: COLORS.danger }]}>Reset Data</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[FONTS.caption, { textAlign: 'center', marginTop: SPACING.md, marginBottom: SPACING.xxl }]}>KF-DHE MVP v1.0 • Local-First Demo</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerGrad: { paddingBottom: SPACING.xl, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  profileCard: { alignItems: 'center', margin: SPACING.lg, borderRadius: RADIUS.xl, padding: SPACING.xl, ...SHADOWS.md },
  avatarLarge: { width: 88, height: 88, borderRadius: RADIUS.full, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  profileName: { color: COLORS.white, fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  profileContactRow: { flexDirection: 'row', marginTop: SPACING.sm, flexWrap: 'wrap', justifyContent: 'center' },
  contactChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: SPACING.sm + 2, paddingVertical: SPACING.xs + 2, borderRadius: RADIUS.full, marginBottom: SPACING.xs },
  contactText: { color: COLORS.white, fontSize: 12, marginLeft: 4, fontWeight: '500' },
  menuCard: { backgroundColor: COLORS.white, marginHorizontal: SPACING.lg, marginTop: -SPACING.lg, borderRadius: RADIUS.xl, ...SHADOWS.md },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md + 2 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIconWrap: { width: 38, height: 38, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  actionRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, marginTop: SPACING.md, gap: SPACING.sm },
  actionBtn: { flex: 1 },
  actionGrad: { borderRadius: RADIUS.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md },
  actionText: { color: COLORS.white, fontWeight: '600', fontSize: 13, marginLeft: SPACING.xs },
});
