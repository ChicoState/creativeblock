import React from 'react';
import { StyleSheet, Button } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Project } from '@/classes/Project'





export default function CreateProject() {
    const [nameText, onChangeNameText] = React.useState('');
    const navigation = useNavigation();
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
                <Button title="Create" onPress={() => {

                    // Save the project locally.

                        console.log("Creating Project: " + nameText)
                        if (true) { // If project is successfully saved, move to projecthome.
                            navigation.goBack(); // When the user returns from project home, we want them to go back to home, not the create project screen.
                            navigation.navigate('projecthome' as never); // I don't know why we need the 'as never', but it works. Routes to project home.
                        }
                    }
                }/>
            </ThemedView>


            
        </ThemedView>
    );
}

async function saveNewProject(p: Project): Promise<boolean> { // Saves the new project in AsyncStorage. Returns true if saved successfully.

    if (p.getTitle() == "") return false; // Return false on empty title.
    const storeData = async (value: Project) => {
        try {
            const jsonValue = JSON.stringify(p);
            await AsyncStorage.setItem('project', jsonValue);
            return true;
        } catch (e) {
            console.error("Failed to save project."); // Project not created successfully.
        }
    };
    
    return false;
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

