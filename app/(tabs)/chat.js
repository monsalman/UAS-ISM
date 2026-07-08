import { useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../../constants/theme';
import { getData, setData, KEYS } from '../../utils/storage';

const SYSTEM_PROMPT = `Kamu adalah KAI (Kimia Farma AI Assistant), asisten kesehatan virtual milik Kimia Farma.

Aturan:
- Jawab dalam Bahasa Indonesia yang ramah dan profesional.
- Kamu TIDAK boleh mendiagnosis penyakit. Selalu sarankan konsultasi ke dokter untuk keluhan serius.
- Kamu bisa memberikan informasi umum tentang obat (kegunaan, dosis umum, efek samping umum).
- Jika ditanya tentang interaksi obat, berikan peringatan dan sarankan konsultasi apoteker.
- Jika mendeteksi gejala darurat (nyeri dada hebat, sesak napas berat, dll), segera arahkan ke 119 atau IGD terdekat.
- Selalu tambahkan disclaimer bahwa informasi bukan pengganti konsultasi medis profesional.
- Kamu juga bisa menjawab FAQ tentang layanan Kimia Farma (lokasi, jam buka, layanan tersedia).`;

const WELCOME = 'Halo! Saya KAI, asisten kesehatan Kimia Farma.\n\nSaya bisa membantu Anda dengan:\n• Informasi obat & dosis\n• Cek interaksi obat\n• FAQ layanan Kimia Farma\n• Pengingat minum obat\n\nAda yang bisa saya bantu?';

export default function ChatScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useFocusEffect(useCallback(() => {
    (async () => {
      const saved = await getData(KEYS.CHAT_HISTORY);
      if (saved?.length) setMessages(saved);
      else setMessages([{ id: '0', role: 'assistant', content: WELCOME }]);
    })();
  }, []));

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const API_KEY = process.env.EXPO_PUBLIC_LLM_API_KEY || 'your-api-key-here';
      const BASE_URL = process.env.EXPO_PUBLIC_LLM_BASE_URL || 'https://api.openai.com/v1';
      const MODEL = process.env.EXPO_PUBLIC_LLM_MODEL || 'gpt-4o-mini';

      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...updated.filter(m => m.id !== '0').map(m => ({ role: m.role, content: m.content })),
      ];

      const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
        body: JSON.stringify({ model: MODEL, messages: apiMessages, max_tokens: 1024, temperature: 0.7, stream: false }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa memproses permintaan saat ini.';
      const assistantMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: reply };
      const final = [...updated, assistantMsg];
      setMessages(final);
      await setData(KEYS.CHAT_HISTORY, final);
    } catch (e) {
      const errMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: `Gagal terhubung ke AI.\n\nPastikan API Key dan Base URL sudah dikonfigurasi di file .env\n\nError: ${e.message}` };
      const final = [...updated, errMsg];
      setMessages(final);
    }
    setLoading(false);
  };

  const clearChat = async () => {
    const initial = [{ id: '0', role: 'assistant', content: 'Chat direset. Ada yang bisa saya bantu?' }];
    setMessages(initial);
    await setData(KEYS.CHAT_HISTORY, initial);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: COLORS.primary }} />
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.headerGrad}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={styles.avatar}>
              <Ionicons name="hardware-chip-outline" size={20} color={COLORS.white} />
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>KAI Assistant</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.resetBtn} onPress={clearChat}>
            <Ionicons name="refresh" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: SPACING.sm }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.bubbleWrap, item.role === 'user' ? styles.userWrap : styles.aiWrap]}>
            <LinearGradient
              colors={item.role === 'user' ? COLORS.gradient.primary : [COLORS.white, COLORS.white]}
              style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}
            >
              <Text style={[styles.bubbleText, item.role === 'user' && { color: COLORS.white }]}>{item.content}</Text>
            </LinearGradient>
          </View>
        )}
      />

      {loading && (
        <View style={styles.typingRow}>
          <View style={styles.typingDots}>
            <View style={[styles.dotPulse, { animationDelay: '0s' }]} />
            <View style={[styles.dotPulse, { animationDelay: '0.2s' }]} />
            <View style={[styles.dotPulse, { animationDelay: '0.4s' }]} />
          </View>
          <Text style={[FONTS.caption, { marginLeft: SPACING.sm }]}>KAI sedang mengetik...</Text>
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ marginBottom: tabBarHeight }}>
        <View style={styles.inputRow}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="Tanya KAI..."
              placeholderTextColor={COLORS.textLight}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity style={[styles.sendBtn, (!input.trim() || loading) && { opacity: 0.5 }]} onPress={sendMessage} disabled={!input.trim() || loading}>
            <LinearGradient colors={COLORS.gradient.primary} style={styles.sendGrad}>
              <Ionicons name="send" size={20} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerGrad: { paddingBottom: SPACING.md, borderBottomLeftRadius: RADIUS.xxl, borderBottomRightRadius: RADIUS.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: RADIUS.full, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#4ADE80', marginRight: 4 },
  statusText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '500' },
  resetBtn: { width: 36, height: 36, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  bubbleWrap: { flexDirection: 'row', marginBottom: SPACING.sm },
  userWrap: { justifyContent: 'flex-end' },
  aiWrap: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', borderRadius: RADIUS.lg, padding: SPACING.md },
  userBubble: { borderBottomRightRadius: 4 },
  aiBubble: { borderBottomLeftRadius: 4, ...SHADOWS.md },
  bubbleText: { fontSize: 14, lineHeight: 20, color: COLORS.text },
  typingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingBottom: SPACING.xs },
  typingDots: { flexDirection: 'row', alignItems: 'center' },
  dotPulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginHorizontal: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: SPACING.sm, paddingBottom: SPACING.md, backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: COLORS.border },
  inputBox: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md, ...SHADOWS.sm },
  textInput: { fontSize: 14, paddingVertical: SPACING.sm + 2, maxHeight: 100 },
  sendBtn: { marginLeft: SPACING.xs },
  sendGrad: { width: 44, height: 44, borderRadius: RADIUS.full, justifyContent: 'center', alignItems: 'center' },
});
