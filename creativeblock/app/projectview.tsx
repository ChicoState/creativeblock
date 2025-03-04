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

