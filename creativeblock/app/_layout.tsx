import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import ChatBubble from '@/components/ChatBubble';
import DeepSeekChat from '@/components/DeepSeekChat';

export default function RootLayout() {
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="createproject" options={{ title: 'Create Project' }} />
        <Stack.Screen name="projecthome" options={{ title: 'Project Home' }} />
        <Stack.Screen name="projectview" options={{ title: 'Project View' }} />
      </Stack>

      <ChatBubble onPress={() => setChatVisible(prev => !prev)} />
      <DeepSeekChat visible={chatVisible} onClose={() => setChatVisible(false)} />
    </View>
  );
}

