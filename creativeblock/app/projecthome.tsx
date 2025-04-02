// Firebase Firestore-powered Project Home
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { auth, db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

interface Project {
  id: string;
  title: string;
  created?: any;
  lastEdited?: any;
}

export default function ProjectHome() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const unsubscribe = onSnapshot(
    collection(db, 'users', user.uid, 'projects'),
    (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
       }as Project));
      setProjects(loaded);
      setLoading(false);
    },
    (error) => {
      console.error('Error loading projects:', error);
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  );

  return () => unsubscribe(); // Clean up listener on unmount
}, []);


  const handleCreateProject = () => {
    router.push('/createproject');
  };

  const handleOpenProject = (projectId: string) => {
    router.push({ pathname: '/projectview', params: { id: projectId } });
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Your Projects</ThemedText>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.projectItem} onPress={() => handleOpenProject(item.id)}>
            <ThemedText style={styles.projectTitle}>{item.title}</ThemedText>
            {item.lastEdited && (
              <ThemedText style={styles.projectDate}>
                Last edited: {new Date(item.lastEdited.toDate?.() || item.lastEdited).toLocaleDateString()}
              </ThemedText>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<ThemedText>No projects yet. Create one below!</ThemedText>}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateProject}>
        <ThemedText style={styles.buttonText}>Create New Project</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectDate: {
    fontSize: 14,
    color: '#777',
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
});
