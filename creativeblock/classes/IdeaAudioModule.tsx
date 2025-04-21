import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { ThemedText } from '@/components/ThemedText';
import { IdeaModule } from '@/classes/IdeaModule';

export class IdeaAudioModule extends IdeaModule {
  private uri: string;
  constructor(uri: string) {
    super();
    this.uri = uri;
  }
  public getUri() { return this.uri; }

  public getView(onSave: () => void): JSX.Element {
    // internal component for recording/playback
    return <AudioRecorder initialUri={this.uri} onSave={newUri => {
      this.uri = newUri;
      onSave();
    }} />;
  }
}

type AudioRecorderProps = {
  initialUri: string,
  onSave: (uri: string) => void,
};
function AudioRecorder({ initialUri, onSave }: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [uri, setUri] = useState(initialUri);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Audio.requestPermissionsAsync();
    Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
  }, []);

  const start = async () => {
    setLoading(true);
    const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(recording);
    setLoading(false);
  };
  const stop = async () => {
    if (!recording) return;
    setLoading(true);
    await recording.stopAndUnloadAsync();
    const newUri = recording.getURI()!;
    setUri(newUri);
    setRecording(null);
    onSave(newUri);
    setLoading(false);
  };
  const play = async () => {
    if (!uri) return;
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {loading && <ActivityIndicator />}
      {!recording
        ? <TouchableOpacity onPress={start}><ThemedText>[●] Record</ThemedText></TouchableOpacity>
        : <TouchableOpacity onPress={stop}><ThemedText>[■] Stop</ThemedText></TouchableOpacity>
      }
      {!!uri && <TouchableOpacity onPress={play} style={{ marginTop: 5 }}>
        <ThemedText>[►] Play</ThemedText>
      </TouchableOpacity>}
    </View>
  );
}
