import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const DropdownMenu = () => {
  const [selectedValue, setSelectedValue] = useState("music");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select an option:</Text>
      <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              style={styles.picker} >

        <Picker.Item label="Music" value="music" />
        <Picker.Item label="Software" value="software" />
        <Picker.Item label="Writing" value="writing" />
        
      </Picker>
      <Text style={styles.selectedText}>You selected: {selectedValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 200,
    backgroundColor: "#fff",
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DropdownMenu;
