import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { ThemedText } from '@/components/ThemedText';
import { IdeaModule } from '@/classes/IdeaModule';

export class IdeaAudioModule extends IdeaModule {
  private uri: string;

  constructor(uri: string) {
    super();
    this.uri = uri;
  }

  public getUri() {
    return this.uri;
  }

  public getView(onSave: () => void): JSX.Element {
    return (
      <AudioRecorder
        initialUri={this.uri}
        onSave={(newUri) => {
          this.uri = newUri;
          onSave();
        }}
      />
    );
  }
}

type AudioRecorderProps = {
  initialUri: string;
  onSave: (uri: string) => void;
};

export function AudioRecorder({ initialUri, onSave }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [uri, setUri] = useState(initialUri);
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please allow audio recording permissions.');
          return;
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
        });
      } catch (err) {
        console.error('Audio setup error:', err);
        Alert.alert('Error', 'Failed to set up audio mode.');
      }
    })();

    return () => {
      sound?.unloadAsync();
    };
  }, []);

  const startRecording = async () => {
    try {
      setLoading(true);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Recording start error:', err);
      Alert.alert('Error', 'Unable to start recording');
    } finally {
      setLoading(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      setLoading(true);
      await recording.stopAndUnloadAsync();
      const newUri = recording.getURI()!;
      console.log('Recorded URI:', newUri);
      setUri(newUri);
      setRecording(null);
      onSave(newUri);
    } catch (err) {
      console.error('Recording stop error:', err);
      Alert.alert('Error', 'Unable to stop recording');
    } finally {
      setLoading(false);
    }
  };

  const playSound = async () => {
    if (!uri) return;
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      await newSound.setVolumeAsync(1.0);
      console.log('Playback status on load:', status);
      newSound.setOnPlaybackStatusUpdate((s) => console.log('Playback status:', s));
      setSound(newSound);
    } catch (err) {
      console.error('Playback error:', err);
      Alert.alert('Error', 'Unable to play audio');
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator />}
      <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={styles.button}>
        <ThemedText>{recording ? '[■] Stop' : '[●] Record'}</ThemedText>
      </TouchableOpacity>
      {!!uri && (
        <TouchableOpacity onPress={playSound} style={styles.button}>
          <ThemedText>[►] Play</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  button: {
    marginRight: 12,
  },
});
