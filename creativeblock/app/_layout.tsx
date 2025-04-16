import { Stack } from 'expo-router';
import ChatBubble from '@/components/ChatBubble';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="createproject" options={{ title: 'Create Project' }} />
        <Stack.Screen name="projecthome" options={{ title: 'Project Home' }} />
        <Stack.Screen name="projectview" options={{ title: 'Project View' }} />
      </Stack>

      {/* Add the floating chat bubble */}
      <ChatBubble />
    </>
  );
}

