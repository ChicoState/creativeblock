import { Stack } from 'expo-router';
import ChatBubble from '@/components/ChatBubble';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePathname } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  const pathname = usePathname();

  // Hide ChatBubble on the login screen (index.tsx → '/')
  const hideChat = pathname === '/';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="createproject" options={{ title: 'Create Project' }} />
        <Stack.Screen name="projecthome" options={{ title: 'Project Home' }} />
        <Stack.Screen name="projectview" options={{ title: 'Project View' }} />
      </Stack>

      {/* Only show ChatBubble if not on the login (index) page */}
      {!hideChat && <ChatBubble />}
    </GestureHandlerRootView>
  );
}

