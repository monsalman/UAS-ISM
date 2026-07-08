import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  REMINDERS: 'kf_reminders',
  CART: 'kf_cart',
  ORDERS: 'kf_orders',
  CHAT_HISTORY: 'kf_chat_history',
  PROFILE: 'kf_profile',
  HEALTH_SCORE: 'kf_health_score',
  PRESCRIPTIONS: 'kf_prescriptions',
  QUEUE: 'kf_queue',
  LAB_RESULTS: 'kf_lab_results',
  VACCINATIONS: 'kf_vaccinations',
  FAMILY: 'kf_family',
  INSURANCE: 'kf_insurance',
  REFILLS: 'kf_refills',
  DRUG_RECALLS: 'kf_drug_recalls',
  EMERGENCY_ALERTS: 'kf_emergency_alerts',
  STAFF_ACTIONS: 'kf_staff_actions',
  CLINIC_APPOINTMENTS: 'kf_clinic_appointments',
};

export async function getData(key) {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  } catch { return null; }
}

export async function setData(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) { console.error('Storage write error', e); }
}

export { KEYS };
