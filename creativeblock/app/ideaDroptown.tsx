import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface IdeaDropdownProps {
  visible: boolean;               
  onSelect: (type: string) => void;
}

const IDEA_TYPES = ['image', 'voice', 'text', 'video'];

export function IdeaDropdown({ visible, onSelect }: IdeaDropdownProps) {
  if (!visible) return null;

  return (
    <View style={styles.dropdownContainer}>
      {IDEA_TYPES.map(type => (
        <TouchableOpacity 
          key={type} 
          style={styles.dropdownItem} 
          onPress={() => onSelect(type)}
        >
          <ThemedText>{type}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    right: 20,
    top: 55,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 999,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
export default IdeaDropdown;


