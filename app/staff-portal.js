import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

const ROLES = [
  { id: 'pharmacist', label: 'Apoteker', icon: 'medkit', color: COLORS.primary, actions: ['Verifikasi Resep', 'Cek Interaksi Obat', 'Validasi Dosis'] },
  { id: 'cashier', label: 'Kasir', icon: 'card', color: COLORS.secondary, actions: ['Proses Pembayaran', 'Cetak Struk', 'Refund'] },
  { id: 'manager', label: 'Manager', icon: 'briefcase', color: '#8B5CF6', actions: ['Laporan Harian', 'Stok Opname', 'Performa Staff'] },
  { id: 'courier', label: 'Kurir', icon: 'bicycle', color: COLORS.success, actions: ['Ambil Pesanan', 'Update Lokasi', 'Konfirmasi Terkirim'] },
  { id: 'admin', label: 'Admin', icon: 'shield-checkmark', color: COLORS.danger, actions: ['Kelola User', 'Audit Log', 'System Config'] },
];

export default function StaffPortalScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleAction = async (role, action) => {
    const log = { role: role.label, action, timestamp: new Date().toISOString() };
    const prev = (await getData(KEYS.STAFF_ACTIONS)) || [];
    await setData(KEYS.STAFF_ACTIONS, [...prev, log]);
    Alert.alert(`${role.label}`, `Aksi "${action}" berhasil dijalankan.\n\n(Simulasi — log tersimpan lokal)`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Staff Portal</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      {!selectedRole ? (
        <FlatList
          data={ROLES}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: SPACING.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.roleCard} onPress={() => setSelectedRole(item)}>
              <View style={[styles.roleIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                <Text style={styles.roleLabel}>{item.label}</Text>
                <Text style={styles.roleActions}>{item.actions.length} aksi tersedia</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={{ flex: 1, padding: SPACING.lg }}>
          <TouchableOpacity onPress={() => setSelectedRole(null)} style={styles.backRole}>
            <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
            <Text style={styles.backRoleText}>Kembali ke daftar role</Text>
          </TouchableOpacity>
          <Text style={[FONTS.h2, { marginBottom: SPACING.md }]}>{selectedRole.label}</Text>
          {selectedRole.actions.map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionCard} onPress={() => handleAction(selectedRole, action)}>
              <LinearGradient colors={[selectedRole.color, selectedRole.color + 'CC']} style={styles.actionIcon}>
                <Ionicons name="play" size={18} color={COLORS.white} />
              </LinearGradient>
              <Text style={styles.actionLabel}>{action}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  roleIcon: { width: 52, height: 52, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center' },
  roleLabel: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  roleActions: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  backRole: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  backRoleText: { color: COLORS.primary, fontWeight: '600', marginLeft: 4, fontSize: 14 },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.sm },
  actionIcon: { width: 36, height: 36, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  actionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.text },
});
