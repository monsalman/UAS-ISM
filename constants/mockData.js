export const MEDICINES = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Analgesik', price: 5500, stock: 150, icon: 'medical', desc: 'Obat pereda nyeri dan penurun demam.' },
  { id: '2', name: 'Amoxicillin 500mg', category: 'Antibiotik', price: 8200, stock: 80, icon: 'medical', desc: 'Antibiotik untuk infeksi bakteri. Perlu resep dokter.' },
  { id: '3', name: 'Omeprazole 20mg', category: 'Lambung', price: 12000, stock: 60, icon: 'medical', desc: 'Mengurangi produksi asam lambung.' },
  { id: '4', name: 'Cetirizine 10mg', category: 'Antihistamin', price: 6500, stock: 120, icon: 'medical', desc: 'Meredakan gejala alergi seperti bersin dan gatal.' },
  { id: '5', name: 'Vitamin C 1000mg', category: 'Vitamin', price: 15000, stock: 200, icon: 'nutrition', desc: 'Suplemen daya tahan tubuh.' },
  { id: '6', name: 'Antangin JRG', category: 'Herbal', price: 3500, stock: 300, icon: 'leaf', desc: 'Obat masuk angin herbal.' },
  { id: '7', name: 'Ibuprofen 400mg', category: 'Analgesik', price: 7000, stock: 90, icon: 'medical', desc: 'Anti-inflamasi dan pereda nyeri.' },
  { id: '8', name: 'OBH Combi', category: 'Batuk & Flu', price: 18000, stock: 75, icon: 'flask', desc: 'Obat batuk hitam kombinasi.' },
  { id: '9', name: 'Promag Tablet', category: 'Lambung', price: 4000, stock: 250, icon: 'medical', desc: 'Antasida untuk sakit maag.' },
  { id: '10', name: 'Biotin 5000mcg', category: 'Vitamin', price: 45000, stock: 40, icon: 'medical', desc: 'Suplemen untuk kesehatan rambut, kulit, dan kuku.' },
  { id: '11', name: 'Loperamide 2mg', category: 'Pencernaan', price: 5000, stock: 100, icon: 'medical', desc: 'Obat anti diare.' },
  { id: '12', name: 'Dexamethasone 0.5mg', category: 'Kortikosteroid', price: 3000, stock: 60, icon: 'medical', desc: 'Anti-inflamasi kuat. Perlu resep dokter.' },
];

export const CATEGORIES = ['Semua', 'Analgesik', 'Antibiotik', 'Lambung', 'Antihistamin', 'Vitamin', 'Herbal', 'Batuk & Flu', 'Pencernaan', 'Kortikosteroid'];

export const PROMOS = [
  { id: '1', title: 'Diskon 20% Vitamin C', subtitle: 'Berlaku hingga 31 Juli 2026', icon: 'pricetag', color: '#E8F5E9' },
  { id: '2', title: 'Gratis Ongkir', subtitle: 'Min. belanja Rp50.000', icon: 'car', color: '#E3F2FD' },
  { id: '3', title: 'Beli 2 Gratis 1', subtitle: 'Produk herbal pilihan', icon: 'gift', color: '#FFF3E0' },
];

export const DEFAULT_PROFILE = {
  name: 'Salman',
  email: 'salman@email.com',
  phone: '0812-3456-7890',
  healthScore: 78,
  healthBreakdown: {
    adherence: 85,
    activity: 70,
    checkup: 75,
    nutrition: 80,
  },
};
