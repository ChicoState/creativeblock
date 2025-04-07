import React from 'react';
import { StyleSheet, Button, Alert } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase'; // Adjust the import path as needed
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function CreateProject() {
  const [nameText, onChangeNameText] = React.useState('');
  const navigation = useNavigation();

  const [category, setcategory] = React.useState("Music");
  const data = [
    { label: 'All', value: 'All' },
    { label: 'Music', value: 'Music' },
    { label: 'Art', value: 'Art' },
    { label: 'Software', value: 'Software' },
    { label: 'Writing', value: 'Writing' },
  ];

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
        ideas: [], // Optional: pre-fill empty ideas array
        category: category 
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

<Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select item"
                searchPlaceholder="Search..."
                onChange={item => {
                    setcategory(item.value);
                }}
                renderLeftIcon={() => (
                <AntDesign style={styles.icon} color="white" name="Safety" size={20} />
                )}
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
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'light gray',
    borderBottomWidth: 0.5,
    color: "white",
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    color: "white",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "white",
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
