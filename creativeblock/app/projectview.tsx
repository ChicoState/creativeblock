import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Alert, Button } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Project } from '@/classes/Project';
import { Idea } from '@/classes/Idea';

export default function ProjectHome() {
    const [project, setProject] = useState<Project | null>(null); // Get/Set for the currently loaded project.
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const router = useRouter();

    // Load the project on component mount.
    useEffect(() => {
        
        const loadCurrentProject = async () => {
            try {
                const projectJson = await AsyncStorage.getItem('currentProject');
                if (projectJson) {
                    const projectData = JSON.parse(projectJson);
                    const project = new Project(projectData.title);

                    // If this project has ideas, add them.
                    if (projectData.ideas && Array.isArray(projectData.ideas)) {
                        projectData.ideas.forEach((idea: any) => {
                            project.addIdea(new Idea(idea.title, idea.desc));
                        });
                    }
                    console.log("Project " + project.getTitle() + " loaded with " + project.getIdeas().length + " ideas!");
                    setProject(project);
                }
            } catch (error) {
                console.error('Error loading current project:', error);
            }
        };

        loadCurrentProject();
    }, []);

    // Listen to changes in project and save accordingly.
    useEffect(() => {
        if (project) {
            console.log("Update project");
            saveCurrentProject();
        }
    }, [project]); 

    const saveCurrentProject = async () => {
        if (!project) return;

        try {
            await AsyncStorage.setItem('currentProject', JSON.stringify(project.toJSON()));

            const user = await AsyncStorage.getItem('currentUser');
            const storageKey = user ? `projects_${user}` : 'projects_guest';

            // Get project from saved projects.
            const projectsJson = await AsyncStorage.getItem(storageKey);
            let projects: Project[] = projectsJson ? JSON.parse(projectsJson) : [];
            const projectIndex = projects.findIndex((p) => p.title === project.title);

            // Update project and add it back to projects.
            projects[projectIndex] = project.toJSON(); // Use toJSON() here as well
            await AsyncStorage.setItem(storageKey, JSON.stringify(projects));

            console.log('Project saved successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            Alert.alert('Error', 'Failed to save project. Please try again.');
        }
    };

    // Adds a new blank idea to the project.
    const handleAddIdea = () => {
        if (!project) return; // Do nothing if null.

        // Add all project ideas, then add new idea and save.
        const updatedProject = new Project(project.getTitle());
        for (const idea of project.getIdeas()) {
            updatedProject.addIdea(new Idea(idea.getTitle(), idea.getDesc()));
        }
        updatedProject.addIdea();
        setProject(updatedProject);
    };

    // Updates idea at the given index with a new string value.
    const updateIdea = (index: number, newIdea: Idea) => {
        if (!project) return; // Do nothing if null.
        console.log(newIdea.desc);
        // Update project with edited idea and save.
        const updatedProject = new Project(project.getTitle());
        for (const idea of project.getIdeas()) {
            updatedProject.addIdea(new Idea(idea.getTitle(), idea.getDesc()));
        }
        updatedProject.updateIdea(index, newIdea);
        setProject(updatedProject);
    };

    // Removes the idea at the given index.
    const handleRemoveIdea = (index: number) => {
        if (!project) return; // Do nothing if null.

        // Add all project ideas, remove idea of given index and save.
        const updatedProject = new Project(project.getTitle());
        for (const idea of project.getIdeas()) {
            updatedProject.addIdea(new Idea(idea.getTitle(), idea.getDesc()));
        }
        updatedProject.removeIdea(index);
        setProject(updatedProject);
    };

    return (
        <ThemedView style={styles.container}>
            {project ?
                // Load this page if project is not null.
                <ThemedView>
                    <ThemedView style={styles.header}>
                        <ThemedText type="title">{project.title}</ThemedText>
                        {currentUser ? (
                            <ThemedText>Signed in as: {currentUser}</ThemedText>
                        ) : (
                            <ThemedText>Guest Mode</ThemedText>
                        )}
                        <TouchableOpacity style={styles.addButton} onPress={handleAddIdea}>
                            <ThemedText style={styles.addButtonText}>[+]New Idea</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                    {project.ideas && Array.isArray(project.ideas) && project.ideas.length > 0 ? (
                        project.ideas.map((idea, index) => (
                            <ThemedView key={index} style={styles.ideaContainer}>
                                <ThemedTextInput
                                    style={styles.ideaInput}
                                    placeholder="Enter idea description."
                                    defaultValue={idea.getDesc()}
                                    onEndEditing={(event) => {
                                        const text = event.nativeEvent.text; // Get the text from the event
                                        updateIdea(index, new Idea(idea.getTitle(), text));
                                    }}
                                />
                                <Button title="Remove" onPress={() => handleRemoveIdea(index)} />
                            </ThemedView>
                        ))
                    ) : (
                        <ThemedText>This project has no ideas yet. Try to add one with the "New Idea" button!</ThemedText>
                    )}
                </ThemedView>
                : 
                // Load this page instead if project is not yet loaded.
                <ThemedText>Loading project...</ThemedText> 

            }
            
        </ThemedView>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    addButton: {
        backgroundColor: '#4A90E2',
        width: 145,
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        top: 10
    },
    addButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    ideasContainer: {
        flex: 1,
    },
    header: {
        marginBottom: 24,
    },
    ideaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    ideaInput: {
        width: 500
    }
});