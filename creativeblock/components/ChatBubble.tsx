import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

export default function ChatBubble({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.bubble} onPress={onPress}>
      <Text style={styles.icon}>🤖</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 30,
    padding: 15,
    zIndex: 999,
  },
  icon: {
    fontSize: 24,
    color: 'white',
  },
});

