import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Project } from '@/classes/Project';

export default function ProjectHome() {
    const [project, setProject] = useState<Project | null>(null); // Get/Set for the currently loaded project.
    const router = useRouter();

    useEffect(() => {
        // Load the project when the component mounts
        const loadCurrentProject = async () => {
            try {
                const projectJson = await AsyncStorage.getItem('currentProject');
                if (projectJson) {
                    setProject(JSON.parse(projectJson));
                }
            } catch (error) {
                console.error('Error loading current project:', error);
            }
        };

        loadCurrentProject();
    }, []);

    // Updates the current project and saves it.
    const saveCurrentProject = async () => {
        if (!project) return;
        try {
            await AsyncStorage.setItem('currentProject', JSON.stringify(project));

            // Retrieve the current user to save it under their projects list
            const user = await AsyncStorage.getItem('currentUser');
            const storageKey = user ? `projects_${user}` : 'projects_guest';

            const projectsJson = await AsyncStorage.getItem(storageKey);
            let projects: Project[] = projectsJson ? JSON.parse(projectsJson) : [];

            // Update the specific project in the list
            const updatedProjects = projects.map((p) =>
                p.title === project.title ? project : p
            );

            await AsyncStorage.setItem(storageKey, JSON.stringify(updatedProjects));
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const loadCurrentProject = async () => {
        try {
            const projectJson = await AsyncStorage.getItem('currentProject');
            if (projectJson) {
                return JSON.parse(projectJson); 
            }
        } catch (error) {
            console.error('Error loading current project:', error);
        }
        return null;
    };

}

