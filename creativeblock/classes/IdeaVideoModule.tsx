import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '@/components/ThemedView';
import { IdeaModule } from '@/classes/IdeaModule';

export class IdeaVideoModule extends IdeaModule {
  private uri: string;

  constructor(uri: string) {
    super();
    this.uri = uri;
  }

  public getUri(): string {
    return this.uri;
  }

  public getView(onSave: () => void): JSX.Element {
    const pickVideo = async () => {
      const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!libPerm.granted) {
        return Alert.alert('Media Library permission denied');
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        this.uri = result.assets[0].uri;
        onSave();
      }
    };

    return (
      <ThemedView style={styles.videoBox}>
        {this.uri ? (
          <Video
            source={{ uri: this.uri }}
            style={styles.videoPreview}
            useNativeControls
            resizeMode="contain"
          />
        ) : (
          <View style={styles.videoPreview} />
        )}

        <Button
          title="Choose Video"
          color="gray"
          onPress={pickVideo}
        />

        {this.uri ? (
          <Button
            title="Remove Video"
            color="red"
            onPress={() => {
              this.uri = '';
              onSave();
            }}
          />
        ) : null}
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  videoBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 10,
  },
  videoPreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
});
