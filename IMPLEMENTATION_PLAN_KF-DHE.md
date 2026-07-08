# Implementation Plan — Kimia Farma Digital Health Ecosystem (KF-DHE) MVP (Local-First)

**Disusun oleh:** Muhammad Salman F
**Versi Dokumen:** 1.1 (MVP Local-First)
**Tanggal:** 5 Juli 2026
**Durasi Total:** 2-4 Minggu (Fokus Presentasi & Demo)
**Referensi:** PRD KF-DHE v1.0

---

## 1. Ringkasan Proyek

KF-DHE MVP dirancang khusus untuk kebutuhan presentasi dan demo cepat. Seluruh data disimpan secara lokal di dalam device menggunakan penyimpanan lokal (seperti AsyncStorage / SQLite lokal). 

Modul yang dibangun:
1. **Consumer Health App** — mobile app pasien (iOS & Android, React Native)
2. **KAI Assistant** — AI healthcare assistant terintegrasi langsung di dalam aplikasi mobile menggunakan API Key + Base URL eksternal.

*Catatan: Modul Executive BI Dashboard ditiadakan untuk fase MVP presentasi ini.*

---

## 2. Tech Stack

| Layer | Teknologi |
| --- | --- |
| Mobile App | React Native (Expo / Bare Workflow) |
| Local Database | AsyncStorage / WatermelonDB / SQLite (Local-only) |
| AI/ML (KAI) | External LLM API (API Key + Base URL) via Fetch/Axios langsung dari device |
| Notifikasi | Local Push Notifications (Expo Notifications / React Native Push Notification) |

---

## 3. Struktur Tim (Demo Setup)

| Peran | Fokus |
| --- | --- |
| React Native Developer | UI/UX, Local Storage, Integrasi API LLM, Alur Demo |

---

## 4. Timeline Sprint (4 Minggu / 2 Sprint × 2 Minggu)

### Sprint 1 — UI Foundation & Local Storage (Minggu 1-2)

**Tujuan:** Setup project, UI dasar, dan penyimpanan data lokal.

| Fitur | Detail |
| --- | --- |
| Setup Project | Inisialisasi React Native (Expo recommended untuk demo cepat) |
| Home Dashboard | Header sapaan, Health Score Card (statis/lokal), Quick Actions (Upload Prescription, Consult Doctor, Order Medicine, Health Record, Find Pharmacy, AI Assistant) |
| Local Database Setup | Setup AsyncStorage/SQLite untuk menyimpan data profil, obat, reminder, dan riwayat chat |
| Medicine Reminder | UI reminder obat, tambah reminder baru, simpan ke local storage, trigger local notification |

**Exit criteria:** Aplikasi dapat dijalankan di simulator/device, data reminder tersimpan secara lokal dan memicu notifikasi lokal.

---

### Sprint 2 — Order Medicine & KAI Assistant Integration (Minggu 3-4)

**Tujuan:** Fitur transaksi lokal dan integrasi AI Assistant untuk demo interaktif.

| Fitur | Detail |
| --- | --- |
| Order Medicine | Katalog obat lokal (mock data), keranjang belanja, checkout simulasi (langsung sukses & potong stok lokal) |
| KAI Assistant Chat | UI Chat interface, integrasi langsung ke External LLM API menggunakan API Key + Base URL |
| AI Guardrails & Prompting | System prompt lokal untuk membatasi respons AI (tidak mendiagnosis, fokus info obat & FAQ Kimia Farma) |
| Demo Data Seeding | Script/tombol rahasia untuk seed data simulasi (transaksi, reminder, skor kesehatan) untuk kelancaran presentasi |

**Exit criteria:** Alur demo lengkap (Home -> Tambah Reminder -> Simulasi Beli Obat -> Chat dengan KAI) berfungsi 100% offline/local-first dengan koneksi internet hanya untuk API LLM.

---

## 5. Alur Demo Presentasi

```
[Buka Aplikasi] ──> [Lihat Health Score & Reminder] ──> [Tambah Reminder Baru (Notifikasi Muncul)]
                                                                   │
[Tanya KAI Assistant (Info Obat/Interaksi)] <── [Simulasi Checkout Obat] <── [Pilih Obat di Katalog]
```

---

## 6. Strategi Testing (Demo Readiness)

| Jenis Testing | Cakupan |
| --- | --- |
| UI/UX Walkthrough | Memastikan transisi antar halaman mulus tanpa crash |
| Local Storage Persistence | Memastikan data tidak hilang saat aplikasi di-restart |
| LLM API Connection | Memastikan API Key aktif dan respons chat cepat |
| Notification Trigger | Memastikan notifikasi reminder muncul tepat waktu saat demo |

---

## 7. Manajemen Risiko (Demo)

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Koneksi internet lambat saat presentasi | KAI Assistant tidak merespons | Siapkan fallback mock response lokal jika request API timeout |
| Device simulator crash | Demo terhenti | Siapkan build APK/IPA cadangan di device fisik |
| API Key LLM limit/expired | Fitur chat mati | Siapkan backup API Key cadangan |

---

## 8. Catatan Implementasi

- **Tanpa Backend:** Tidak ada server Express.js atau database cloud. Semua state dikelola via React Context/Redux dan disimpan di AsyncStorage.
- **Keamanan API Key:** Karena ini aplikasi demo local-first, API Key LLM disimpan langsung di file `.env` lokal (tidak untuk produksi).
- **Mock Data:** Sediakan katalog obat minimal 10 item populer Kimia Farma lengkap dengan harga dan deskripsi.
