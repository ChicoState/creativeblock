import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Project } from '@/classes/Project';

export default function ProjectHome() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const router = useRouter();

    // Load user and projects on component mount
    useFocusEffect(() => {
        const loadData = async () => {
            try {
                // Get current user
                const user = await AsyncStorage.getItem('currentUser');
                setCurrentUser(user);
                
                // Load projects
                await loadProjects(user);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    });

    // Load projects for current user or guest
    const loadProjects = async (username: string | null) => {
        try {
            // Key for storing projects depends on whether there's a logged-in user
            const storageKey = username ? `projects_${username}` : 'projects_guest';
            
            const projectsJson = await AsyncStorage.getItem(storageKey);
            if (projectsJson) {
                const loadedProjects = JSON.parse(projectsJson);
                setProjects(loadedProjects);
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            setProjects([]);
        }
    };

    // Navigate to create project screen
    const handleCreateProject = () => {
        router.push('/createproject');
    };

    // Open a selected project
    const handleOpenProject = (project: Project) => {
        // Save the current project to AsyncStorage
        const saveCurrentProject = async () => {
            try {
                await AsyncStorage.setItem('currentProject', JSON.stringify(project));
                // Navigate to the project view page with the saved current project.
                console.log(`Opening project: ${project.title}`);
                router.push('/projectview');
            } catch (error) {
                console.error('Error saving current project:', error);
                Alert.alert('Error', 'Failed to open project');
            }
        };
        
        saveCurrentProject();
    };

    // Sign out (for logged-in users)
    const handleSignOut = async () => {
        try {
            await AsyncStorage.removeItem('currentUser');
            router.replace('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <ThemedView style={styles.centerContainer}>
                <ThemedText>Loading projects...</ThemedText>
            </ThemedView>
        );
    }

    // Render empty state
    if (projects.length === 0) {
        return (
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedText type="title">Project Home</ThemedText>
                    {currentUser ? (
                        <ThemedText>Signed in as: {currentUser}</ThemedText>
                    ) : (
                        <ThemedText>Guest Mode</ThemedText>
                    )}
                </ThemedView>
                
                <ThemedView style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>No projects found</ThemedText>
                    <ThemedText style={styles.emptySubtext}>Create a new project to get started</ThemedText>
                    
                    <TouchableOpacity 
                        style={styles.createButton} 
                        onPress={handleCreateProject}
                    >
                        <ThemedText style={styles.buttonText}>Create New Project</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
                
                <ThemedView style={styles.footer}>
                    {currentUser ? (
                        <TouchableOpacity 
                            style={styles.signOutButton} 
                            onPress={handleSignOut}
                        >
                            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            style={styles.signOutButton} 
                            onPress={() => router.replace('/')}
                        >
                            <ThemedText style={styles.signOutText}>Back to Login</ThemedText>
                        </TouchableOpacity>
                    )}
                </ThemedView>
            </ThemedView>
        );
    }

    // Render projects list
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <ThemedText type="title">Project Home</ThemedText>
                {currentUser ? (
                    <ThemedText>Signed in as: {currentUser}</ThemedText>
                ) : (
                    <ThemedText>Guest Mode</ThemedText>
                )}
            </ThemedView>
            
            <ThemedView style={styles.projectsContainer}>
                <ThemedText style={styles.sectionTitle}>Your Projects</ThemedText>
                
                <FlatList
                    data={projects}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.projectItem}
                            onPress={() => handleOpenProject(item)}
                        >
                            <ThemedText style={styles.projectTitle}>{item.title}</ThemedText>
                            <ThemedText style={styles.projectDate}>
                                Last edited: {new Date(item.lastEdited).toLocaleDateString()}
                            </ThemedText>
                        </TouchableOpacity>
                    )}
                />
                
                <TouchableOpacity 
                    style={styles.createButton}
                    onPress={handleCreateProject}
                >
                    <ThemedText style={styles.buttonText}>Create New Project</ThemedText>
                </TouchableOpacity>
            </ThemedView>
            
            <ThemedView style={styles.footer}>
                {currentUser ? (
                    <TouchableOpacity 
                        style={styles.signOutButton}
                        onPress={handleSignOut}
                    >
                        <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                        style={styles.signOutButton}
                        onPress={() => router.replace('/')}
                    >
                        <ThemedText style={styles.signOutText}>Back to Login</ThemedText>
                    </TouchableOpacity>
                )}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    projectsContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    projectItem: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 12,
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    projectDate: {
        fontSize: 14,
        color: '#666',
    },
    createButton: {
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    signOutButton: {
        padding: 12,
        alignItems: 'center',
    },
    signOutText: {
        color: '#4A90E2',
        fontSize: 16,
    }
});