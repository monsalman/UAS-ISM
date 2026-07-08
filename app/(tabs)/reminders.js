import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFocusEffect } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { getData, setData, KEYS } from '../../utils/storage';
import { scheduleReminderNotification, cancelReminderNotification, requestNotificationPermission } from '../../utils/notifications';

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');

  const load = async () => {
    const data = await getData(KEYS.REMINDERS);
    setReminders(data || []);
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const addReminder = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Nama obat harus diisi');
    const newReminder = {
      id: Date.now().toString(),
      name: name.trim(),
      dosage: dosage.trim() || '1 tablet',
      time,
      active: true,
      takenToday: false,
    };
    const updated = [...reminders, newReminder];
    await setData(KEYS.REMINDERS, updated);
    setReminders(updated);
    setName(''); setDosage(''); setTime('08:00');
    setShowAdd(false);
    const permitted = await requestNotificationPermission();
    if (permitted) await scheduleReminderNotification(newReminder);
  };

  const toggleTaken = async (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, takenToday: !r.takenToday } : r);
    await setData(KEYS.REMINDERS, updated);
    setReminders(updated);
  };

  const deleteReminder = async (id) => {
    await cancelReminderNotification(id);
    const updated = reminders.filter(r => r.id !== id);
    await setData(KEYS.REMINDERS, updated);
    setReminders(updated);
  };

  const activeCount = reminders.filter(r => !r.takenToday).length;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      {/* Gradient Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Pengingat Obat</Text>
            <Text style={styles.headerSub}>{activeCount} pending hari ini</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(!showAdd)}>
            <Ionicons name={showAdd ? 'close' : 'add'} size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Add Form */}
      {showAdd && (
        <BlurView intensity={98} tint="light" style={styles.blurOverlay}>
          <View style={styles.addForm}>
            <Text style={[FONTS.h3, { marginBottom: SPACING.sm }]}>Tambah Pengingat</Text>
            <TextInput style={styles.input} placeholder="Nama obat" placeholderTextColor={COLORS.textLight} value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Dosis (cth: 1 tablet)" placeholderTextColor={COLORS.textLight} value={dosage} onChangeText={setDosage} />
            <TextInput style={styles.input} placeholder="Waktu (cth: 08:00)" placeholderTextColor={COLORS.textLight} value={time} onChangeText={setTime} />
            <LinearGradient colors={COLORS.gradient.primary} style={styles.saveBtn}>
              <TouchableOpacity onPress={addReminder} style={{ width: '100%', alignItems: 'center', paddingVertical: SPACING.sm }}>
                <Text style={styles.saveBtnText}>Simpan Pengingat</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </BlurView>
      )}

      {/* List */}
      {reminders.length === 0 ? (
        <View style={styles.empty}>
          <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.emptyIconWrap}>
            <Ionicons name="alarm" size={40} color={COLORS.primary} />
          </LinearGradient>
          <Text style={[FONTS.h3, { color: COLORS.textSecondary, marginTop: SPACING.md }]}>Belum Ada Pengingat</Text>
          <Text style={FONTS.caption}>Tap + untuk menambahkan pengingat obat</Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={[styles.card, item.takenToday && styles.cardTaken]}>
              <LinearGradient colors={item.takenToday ? ['#10B981', '#059669'] : ['#E8F5E9', '#C8E6C9']} style={[styles.checkBtn]}>
                <TouchableOpacity onPress={() => toggleTaken(item.id)} style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name={item.takenToday ? 'checkmark' : 'time-outline'} size={22} color={item.takenToday ? COLORS.white : COLORS.primary} />
                </TouchableOpacity>
              </LinearGradient>
              <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                <Text style={[styles.medName, item.takenToday && styles.textDone]}>{item.name}</Text>
                <Text style={styles.medDetail}>{item.dosage} • {item.time}</Text>
                {!item.takenToday && (
                  <View style={styles.statusPending}>
                    <View style={styles.dot} />
                    <Text style={styles.statusText}>Belum diminum</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteReminder(item.id)}>
                <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerGrad: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  headerTitle: { color: COLORS.white, fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  blurOverlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: 140, paddingBottom: SPACING.md, paddingHorizontal: SPACING.md },
  addForm: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOWS.lg },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, fontSize: 14, backgroundColor: COLORS.background },
  saveBtn: { borderRadius: RADIUS.lg, overflow: 'hidden', marginTop: SPACING.xs },
  saveBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIconWrap: { width: 80, height: 80, borderRadius: RADIUS.full, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.md },
  cardTaken: { opacity: 0.6 },
  checkBtn: { width: 44, height: 44, borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  medName: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  textDone: { textDecorationLine: 'line-through', color: COLORS.textLight },
  medDetail: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statusPending: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.warning, marginRight: 4 },
  statusText: { fontSize: 11, color: COLORS.warning, fontWeight: '500' },
  deleteBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: COLORS.dangerLight, justifyContent: 'center', alignItems: 'center', marginLeft: SPACING.xs },
});
