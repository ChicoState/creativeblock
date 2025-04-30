import { Stack } from 'expo-router';
import {Tabs} from "expo-router"
import ChatBubble from '@/components/ChatBubble';
import { useThemeColor } from '@/hooks/useThemeColor';


// 1. Import GestureHandlerRootView
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react'; // Import React if not already present
import {StatusBar} from "expo-status-bar"

export default function RootLayout() {
    const backgroundColor = useThemeColor({}, 'background'); // uses 'card' key from Colors.light/dark
    const textColor = useThemeColor({}, 'text');

    return (
        // 2. Wrap your Stack navigator with GestureHandlerRootView
        // 3. Add style={{ flex: 1 }}
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{
                headerStyle: {
                    backgroundColor: backgroundColor, 
                },
                headerTintColor: textColor, 
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20
                },
            }} >
                {/* Your screen definitions remain the same */}
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="createproject" options={{ title: 'Create Project' }} />
                <Stack.Screen name="projecthome" options={{ title: 'Project Home' }} />
                <Stack.Screen name="(tabs)" />
                {/* Ensure the screen name matches the file name if using file-based routing
                    e.g., if your file is project/[id].tsx, the name might be inferred differently
                    or defined specifically like "project/[id]" */}
                <Stack.Screen name="projectview" options={{ title: 'Project View' }} />

                {/* If your file is actually project/[id].tsx, use that name: */}
                {/* <Stack.Screen name="project/[id]" options={{ title: 'Project View' }} /> */}
            </Stack>
        <ChatBubble />
        </GestureHandlerRootView>


    );
}
