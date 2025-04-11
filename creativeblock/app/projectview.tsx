import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Modal, FlatList, Alert, Button, Switch } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Project } from '@/classes/Project';
import { Idea } from '@/classes/Idea';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {IdeaModule } from '../classes/IdeaModule'
import { IdeaTextModule } from '../classes/IdeaTextModule';
//import { IdeaImageModule } from '../classes/IdeaImageModule'

export default function ProjectView() {
    const [nameText, setNameText] = useState(''); // Title for new idea.
    const [project, setProject] = useState<Project>(new Project("")); // Get/Set for the currently loaded project.
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // Visibility for the Add Idea modal.
    const [isIdeaModalVisible, setIsIdeaModalVisible] = useState(false); // Visibility for the Edit Idea modal.
    const [currentIdea, setCurrentIdea] = useState<Idea>(new Idea("")); // Currently selected Idea.
    const router = useRouter();
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);
    const { id: projectId } = useLocalSearchParams();


    // Load the project on component mount.
    useEffect(() => {
        const fetchProject = async () => {
            const user = auth.currentUser;
            if (!user || typeof projectId !== 'string') return;

            try {
                // Take data and plug it into constructor.
                const projectDoc = await getDoc(doc(db, 'users', user.uid, 'projects', projectId));
                const projectData = projectDoc.data();
                if (projectData) {
                    setProject(new Project(projectData.title, projectData.ideas));

                    // Load all ideas.
                    const projectIdeas: Idea[] = []
                    projectData.ideas.forEach((item: any) => {
                        const ideaModules: IdeaModule[] = [];
                        item.modules.forEach((item: any) => {
                            if (item.text != null) ideaModules.push(new IdeaTextModule(item.text));
                            //if (item.image != null) ideaModules.push(new IdeaImageModule(item.image));
                        })
                        projectIdeas.push(new Idea(item.title, ideaModules));
                    });
                    setIdeas(projectIdeas);
                }
            } catch (error) {
                console.error('Failed to load project:', error);
                Alert.alert('Error', 'Failed to load project');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const saveProject = async (updatedIdeas: Idea[]) => {
        const user = auth.currentUser;
        if (!user || typeof projectId !== 'string') return;

        try {
            const projectIdeas = updatedIdeas.map(idea => ({
                title: idea.getTitle(),
                modules: idea.getModules().map(module => ({
                    text: (module instanceof IdeaTextModule) ? module.getText() : null,
                    //image: (module instanceof IdeaImageModule) ? module.getImage() : null,
                })),
            }));

            await updateDoc(doc(db, 'users', user.uid, 'projects', projectId), {
                ...project,
                ideas: projectIdeas,
                lastEdited: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to save project:', error);
        }
    };

    const handleAddIdea = (title: string) => {
        const newIdea = new Idea(title); 
        const updated = [...ideas, newIdea];
        setIdeas(updated);
        saveProject(updated);
    };

    const updateIdea = (idea: Idea) => {
        const updated = [...ideas];
        const updateIndex: number = updated.findIndex(element => element.getTitle() === idea.getTitle());
        updated[updateIndex] = idea;
        setIdeas(updated);
        saveProject(updated);
    };

    const handleRemoveIdea = (index: number) => {
        const updated = ideas.filter((_, i) => i !== index);
        setIdeas(updated);
        saveProject(updated);
    };

    // Open a selected idea
    const handleOpenIdea = (idea: Idea) => {
        setCurrentIdea(idea);
        if (currentIdea) setIsIdeaModalVisible(true);
    };

    return (
        <ThemedView style={styles.container}>
            {project ?
                // Load this page if project is not null.
                <ThemedView>
                    <ThemedView style={styles.header}>
                        <ThemedText type="title">{project.getTitle()}</ThemedText>
                        <TouchableOpacity style={styles.addButton} onPress={() => setIsCreateModalVisible(true)}>
                            <ThemedText style={styles.addButtonText}>[+]New Idea</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                    {project.getIdeas() && Array.isArray(project.getIdeas()) && project.getIdeas().length > 0 ? (
                        // Displays a list of ideas.
                        <FlatList 
                            data={ideas}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.ideaItem}
                                    onPress={() => handleOpenIdea(item)}
                                >
                                    <ThemedText style={styles.ideaTitle}>{item.getTitle()}</ThemedText>
                                    
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        <ThemedText>This project has no ideas yet. Try to add one with the "New Idea" button!</ThemedText>
                    )}
                    <Modal visible={isCreateModalVisible} onRequestClose={() => setIsCreateModalVisible(false)} transparent>
                        <ThemedView style={styles.createModal}>
                            <ThemedText style={styles.ideaTitle}>Create New Idea</ThemedText>
                            <ThemedTextInput
                                style={styles.ideaInput}
                                placeholder="Idea Name"
                                defaultValue=''
                                onChangeText={setNameText}
                            />
                            <TouchableOpacity style={styles.createModalButtonBlue} onPress={() => {
                                if (nameText != "") {
                                    handleAddIdea(nameText);
                                    setIsCreateModalVisible(false);
                                } else {
                                    Alert.alert('Creation Failed', 'Please enter a valid title.');
                                }
                            }}>
                                <ThemedText style={styles.addButtonText}>Create Idea</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.createModalButtonRed} onPress={() => setIsCreateModalVisible(false)}>
                                <ThemedText style={styles.addButtonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </Modal>
                    <Modal visible={isIdeaModalVisible} onRequestClose={() => setIsIdeaModalVisible(false)}>
                        <ThemedView style={styles.ideaModal}>
                            <ThemedText style={styles.ideaTitle}>{currentIdea?.getTitle()}</ThemedText>
                            <TouchableOpacity style={styles.addButton} onPress={() => {
                                currentIdea?.addModule(new IdeaTextModule(""));
                                updateIdea(currentIdea)
                            }}>
                                <ThemedText style={styles.addButtonText}>[+]New Module</ThemedText>
                            </TouchableOpacity>
                            <FlatList
                                data={currentIdea?.getModules()}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    item.getView(() => saveProject(ideas))
                                )}
                            />
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
        borderRadius: 2,
        marginBottom: 12,
    },
    ideaTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    createModal: {
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
    createModalButtonBlue: {
        backgroundColor: '#4A90E2',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    createModalButtonRed: {
        backgroundColor: '#E2904A',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    ideaModal: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
});