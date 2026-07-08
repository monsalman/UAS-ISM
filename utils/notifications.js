import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleReminderNotification(reminder) {
  const [hours, minutes] = reminder.time.split(':').map(Number);

  // Cancel existing notification for this reminder
  await Notifications.cancelScheduledNotificationAsync(reminder.id);

  await Notifications.scheduleNotificationAsync({
    identifier: reminder.id,
    content: {
      title: 'Waktu Minum Obat',
      body: `${reminder.name} — ${reminder.dosage}`,
      data: { reminderId: reminder.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: minutes,
    },
  });
}

export async function cancelReminderNotification(reminderId) {
  await Notifications.cancelScheduledNotificationAsync(reminderId);
}

export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Notification permission not granted');
    return false;
  }
  return true;
}
