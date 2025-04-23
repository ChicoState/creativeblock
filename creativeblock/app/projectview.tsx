import React, { useState, useEffect, useRef } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  Dimensions,
  Animated,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  // Add ViewStyle if needed for specific style types
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Project } from '@/classes/Project';
import { Idea } from '@/classes/Idea';
import { auth, db } from './firebase'; // Assuming firebase config is correctly typed or handled
import { doc, getDoc, updateDoc, serverTimestamp, DocumentData } from 'firebase/firestore';
import { IdeaModule } from '@/classes/IdeaModule';
import { IdeaTextModule } from '@/classes/IdeaTextModule';
import { IdeaImageModule } from '@/classes/IdeaImageModule';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- Typed Modal Components ---

// Interface for IdeaCreationModal Props
interface IdeaCreationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  titleValue: string;
  onTitleChange: (text: string) => void; // Or React.Dispatch<React.SetStateAction<string>> if passing setter directly
}

const IdeaCreationModal: React.FC<IdeaCreationModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  titleValue,
  onTitleChange,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ThemedView style={styles.createModalContent}>
              <ThemedText style={styles.modalTitle}>New Idea</ThemedText>
              <ThemedTextInput
                style={[styles.fullWidthInput, styles.textInput]}
                placeholder="Title"
                value={titleValue}
                onChangeText={onTitleChange}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#4A90E2' }]}
                onPress={() => {
                  if (titleValue.trim()) {
                     onSubmit(titleValue.trim());
                  } else {
                    Alert.alert('Error', 'Idea title cannot be empty');
                  }
                }}
              >
                <ThemedText style={styles.actionButtonText}>Create</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#E2904A' }]}
                onPress={onClose}
              >
                <ThemedText style={styles.actionButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// Interface for IdeaEditModal Props
interface IdeaEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  idea: Idea; // Assumed non-null because parent conditionally renders it
  onUpdateIdea: (updatedIdea: Idea) => void;
  isSaving: boolean;
}

const IdeaEditModal: React.FC<IdeaEditModalProps> = ({
  isVisible,
  onClose,
  idea, // No longer need internal null check if type guarantees non-null
  onUpdateIdea,
  isSaving,
}) => {

    // Type the handlers for clarity (optional but good practice)
    const handleAddTextModule = (): void => {
        // Ensure getModules() and getTitle() exist on Idea class
        const updatedIdea = new Idea(idea.getTitle(), [...idea.getModules(), new IdeaTextModule('')]);
        onUpdateIdea(updatedIdea);
    };

    const handleAddImageModule = (): void => {
        const updatedIdea = new Idea(idea.getTitle(), [...idea.getModules(), new IdeaImageModule('')]);
        onUpdateIdea(updatedIdea);
    };

    const handleRemoveModule = (index: number): void => {
        const modules = idea.getModules().filter((_, i) => i !== index);
        const updatedIdea = new Idea(idea.getTitle(), modules);
        onUpdateIdea(updatedIdea);
    };

    const handleModuleUpdate = (): void => {
        // Simple shallow clone - assumes modules updated via callbacks passed from getView
        const updatedIdea = new Idea(idea.getTitle(), idea.getModules().map(mod => mod));
        onUpdateIdea(updatedIdea);
    }

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ThemedView style={styles.ideaModal}>
                    {/* header */}
                    <ThemedView style={styles.modalHeader}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={onClose}
                        >
                            <MaterialIcons name="arrow-back" size={24} color="#4A90E2" />
                            <ThemedText style={styles.backButtonText}>Back</ThemedText>
                        </TouchableOpacity>
                        <ThemedText style={styles.modalTitle}>{idea.getTitle()}</ThemedText>
                    </ThemedView>

                    {/* ONE scrollable: FlatList */}
                    <FlatList<IdeaModule> // Specify the type for FlatList data
                        keyboardShouldPersistTaps="handled"
                        data={idea.getModules()}
                        keyExtractor={(_, i) => i.toString()}
                        ListHeaderComponent={() => (
                            <ThemedView style={styles.actionsRow}>
                                <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={handleAddTextModule}
                                >
                                    <MaterialIcons name="text-fields" size={20} color="#fff" style={{ marginRight: 4 }} />
                                    <ThemedText style={styles.secondaryButtonText}>Add Text</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={handleAddImageModule}
                                >
                                    <MaterialIcons name="image" size={20} color="#fff" style={{ marginRight: 4 }} />
                                    <ThemedText style={styles.secondaryButtonText}>Add Image</ThemedText>
                                </TouchableOpacity>
                            </ThemedView>
                        )}
                        ListEmptyComponent={() => (
                            <ThemedView style={styles.emptyModulesContainer}>
                                <MaterialIcons name="lightbulb-outline" size={40} color="#888" />
                                <ThemedText style={styles.emptyModulesText}>
                                    Add text or images to flesh out your idea!
                                </ThemedText>
                            </ThemedView>
                        )}
                        ListFooterComponent={() =>
                            isSaving && (
                                <ThemedView style={styles.savingIndicator}>
                                    <ActivityIndicator color="#4A90E2" size="small" />
                                    <ThemedText style={styles.savingText}>Saving changes…</ThemedText>
                                </ThemedView>
                            )
                        }
                        renderItem={({ item, index }: { item: IdeaModule, index: number }) => ( // Type item and index
                            <ThemedView style={styles.moduleContainer}>
                                {/* Assume item.getView exists and accepts a void callback */}
                                {item.getView(handleModuleUpdate)}
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleRemoveModule(index)}
                                >
                                    <MaterialIcons name="delete" size={16} color="#fff" style={{ marginRight: 4 }} />
                                    <ThemedText style={styles.deleteButtonText}>Remove</ThemedText>
                                </TouchableOpacity>
                            </ThemedView>
                        )}
                    />
                </ThemedView>
            </KeyboardAvoidingView>
        </Modal>
    );
};


// --- Main Component ---
export default function ProjectView() {
  const [nameText, setNameText] = useState<string>(''); // Explicit type
  const [project, setProject] = useState<Project>(new Project(''));
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [isIdeaModalVisible, setIsIdeaModalVisible] = useState<boolean>(false);
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null); // Type allows null
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingChanges, setSavingChanges] = useState<boolean>(false);
  const router = useRouter();
  const { id: projectId } = useLocalSearchParams(); // Type assertion might be needed if 'id' can be string[]
  const swipeableRefs = useRef<Swipeable[]>([]); // More specific ref type

  useEffect(() => {
    const fetchProject = async () => {
      const user = auth.currentUser;
      // Ensure projectId is a string before proceeding
      if (!user || typeof projectId !== 'string') {
        setLoading(false);
        console.warn("User not logged in or Project ID is invalid/missing.");
        // Optionally redirect or show an error message
        // router.replace('/some-error-or-login-page');
        return;
      }

      try {
        const projectDocRef = doc(db, 'users', user.uid, 'projects', projectId);
        const projectDocSnap = await getDoc(projectDocRef);
        const data: DocumentData | undefined = projectDocSnap.data(); // Explicit type

        if (projectDocSnap.exists() && data) {
          // Type assertion for loaded ideas structure might be beneficial
          const loadedIdeasData = data.ideas || [];
          const loadedIdeas: Idea[] = loadedIdeasData.map((item: any) => { // Consider defining a type for 'item'
            const modules: IdeaModule[] = (item.modules || []).map((mod: any) => // Consider defining a type for 'mod'
              mod.text != null ? new IdeaTextModule(mod.text) : new IdeaImageModule(mod.image)
            );
            return new Idea(item.title || '', modules); // Provide default title
          });

          setProject(new Project(data.title || 'Untitled Project', loadedIdeas)); // Provide default title
          setIdeas(loadedIdeas);
        } else {
           console.log("No such project document!");
           // Handle case where project doesn't exist (e.g., show message, redirect)
           Alert.alert('Error', 'Project not found.');
           // router.replace('/projects'); // Example redirect
        }
      } catch (e) {
        console.error("Error fetching project: ", e);
        Alert.alert('Error', 'Failed to load project data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]); // Dependency array seems correct

  const saveProject = async (updatedIdeas: Idea[]) => {
    const user = auth.currentUser;
    // Ensure projectId is a string
    if (!user || typeof projectId !== 'string') {
      Alert.alert('Error', 'Cannot save. User not logged in or project ID is invalid.');
      return;
    }

    setSavingChanges(true);
    try {
      // Map ideas to plain objects for Firestore
      const ideasPayload = updatedIdeas.map((idea) => ({
        title: idea.getTitle(),
        modules: idea.getModules().map((m) =>
          m instanceof IdeaTextModule
            ? { text: m.getText(), image: null }
            : { text: null, image: (m as IdeaImageModule).getImage() } // Type assertion
        ),
      }));

      const projectDocRef = doc(db, 'users', user.uid, 'projects', projectId);
      await updateDoc(projectDocRef, {
        // Spread project properties if needed, or just update specific fields
        // title: project.getTitle(), // Uncomment if you want to save project title too
        ideas: ideasPayload,
        lastEdited: serverTimestamp(), // Use server timestamp
      });
      // Optional: Show success feedback
      // console.log("Project saved successfully");

    } catch (e) {
      console.error("Error saving project: ", e);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setSavingChanges(false);
    }
  };


  // Type the handler function parameter
  const handleAddIdeaSubmit = (title: string): void => {
    const newIdea = new Idea(title.trim()); // Trim title here
    const nextIdeas = [...ideas, newIdea];
    setIdeas(nextIdeas);
    saveProject(nextIdeas); // Save the updated array
    setIsCreateModalVisible(false);
    setNameText('');
  };

  // Type the handler function parameter
  const updateIdeaHandler = (updatedIdea: Idea): void => {
    const nextIdeas = ideas.map((i) => (i.getTitle() === updatedIdea.getTitle() ? updatedIdea : i));
    setIdeas(nextIdeas);
    setCurrentIdea(updatedIdea); // Keep currentIdea state synced
    saveProject(nextIdeas); // Save the updated array
  };

   const handleRemoveIdea = (indexToRemove: number): void => {
    // Close other swipeables before modifying the array
    swipeableRefs.current.forEach((ref, i) => {
      if (i !== indexToRemove && ref) {
        ref.close();
      }
    });

    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete the idea "${ideas[indexToRemove]?.getTitle() || 'this idea'}"?`, // Show title if available
      [
        { text: 'Cancel', style: 'cancel', onPress: () => {
            // Ensure the potentially opened swipeable is closed on cancel
            swipeableRefs.current[indexToRemove]?.close();
        }},
        {
          text: 'Delete',
          onPress: () => {
            const nextIdeas = ideas.filter((_, i) => i !== indexToRemove);
            setIdeas(nextIdeas);
            saveProject(nextIdeas); // Save after removal
          },
          style: 'destructive',
        },
      ],
      { cancelable: true } // Allow dismissal by tapping outside on Android
    );
  };

   const closeSwipeables = (): void => {
    swipeableRefs.current.forEach((ref) => {
      if (ref) {
        ref.close();
      }
    });
  };

  // Type the renderRightActions function parameters
   const renderRightActions = (
     _progress: Animated.AnimatedInterpolation<number>, // Usually not needed directly
     dragX: Animated.AnimatedInterpolation<number>,
     index: number // Pass index to identify which idea to remove
   ): React.ReactNode => { // Return type is ReactNode
     const trans = dragX.interpolate({
       inputRange: [-75, 0],
       outputRange: [0, 75],
       extrapolate: 'clamp',
     });
     const opacity = dragX.interpolate({
       inputRange: [-75, -20], // Adjust range for desired effect
       outputRange: [1, 0],
       extrapolate: 'clamp',
     });

     return (
       <Animated.View style={[styles.deleteActionWrapper, { opacity, transform: [{ translateX: trans }] }]}>
         <TouchableOpacity
           style={styles.deleteAction}
           onPress={() => handleRemoveIdea(index)} // Call removal handler
         >
           <MaterialIcons name="delete" size={24} color="#fff" />
         </TouchableOpacity>
       </Animated.View>
     );
   };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#4A90E2" size="large" />
        <ThemedText style={{ marginTop: 16 }}>Loading project...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={{ maxWidth: SCREEN_WIDTH - 70 }} numberOfLines={1} ellipsizeMode="tail">
           {project.getTitle()}
        </ThemedText>
         <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
            closeSwipeables();
            setIsCreateModalVisible(true);
            }}
         >
            <ThemedText style={styles.addButtonText}>+</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {ideas.length > 0 ? (
        <FlatList<Idea> // Specify the type for FlatList data
          data={ideas}
          keyExtractor={(item, i) => item.getTitle() + i} // Use a more robust key if titles aren't unique
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }: { item: Idea, index: number }) => ( // Type item and index
            <Swipeable
              ref={(ref: Swipeable | null) => { // Type the ref assignment
                  if (ref) {
                      swipeableRefs.current[index] = ref;
                  }
              }}
              containerStyle={styles.swipeableContainer}
              renderRightActions={(p, d) => renderRightActions(p, d, index)} // Pass index
              overshootRight={false}
              friction={2}
              onSwipeableWillOpen={() => {
                  // Close others when one opens
                  swipeableRefs.current.forEach((ref, i) => {
                      if (i !== index && ref) {
                          ref.close();
                      }
                  });
              }}
            >
              <TouchableOpacity
                style={styles.ideaItem}
                activeOpacity={0.7} // Add feedback on press
                onPress={() => {
                  closeSwipeables();
                  setCurrentIdea(item); // Item is guaranteed to be an Idea here
                  setIsIdeaModalVisible(true);
                }}
              >
                <ThemedText style={styles.ideaTitle} numberOfLines={1} ellipsizeMode="tail">{item.getTitle()}</ThemedText>
                 <ThemedText style={styles.modulesCount}>
                   {item.getModules().length} {item.getModules().length === 1 ? 'module' : 'modules'}
                 </ThemedText>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      ) : (
         <ThemedView style={styles.emptyStateContainer}>
            <MaterialIcons name="lightbulb-outline" size={64} color="#888" />
            <ThemedText style={styles.emptyStateText}>No ideas yet. Tap "+" to add one!</ThemedText>
        </ThemedView>
      )}

      {/* Render the external components, passing props */}
      <IdeaCreationModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleAddIdeaSubmit}
        titleValue={nameText}
        onTitleChange={setNameText}
      />

      {/* Ensure currentIdea is not null before rendering */}
      {currentIdea && (
          <IdeaEditModal
              isVisible={isIdeaModalVisible}
              onClose={() => setIsIdeaModalVisible(false)}
              idea={currentIdea} // currentIdea is confirmed non-null here
              onUpdateIdea={updateIdeaHandler}
              isSaving={savingChanges}
           />
       )}
    </ThemedView>
  );
}

// --- Styles --- (Keep styles as they were)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensure button stays right
    alignItems: 'center',
    marginBottom: 24,
  },
   addButton: {
    backgroundColor: '#4A90E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // removed marginLeft: 'auto' as justifyContent handles spacing
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  addButtonText: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 30, // Adjust for centering '+'
    marginTop: -2,  // Fine-tune vertical centering
  },
  listContainer: {
    paddingBottom: 20,
  },
  ideaItem: {
    backgroundColor: '#fff', // Assuming a light theme background for the item itself
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee', // Lighter border
    borderRadius: 8,
  },
  ideaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333', // Darker text for readability
  },
  modulesCount: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  swipeableContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden', // Important for border radius on swipe action
    backgroundColor: '#dd2c00', // Background for the delete action area
  },
  deleteActionWrapper: {
    // flex: 1, // Not needed, width is fixed
    justifyContent: 'center',
    alignItems: 'flex-end', // Align the button itself to the right
    width: 75, // Match deleteAction width
    height: '100%',
  },
  deleteAction: {
    width: 75,
    height: '100%',
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
    alignItems: 'center',
    // Removed border radius here, apply to swipeableContainer
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20, // Padding for the overlay itself
  },
  createModalContent: {
    width: Math.min(SCREEN_WIDTH * 0.85, 400), // Max width for larger screens
    backgroundColor: '#fff', // Define background for themed view
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5, // Add elevation for modal feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  ideaModal: {
    flex: 1,
    backgroundColor: '#fff', // Define background for themed view
    // Padding is applied to FlatList content/header instead
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333', // Darker text
    textAlign: 'center', // Center title in create modal
  },
  fullWidthInput: {
    width: '100%',
  },
  textInput: {
    backgroundColor: '#f8f8f8', // Slight background tint
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    fontSize: 16, // Slightly larger text
    color: '#333',
  },
  actionButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2, // Subtle elevation
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 20, // Add padding for this row
    paddingTop: 20, // Add padding top inside modal scroll
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    elevation: 1,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  moduleContainer: {
    marginBottom: 16, // Slightly less margin
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fdfdfd', // Slightly off-white background
    marginHorizontal: 20, // Add horizontal margin
  },
  deleteButton: {
    marginTop: 10, // More space above delete
    flexDirection: 'row',
    alignSelf: 'flex-end', // Move delete to the right
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#E04747', // Keep color
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12, // Smaller text for delete button
    marginLeft: 4, // Space icon and text
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Adjust for status bar
    paddingBottom: 10,
    paddingHorizontal: 10, // Less horizontal padding for header items
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff', // Header background
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // Removed margin Righ, let title take space
    padding: 10, // Make touch target larger
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 4,
  },
  // Ensure modalTitle in edit modal is flexible
  modalTitleEdit: { // Distinct style if needed
      flex: 1, // Allow title to take available space
      fontSize: 18, // Slightly smaller?
      fontWeight: '600',
      textAlign: 'center', // Center title
      marginHorizontal: 10, // Add some margin
      color: '#333',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40, // Keep padding
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
  emptyModulesContainer: {
    margin: 20, // Use margin instead of padding
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  emptyModulesText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#888',
  },
   // Adjusted saving indicator - maybe bottom right of the list view area?
  savingIndicator: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15, // Rounded pill shape
    alignItems: 'center',
    alignSelf: 'center', // Center it at the bottom
    marginBottom: 10, // Some margin from the absolute bottom
  },
  savingText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 12,
  },
});