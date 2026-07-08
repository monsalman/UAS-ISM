import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';
import { getData, setData, KEYS } from '../utils/storage';

export default function FamilyAccountScreen() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');

  useFocusEffect(useCallback(() => {
    (async () => {
      let data = await getData(KEYS.FAMILY);
      if (!data || data.length === 0) {
        data = [
          { id: '1', name: 'Salman', relation: 'Saya', healthScore: 78 },
          { id: '2', name: 'Aisyah', relation: 'Istri', healthScore: 85 },
          { id: '3', name: 'Ahmad', relation: 'Anak', healthScore: 92 },
        ];
        await setData(KEYS.FAMILY, data);
      }
      setMembers(data);
    })();
  }, []));

  const addMember = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Nama harus diisi');
    const member = { id: Date.now().toString(), name: name.trim(), relation: relation.trim() || 'Anggota', healthScore: Math.floor(Math.random() * 30) + 70 };
    const updated = [...members, member];
    setMembers(updated);
    await setData(KEYS.FAMILY, updated);
    setName(''); setRelation(''); setShowAdd(false);
  };

  const deleteMember = async (id) => {
    if (id === '1') return Alert.alert('Tidak bisa', 'Akun utama tidak bisa dihapus');
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    await setData(KEYS.FAMILY, updated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Akun Keluarga</Text>
          <TouchableOpacity onPress={() => setShowAdd(!showAdd)} style={styles.backBtn}>
            <Ionicons name={showAdd ? 'close' : 'add'} size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {showAdd && (
        <View style={styles.addForm}>
          <TextInput style={styles.input} placeholder="Nama anggota" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Hubungan (Istri/Anak/Orang Tua)" value={relation} onChangeText={setRelation} />
          <TouchableOpacity onPress={addMember}>
            <LinearGradient colors={COLORS.gradient.primary} style={styles.saveBtn}>
              <Text style={styles.saveText}>Tambah Anggota</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={members}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: SPACING.lg }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: SPACING.sm }}>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberRelation}>{item.relation}</Text>
            </View>
            <View style={styles.scoreWrap}>
              <Text style={styles.scoreVal}>{item.healthScore}</Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>
            {item.id !== '1' && (
              <TouchableOpacity onPress={() => deleteMember(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
              </TouchableOpacity>
            )}
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  avatar: { width: 48, height: 48, borderRadius: RADIUS.full, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  memberName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  memberRelation: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  scoreWrap: { alignItems: 'center', marginRight: SPACING.sm },
  scoreVal: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
  scoreLabel: { fontSize: 10, color: COLORS.textLight },
  deleteBtn: { width: 32, height: 32, borderRadius: RADIUS.full, backgroundColor: COLORS.dangerLight, justifyContent: 'center', alignItems: 'center' },
});
