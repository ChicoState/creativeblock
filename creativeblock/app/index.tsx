import { StyleSheet } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      >
          <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">CreativeBlock</ThemedText>
          </ThemedView>
          <Link href="/createproject"><ThemedText type="link">Create New Project</ThemedText></Link>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
