// Firebase Firestore-powered Project View
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Alert, Button } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function ProjectView() {
  const [project, setProject] = useState<any>(null);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id: projectId } = useLocalSearchParams();

  useEffect(() => {
    const fetchProject = async () => {
      const user = auth.currentUser;
      if (!user || typeof projectId !== 'string') return;

      try {
        const projectDoc = await getDoc(doc(db, 'users', user.uid, 'projects', projectId));
        const projectData = projectDoc.data();
        if (projectData) {
          setProject(projectData);
          setIdeas(projectData.ideas || []);
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

  const saveProject = async (updatedIdeas: string[]) => {
    const user = auth.currentUser;
    if (!user || typeof projectId !== 'string') return;

    try {
      await updateDoc(doc(db, 'users', user.uid, 'projects', projectId), {
        ...project,
        ideas: updatedIdeas,
        lastEdited: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleAddIdea = () => {
    const updated = [...ideas, ''];
    setIdeas(updated);
    saveProject(updated);
  };

  const updateIdea = (index: number, text: string) => {
    const updated = [...ideas];
    updated[index] = text;
    setIdeas(updated);
    saveProject(updated);
  };

  const handleRemoveIdea = (index: number) => {
    const updated = ideas.filter((_, i) => i !== index);
    setIdeas(updated);
    saveProject(updated);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading project...</ThemedText>
      </ThemedView>
    );
  }

  if (!project) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Project not found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">{project.title}</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={handleAddIdea}>
          <ThemedText style={styles.addButtonText}>[+] New Idea</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={ideas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ThemedView style={styles.ideaContainer}>
            <ThemedTextInput
              style={styles.ideaInput}
              placeholder="Enter idea..."
              defaultValue={item}
              onEndEditing={(event) => updateIdea(index, event.nativeEvent.text)}
            />
            <Button title="Remove" onPress={() => handleRemoveIdea(index)} />
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    width: 145,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  ideaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ideaInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
});