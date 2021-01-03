
import * as Notifications from 'expo-notifications';





Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function schedulePushNotification(totalExpense) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Ay sonuna kadar "+ totalExpense + " TL harcayacaksın",
      },
      trigger: { seconds: 30},
    });
    return identifier;
  }

export async function cancelNotification(identifier){
    await Notifications.cancelScheduledNotificationAsync(identifier);
}
