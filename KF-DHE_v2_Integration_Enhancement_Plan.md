# KF-DHE v2.0 --- Integration Enhancement Plan

## Vision

Kimia Farma menjadi **pusat ekosistem kesehatan digital**. Halodoc
berperan sebagai mitra telemedicine, sedangkan seluruh perjalanan pasien
setelah konsultasi dikelola di KF-DHE.

## End-to-End Flow

1.  Login
2.  Health Dashboard
3.  Konsultasi Dokter (Halodoc)
4.  e-Prescription otomatis masuk ke KF-DHE
5.  AI membaca resep & memberi edukasi/interaksi obat
6.  Rekam Medis diperbarui
7.  Cek stok seluruh apotek Kimia Farma
8.  Pilih Pickup / Delivery
9.  Tracking pesanan
10. Reminder obat otomatis
11. Health Score diperbarui
12. KF Rewards & repeat order

## Fitur Baru Wajib

### 1. Consult Doctor (Halodoc)

Route: `/consult` - Embedded/deep link Halodoc - Jadwal dokter - Hasil
konsultasi - e-Prescription otomatis

### 2. e-Prescription Integration

Route: `/upload-prescription` - OCR (mock) - Sinkronisasi resep -
Validasi obat

### 3. Medical Record

Route: `/medical-record` - Diagnosa - Riwayat konsultasi - Riwayat
resep - Riwayat pembelian - Alergi - Golongan darah - BMI - Tekanan
darah - Gula darah

### 4. Pharmacy Finder

Route: `/pharmacy` - Cari apotek terdekat - Jam operasional - Reservasi
pickup - Navigasi

### 5. National Inventory

Route: `/inventory` - Stok per apotek - Estimasi restock - Alternatif
outlet

### 6. Delivery Tracking

Route: `/orders` Status: - Diproses - Disiapkan - Kurir mengambil -
Dalam perjalanan - Terkirim

### 7. KF Rewards

Route: `/rewards` - Point - Voucher - Membership Silver/Gold/Platinum -
Promo personal

### 8. KAI Assistant 2.0

Route: `/(tabs)/chat` - Analisis resep - Interaksi obat - Edukasi
penggunaan - Reminder otomatis - FAQ Kimia Farma - Rekomendasi layanan

### 9. Health Score

Route: `/health-score` Komponen: - Kepatuhan minum obat - Aktivitas -
BMI - Check-up - Penyakit kronis - Konsultasi berkala

## Home Dashboard Baru

-   Consult Doctor
-   Upload Prescription
-   Order Medicine
-   Find Pharmacy
-   Medical Record
-   Medicine Reminder
-   KAI Assistant
-   KF Rewards
-   Recent Orders
-   Health Score
-   Health Tips

## Pembagian Peran

### Halodoc

-   Telemedicine
-   Dokter
-   Jadwal konsultasi
-   e-Prescription

### Kimia Farma

-   Single Health Hub
-   Medical Record
-   AI Assistant
-   Inventory nasional
-   Apotek
-   Pembayaran
-   Delivery
-   Reminder
-   Loyalty
-   Analytics

## Struktur Route

    app/
     (tabs)/
       index.tsx
       medicines.tsx
       chat.tsx
       profile.tsx
     consult.tsx
     upload-prescription.tsx
     medical-record.tsx
     pharmacy.tsx
     inventory.tsx
     orders.tsx
     rewards.tsx
     health-score.tsx

## Nilai Tambah Presentasi

-   Omnichannel
-   Single Patient Journey
-   AI-assisted medication safety
-   Integrasi telemedicine + apotek nasional
-   Local-first MVP dengan mock data
-   Mudah dikembangkan ke backend cloud

## Roadmap

MVP: - Semua fitur di atas dengan mock data.

Phase 2: - API Halodoc - Cloud database - SSO - Payment gateway - GPS
real-time - IoT device sync

Phase 3: - BI Dashboard - Prediksi refill obat - AI preventive care -
Integrasi BPJS
