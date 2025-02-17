import React from 'react';
import { StyleSheet, Button } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Index() {
    const [nameText, onChangeNameText] = React.useState('');
    return (
        <ThemedView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "stretch",
            }}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Create New Project</ThemedText>
            </ThemedView>
            <ThemedTextInput placeholder="Project Title" onChangeText={onChangeNameText} value={nameText} />
            <ThemedView style={styles.bottomContainer}>
                <Button title="Create" onPress={() =>
                    // Save the project locally and open it.
                    console.log("Creating Project: " + nameText)} />
            </ThemedView>


            
        </ThemedView>
    );
}


const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    }
});

