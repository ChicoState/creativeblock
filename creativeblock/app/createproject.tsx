import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Alert } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Project } from '@/classes/Project';

export default function CreateProject() {
    const [nameText, setNameText] = useState('');
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const router = useRouter();

    // Load current user on component mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await AsyncStorage.getItem('currentUser');
                setCurrentUser(user);
            } catch (error) {
                console.error('Error loading user:', error);
            }
        };
        
        loadUser();
    }, []);

    const handleCreateProject = async () => {
        if (!nameText.trim()) {
            Alert.alert('Error', 'Please enter a project title');
            return;
        }

        try {
            // Create new project
            const newProject = {
                title: nameText.trim(),
                created: new Date().toISOString(),
                lastEdited: new Date().toISOString(),
                // Add other project properties as needed
            };

            // Key for storing projects depends on whether there's a logged-in user
            const storageKey = currentUser ? `projects_${currentUser}` : 'projects_guest';
            
            // Get existing projects
            const projectsJson = await AsyncStorage.getItem(storageKey);
            let projects = projectsJson ? JSON.parse(projectsJson) : [];
            
            // Add new project
            projects.push(newProject);
            
            // Save updated projects list
            await AsyncStorage.setItem(storageKey, JSON.stringify(projects));
            
            // Set as current project
            await AsyncStorage.setItem('currentProject', JSON.stringify(newProject));
            
            // Navigate back to project home
            router.goBack();
            
            // You could navigate to the project editor instead
            // router.navigate('projecteditor' as never);
        } catch (error) {
            console.error('Error creating project:', error);
            Alert.alert('Error', 'Failed to create project');
        }
    };

    return (
        <ThemedView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "stretch",
                padding: 20,
            }}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Create New Project</ThemedText>
            </ThemedView>
            
            <ThemedTextInput 
                placeholder="Project Title" 
                onChangeText={setNameText} 
                value={nameText} 
                style={styles.input}
            />
            
            <ThemedView style={styles.bottomContainer}>
                <Button 
                    title="Create" 
                    onPress={handleCreateProject}
                />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    }
});