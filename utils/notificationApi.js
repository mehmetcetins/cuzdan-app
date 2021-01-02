import React from "react";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';




Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const responseListener = React.createRef();





export async function schedulePushNotification(totalExpense) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Ay sonuna kadar "+ totalExpense + " TL harcayacaksın",
      },
      trigger: { seconds:  3600*2},
    });
  }

export async function cancelNotification(identifier){
    await Notifications.cancelScheduledNotificationAsync(identifier);
}
export async function registerForPushNotificationsAsync() {
    let token;
   
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        });
    }

    return token;
}