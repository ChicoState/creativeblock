import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { ThemedText } from '@/components/ThemedText';
import { IdeaModule } from '@/classes/IdeaModule';

// debugg
console.log("Camera.Constants is:", Camera?.Constants);

// module class

export class IdeaVideoModule extends IdeaModule {
  private uri: string;
  constructor(uri: string) {
    super();
    this.uri = uri;
  }

  public getUri() {
    return this.uri;
  }

  public getView(onSave: () => void): JSX.Element {
      console.log("Rendering VideoRecorder:", typeof VideoRecorder); //debug
    return (
      <VideoRecorder
        initialUri={this.uri}
        onSave={(newUri) => {
          this.uri = newUri;
          onSave();
        }}
      />
    );
  }
}

// recorder

type VideoRecorderProps = {
  initialUri: string;
  onSave: (uri: string) => void;
};

function VideoRecorder({ initialUri, onSave }: VideoRecorderProps) {
  const [hasCamPerm, setHasCamPerm] = useState<boolean | null>(null);
  const [hasLibPerm, setHasLibPerm] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const [uri, setUri] = useState(initialUri);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const camStatus = await Camera.requestCameraPermissionsAsync();
      setHasCamPerm(camStatus.status === 'granted');
      const libStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasLibPerm(libStatus.status === 'granted');
    })();
  }, []);

  const startRecording = async () => {
    if (!cameraRef.current) return Alert.alert('Camera not ready');
    setLoading(true);
    const video = await cameraRef.current.recordAsync();
    setUri(video.uri);
    onSave(video.uri);
    setRecording(true);
    setLoading(false);
  };

  const stopRecording = () => {
    cameraRef.current?.stopRecording();
    setRecording(false);
  };

  const pickVideo = async () => {
    if (!hasLibPerm) return Alert.alert('Library permission not granted');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const picked = result.assets[0].uri;
      setUri(picked);
      onSave(picked);
    }
  };

  if (hasCamPerm === null || hasLibPerm === null) {
    return <ActivityIndicator style={{ margin: 10 }} />;
  }

  return (
    <View style={styles.container}>
      {hasCamPerm && (
        <Camera
          ref={cameraRef}
          style={styles.cameraPreview}
          type={Camera?.Constants?.Type?.back ?? 0} // Safe access
        />
      )}

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={recording ? stopRecording : startRecording}
        >
          <ThemedText>{recording ? '[■] Stop' : '[●] Record'}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickVideo}>
          <ThemedText>[📁] Pick Video</ThemedText>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={{ margin: 10 }} />}

      {uri ? (
        <Video
          source={{ uri }}
          style={styles.videoPlayback}
          useNativeControls
          resizeMode="contain"
        />
      ) : (
        <ThemedText>No video yet</ThemedText>
      )}
    </View>
  );
}

// styles

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  cameraPreview: {
    width: 250,
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    marginHorizontal: 8,
    padding: 6,
    borderWidth: 1,
    borderRadius: 4,
  },
  videoPlayback: {
    width: 250,
    height: 180,
    marginTop: 8,
  },
});
