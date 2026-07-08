import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../constants/theme';

export default function UploadPrescriptionScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const prescriptions = [
    { id: '1', label: 'Resep Dokter Umum', image: 'document-text-outline', desc: 'Dokter praktik umum & klinik' },
    { id: '2', label: 'Resep Dokter Spesialis', image: 'pulse-outline', desc: 'Dokter dengan keahlian khusus' },
    { id: '3', label: 'Resep Dokter Gigi', image: 'medical-outline', desc: 'Perawatan gigi & mulut' },
  ];

  const handleUpload = () => {
    if (!selected) return Alert.alert('Pilih Tipe Resep', 'Tap salah satu tipe resep di atas');
    Alert.alert(
      'Resep Terupload',
      `Resep "${prescriptions.find(p => p.id === selected).label}" berhasil diupload.\n\n(Simulasi demo — file tidak benar-benar dikirim)`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      {/* Gradient Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Resep</Text>
          <View style={{ width: 36 }} />
        </View>
      </LinearGradient>

      {/* Upload Area */}
      <LinearGradient colors={['#E8F5E9', '#F0FFF4']} style={styles.uploadArea}>
        <View style={styles.uploadIconWrap}>
          <Ionicons name="cloud-upload-outline" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.uploadTitle}>Upload Foto Resep</Text>
        <Text style={styles.uploadSub}>Format: JPG, PNG (maks 5MB)</Text>
        <TouchableOpacity style={styles.uploadBtn}>
          <LinearGradient colors={COLORS.gradient.primary} style={styles.uploadBtnGrad}>
            <Ionicons name="camera" size={18} color={COLORS.white} />
            <Text style={styles.uploadBtnText}>Ambil Foto / Pilih File</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      {/* Prescription Types */}
      <Text style={styles.sectionTitle}>Tipe Resep</Text>
      {prescriptions.map(p => (
        <TouchableOpacity
          key={p.id}
          style={[styles.typeCard, selected === p.id && styles.typeCardActive]}
          onPress={() => setSelected(p.id)}
        >
          <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.typeIconWrap}>
            <Ionicons name={p.image} size={24} color={COLORS.primary} />
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: SPACING.sm }}>
            <Text style={[FONTS.medium, { fontSize: 15 }]}>{p.label}</Text>
            <Text style={FONTS.caption}>{p.desc}</Text>
          </View>
          <View style={[styles.radio, selected === p.id && styles.radioActive]}>
            {selected === p.id && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
      ))}

      {/* Submit */}
      <LinearGradient colors={COLORS.gradient.primary} style={styles.submitBtn}>
        <TouchableOpacity onPress={handleUpload} style={styles.submitInner}>
          <Text style={styles.submitText}>Upload Resep</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerGrad: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  backBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  uploadArea: { alignItems: 'center', margin: SPACING.lg, borderRadius: RADIUS.xl, padding: SPACING.xl, borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed', ...SHADOWS.md },
  uploadIconWrap: { width: 72, height: 72, borderRadius: RADIUS.full, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm, ...SHADOWS.sm },
  uploadTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  uploadSub: { fontSize: 12, color: COLORS.textSecondary, marginBottom: SPACING.md },
  uploadBtn: { borderRadius: RADIUS.full, overflow: 'hidden', ...SHADOWS.md },
  uploadBtnGrad: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 4 },
  uploadBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 14, marginLeft: SPACING.xs },
  sectionTitle: { ...FONTS.h3, paddingHorizontal: SPACING.lg, marginBottom: SPACING.sm },
  typeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: SPACING.lg, marginBottom: SPACING.sm, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1.5, borderColor: COLORS.border, ...SHADOWS.sm },
  typeCardActive: { borderColor: COLORS.primary, backgroundColor: '#F0FFF4' },
  typeIconWrap: { width: 48, height: 48, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  radio: { width: 22, height: 22, borderRadius: RADIUS.full, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  submitBtn: { marginHorizontal: SPACING.lg, marginTop: SPACING.md, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.lg },
  submitInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md },
  submitText: { color: COLORS.white, fontWeight: '700', fontSize: 16, marginRight: SPACING.xs },
});
