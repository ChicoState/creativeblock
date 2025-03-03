import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="art_page" options={{ title: 'Art Page' }} />
            <Stack.Screen name="createproject" options={{ title: 'Create Project' }} />
            <Stack.Screen name="projecthome" options={{ title: 'Project Home' }} />
        </Stack>
    );
}
