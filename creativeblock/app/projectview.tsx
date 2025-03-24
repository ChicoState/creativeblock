import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Modal, FlatList, Alert, Button } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Project } from '@/classes/Project';
import { Idea } from '@/classes/Idea';

export default function ProjectHome() {
    const [nameText, setNameText] = useState(''); // Title for new idea.
    const [project, setProject] = useState<Project | null>(null); // Get/Set for the currently loaded project.
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
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
    const handleAddIdea = (title: string) => {
        if (!project) return; // Do nothing if null.

        // Add all project ideas, then add new idea and save.
        const updatedProject = new Project(project.getTitle());
        for (const idea of project.getIdeas()) {
            updatedProject.addIdea(new Idea(idea.getTitle(), idea.getDesc()));
        }
        updatedProject.addIdea(new Idea(title));
        setProject(updatedProject);
    };


    // DEPRECATED
    // Updates idea at the given index with a new string value.
    /*const updateIdea = (index: number, newIdea: Idea) => {
        if (!project) return; // Do nothing if null.
        console.log(newIdea.desc);
        // Update project with edited idea and save.
        const updatedProject = new Project(project.getTitle());
        for (const idea of project.getIdeas()) {
            updatedProject.addIdea(new Idea(idea.getTitle(), idea.getDesc()));
        }
        updatedProject.updateIdea(index, newIdea);
        setProject(updatedProject);
    };*/

    /*
    // DEPRECATED
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
    */

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
                        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                            <ThemedText style={styles.addButtonText}>[+]New Idea</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                    {project.ideas && Array.isArray(project.ideas) && project.ideas.length > 0 ? (
                        // Displays a list of ideas.
                        <FlatList 
                            data={project.ideas}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.ideaItem}
                                    //onPress={() => handleOpenProject(item)}
                                >
                                    <ThemedText style={styles.ideaTitle}>{item.title}</ThemedText>
                                    
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        <ThemedText>This project has no ideas yet. Try to add one with the "New Idea" button!</ThemedText>
                    )}
                    <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} transparent>
                        <ThemedView style={styles.ideaModal}>
                            <ThemedText style={styles.ideaTitle}>Create New Idea</ThemedText>
                            <ThemedTextInput
                                style={styles.ideaInput}
                                placeholder="Idea Name"
                                defaultValue=''
                                onChangeText={setNameText}
                            />
                            <TouchableOpacity style={styles.modalButtonBlue} onPress={() => {
                                handleAddIdea(nameText);
                                setIsModalVisible(false);
                            }}>
                                <ThemedText style={styles.addButtonText}>Create Idea</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonRed} onPress={() => setIsModalVisible(false)}>
                                <ThemedText style={styles.addButtonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </Modal>
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
    ideaItem: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 12,
    },
    ideaTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    ideaModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderRadius: 10,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderColor: 'gray',
        borderWidth: 2,
    },
    ideaInput: {
    },
    modalButtonBlue: {
        backgroundColor: '#4A90E2',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    modalButtonRed: {
        backgroundColor: '#E2904A',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
});