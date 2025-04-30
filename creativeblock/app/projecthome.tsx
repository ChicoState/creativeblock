// Firebase Firestore-powered Project Home
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Alert, Text } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { auth, db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons'; // for clean minimalist icons
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

interface Project {
    id: string;
    title: string;
    category: string
    created?: any;
    lastEdited?: any;
}


export default function ProjectHome() {

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [isFocus, setIsFocus] = useState(false);
    const [value, setValue] = useState(null);
    const [category_filter, set_category_filter] = useState("All")
    const data = [
      { label: 'All', value: 'All' },
      { label: 'Music', value: 'Music' },
      { label: 'Art', value: 'Art' },
      { label: 'Software', value: 'Software' },
      { label: 'Writing', value: 'Writing' },
    ];

    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <ThemedText style={[styles.label, isFocus && { color: '#4A90E2' }]}>
            Select filter
          </ThemedText>
        );
      }
      return null;
    };


    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const unsubscribe = onSnapshot(
            collection(db, 'users', user.uid, 'projects'),
            (snapshot) => {
                const loaded = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                } as Project));
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

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace('/'); // send them back to login
        } catch (error: any) {
            console.error('Error signing out:', error);
            Alert.alert('Sign Out Error', error.message);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        Alert.alert(
            'Delete Project',
            'Are you sure you want to delete this project?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const user = auth.currentUser;
                        if (!user) return;

                        try {
                            await deleteDoc(doc(db, 'users', user.uid, 'projects', projectId));
                            // Real-time updates via onSnapshot will auto-refresh the list
                        } catch (error: any) {
                            console.error('Delete error:', error);
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };


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

            <ThemedView>
              {renderLabel()}
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: '#4A90E2' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select filter' : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setValue(item.value);
                  setIsFocus(false);
                  set_category_filter(item.value)
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color={isFocus ? '#4A90E2' : 'white'}
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </ThemedView>

            <FlatList
                data={
                    category_filter === "All"
                        ? projects
                        : projects.filter(item => item.category === category_filter)
                }
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ThemedView style={styles.projectRow}>
                        <TouchableOpacity onPress={() => handleOpenProject(item.id)} style={styles.projectInfo}>
                            <ThemedText style={styles.projectTitle}>{item.title}</ThemedText>
                            {item.lastEdited && (
                                <ThemedText style={styles.projectDate}>
                                    Last edited: {new Date(item.lastEdited.toDate?.() || item.lastEdited).toLocaleDateString()}
                                </ThemedText>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleDeleteProject(item.id)}>
                            <Feather name="trash-2" size={20} color="#ff4d4d" />
                        </TouchableOpacity>
                    </ThemedView>


                )}
                ListEmptyComponent={<ThemedText>No projects yet. Create one below!</ThemedText>}
            />

            <TouchableOpacity style={styles.createButton} onPress={handleCreateProject}>
                <ThemedText style={styles.buttonText}>Create New Project</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
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

  signOutButton: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  deleteText: {
    color: '#fff',
    fontWeight: 'bold',

  },
  
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },

  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginRight: 12,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'relative',
    // backgroundColor: 'black',
    color: "gray",
    left: 0,
    top: 0,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 11,
  },
  placeholderStyle: {
    color: "gray",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "gray",
    fontSize: 16,
  },
  iconStyle: {
    color: "gray",
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});