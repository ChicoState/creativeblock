import { Tabs } from 'expo-router';
import React from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

export default () => {
    const backgroundColor = useThemeColor({}, 'background'); 
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint'); 
  return (
      <Tabs screenOptions={{
          headerStyle: {
              backgroundColor: backgroundColor,
          },
          headerTintColor: textColor,
          headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20
          },
          tabBarActiveBackgroundColor: backgroundColor,
          tabBarInactiveTintColor: textColor,
          tabBarActiveTintColor: textColor,
          tabBarInactiveBackgroundColor: backgroundColor,
      }}>
    <Tabs.Screen name = "home" />
    <Tabs.Screen name = "My Projects" />
    <Tabs.Screen name = "popular" />
    </Tabs>
  );
}
