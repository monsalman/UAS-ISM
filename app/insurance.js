import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

export default function InsuranceScreen() {
  const router = useRouter();
  const [policies, setPolicies] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [provider, setProvider] = useState('');
  const [policyNo, setPolicyNo] = useState('');

  useFocusEffect(useCallback(() => {
    (async () => {
      let data = await getData(KEYS.INSURANCE);
      if (!data || data.length === 0) {
        data = [
          { id: '1', provider: 'BPJS Kesehatan', policyNo: '0001234567890', status: 'active', coverage: 'Rawat Jalan & Inap' },
          { id: '2', provider: 'Prudential', policyNo: 'PRU-2026-001', status: 'active', coverage: 'Rawat Inap + Obat' },
        ];
        await setData(KEYS.INSURANCE, data);
      }
      setPolicies(data);
    })();
  }, []));

  const addPolicy = async () => {
    if (!provider.trim() || !policyNo.trim()) return Alert.alert('Error', 'Isi semua field');
    const policy = { id: Date.now().toString(), provider: provider.trim(), policyNo: policyNo.trim(), status: 'active', coverage: 'Sesuai polis' };
    const updated = [...policies, policy];
    setPolicies(updated);
    await setData(KEYS.INSURANCE, updated);
    setProvider(''); setPolicyNo(''); setShowAdd(false);
  };

  const deletePolicy = async (id) => {
    const updated = policies.filter(p => p.id !== id);
    setPolicies(updated);
    await setData(KEYS.INSURANCE, updated);
  };

  const claimInsurance = (policy) => {
    Alert.alert('Klaim Asuransi', `Mengajukan klaim ke ${policy.provider}...\n\nNo. Polis: ${policy.policyNo}\n\n(Simulasi — klaim akan diproses 1-3 hari kerja)`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Asuransi</Text>
          <TouchableOpacity onPress={() => setShowAdd(!showAdd)} style={styles.backBtn}>
            <Ionicons name={showAdd ? 'close' : 'add'} size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {showAdd && (
        <View style={styles.addForm}>
          <TextInput style={styles.input} placeholder="Nama asuransi (BPJS, Prudential, dll)" value={provider} onChangeText={setProvider} />
          <TextInput style={styles.input} placeholder="Nomor polis" value={policyNo} onChangeText={setPolicyNo} />
          <TouchableOpacity onPress={addPolicy}>
            <LinearGradient colors={COLORS.gradient.primary} style={styles.saveBtn}>
              <Text style={styles.saveText}>Tambah Polis</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={policies}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.providerName}>{item.provider}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? COLORS.successLight : COLORS.dangerLight }]}>
                <Text style={[styles.statusText, { color: item.status === 'active' ? COLORS.success : COLORS.danger }]}>{item.status === 'active' ? 'Aktif' : 'Nonaktif'}</Text>
              </View>
            </View>
            <Text style={styles.policyNo}>No. Polis: {item.policyNo}</Text>
            <Text style={styles.coverage}>Cakupan: {item.coverage}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => deletePolicy(item.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteText}>Hapus</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => claimInsurance(item)} style={{ flex: 1 }}>
                <LinearGradient colors={COLORS.gradient.primary} style={styles.claimBtn}>
                  <Text style={styles.claimText}>Ajukan Klaim</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
  addForm: { backgroundColor: COLORS.white, margin: SPACING.lg, borderRadius: RADIUS.lg, padding: SPACING.md, ...SHADOWS.md },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, fontSize: 14 },
  saveBtn: { borderRadius: RADIUS.lg, padding: SPACING.sm + 2, alignItems: 'center' },
  saveText: { color: COLORS.white, fontWeight: '700' },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  providerName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  statusText: { fontSize: 11, fontWeight: '700' },
  policyNo: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  coverage: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  actionRow: { flexDirection: 'row', marginTop: SPACING.md, gap: SPACING.sm },
  deleteBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.danger, borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center' },
  deleteText: { color: COLORS.danger, fontWeight: '700' },
  claimBtn: { borderRadius: RADIUS.lg, padding: SPACING.sm, alignItems: 'center' },
  claimText: { color: COLORS.white, fontWeight: '700' },
});
