import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Alert, Button } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Project } from '@/classes/Project';
import { Idea } from '@/classes/Idea';
import { IdeaDropdown } from './ideaDroptown';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

export default function ProjectHome() {
    const [project, setProject] = useState<Project | null>(null); // Get/Set for the currently loaded project.
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [showIdeaTypes, setShowIdeaTypes] = useState(false);
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


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
    const handleImagePress = async (source: 'camera' | 'gallery') => {
      let result;
      if (source === 'camera') {
        const camPerm = await ImagePicker.requestCameraPermissionsAsync();
        if (!camPerm.granted) return Alert.alert("Camera permission denied");
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          allowsEditing: false,
        });
      } else {
        const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!libPerm.granted) return Alert.alert("Media Library permission denied");
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          allowsEditing: false,
        });
      }

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;

        if (project) {
          const updatedProject = new Project(project.getTitle());
          for (const idea of project.getIdeas()) {
            updatedProject.addIdea(new Idea(idea.getTitle(), idea.getDesc()));
          }

          updatedProject.addIdea(new Idea("Image Idea", uri));
          setProject(updatedProject);
        }
        setSelectedImage(uri);
      }
    };

    const showImagePickerPrompt = () => {
        Alert.alert(
          "Choose Image Source",
          "How would you like to add your image?",
          [
            { text: "Camera", onPress: () => handleImagePress('camera') },
            { text: "Gallery", onPress: () => handleImagePress('gallery') },
            { text: "Cancel", style: "cancel" }
          ]
        );
    };

    // Adds a new blank idea to the project.
    const handleAddIdea = async (type: string) => {
            if (!project) return;
            const updatedProject = new Project(project.getTitle());
            for (const idea of project.getIdeas()) {
                updatedProject.addIdea(new Idea(idea.getTitle(), idea.getDesc()));
            }
            if (type === 'image') {
                showImagePickerPrompt();
                setShowIdeaTypes(false);
                return;
            }
            updatedProject.addIdea(new Idea("New Idea", ""));
            setProject(updatedProject);
            setShowIdeaTypes(false);
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
                {project ? (
                    <>
                        <ThemedView style={styles.header}>
                            <ThemedText type="title">{project.getTitle()}</ThemedText>
                            {currentUser ? (
                                <ThemedText>Signed in as: {currentUser}</ThemedText>
                            ) : (
                                <ThemedText>Guest Mode</ThemedText>
                            )}

                            {/* Toggle the dropdown instead of directly adding idea */}
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setShowIdeaTypes(!showIdeaTypes)}
                            >
                                <ThemedText style={styles.addButtonText}>[+] New Idea</ThemedText>
                            </TouchableOpacity>

                            {/* Render the dropdown if showIdeaTypes is true */}
                            <IdeaDropdown
                                visible={showIdeaTypes}
                                onSelect={(type) => handleAddIdea(type)}
                            />
                        </ThemedView>

                        {/* Display existing ideas */}
                        {project.getIdeas().length > 0 ? (
                            project.getIdeas().map((idea, index) => (
                                <ThemedView key={index} style={styles.ideaContainer}>
				                    {idea.getDesc().startsWith("file://") ? (
                                      <ThemedView style={styles.imageBox}>
                                        <Image
                                          source={{ uri: idea.getDesc() }}
                                          style={styles.imagePreview}
                                        />
                                        <Button
                                          title="Remove Image"
                                          color="red"
                                          onPress={() => handleRemoveIdea(index)}
                                        />
                                      </ThemedView>
                                    ) : (
                                      <>
                                        <ThemedTextInput
                                          style={styles.ideaInput}
                                          placeholder="Enter idea description."
                                          defaultValue={idea.getDesc()}
                                          onEndEditing={(event) => {
                                            const text = event.nativeEvent.text;
                                            updateIdea(index, new Idea(idea.getTitle(), text));
                                          }}
                                        />
                                        <Button
                                          title="Remove"
                                          color="red"
                                          onPress={() => handleRemoveIdea(index)}
                                        />
                                      </>
                                    )}
                                </ThemedView>
                            ))
                        ) : (
                            <ThemedText>No ideas yet. Try adding one!</ThemedText>
                        )}
                    </>
                ) : (
                    <ThemedText>Loading project...</ThemedText>
                )}
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
    },
    imageBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: 10,
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
});
