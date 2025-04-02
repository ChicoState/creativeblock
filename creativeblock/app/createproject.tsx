import React from 'react';
import { StyleSheet, Button, Alert } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase'; // Adjust the import path as needed

export default function CreateProject() {
  const [nameText, onChangeNameText] = React.useState('');
  const navigation = useNavigation();

  const handleCreate = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be signed in to create a project.");
      return;
    }

    if (!nameText.trim()) {
      Alert.alert("Error", "Project title cannot be empty.");
      return;
    }

    try {
      const newProject = {
        title: nameText.trim(),
        created: serverTimestamp(),
        lastEdited: serverTimestamp(),
        ideas: [] // Optional: pre-fill empty ideas array
      };

      await addDoc(collection(db, 'users', user.uid, 'projects'), newProject);

      console.log("Created project:", nameText);
      navigation.goBack(); // Go back to projecthome
      navigation.navigate('projecthome' as never);
    } catch (error: any) {
      console.error("Failed to save project:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "stretch" }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Create New Project</ThemedText>
      </ThemedView>

      <ThemedTextInput
        placeholder="Project Title"
        onChangeText={onChangeNameText}
        value={nameText}
      />

      <ThemedView style={styles.bottomContainer}>
        <Button title="Create" onPress={handleCreate} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  }
});
