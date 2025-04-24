import { IdeaModule } from '@/classes/IdeaModule';
import React, { useState } from 'react';
import { Alert, Button, View, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'; 

export class IdeaImageModule extends IdeaModule {
    private image: string;
    private caption: string = '' 

    constructor(image: string) {
        super();
        this.image = image;
    }

    public getImage(): string {
        return this.image;
    }
    public getCaption() { return this.caption; }

    
    
    

    public getView(onSave: () => void): JSX.Element {

        const handleImagePress = async (source: 'camera' | 'gallery') => {
        let result;
        if (source === 'camera') {
            const camPerm = await ImagePicker.requestCameraPermissionsAsync();
            if (!camPerm.granted) return Alert.alert("Camera permission denied");
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: false,
            });
        } else {
            const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!libPerm.granted) return Alert.alert("Media Library permission denied");
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: false,
            });
        }

        if (!result.canceled && result.assets.length > 0) {
            this.image = result.assets[0].uri;
            onSave();
        }
    };

    const showImagePickerPrompt = () => {
        Alert.alert(
            "Choose Image Source",
            "How would you like to add your image?",
            [
                { text: "Camera", onPress: () => handleImagePress('camera') },
                { text: "Gallery", onPress: () => handleImagePress('gallery') },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };


        return (
            <ThemedView style={styles.imageBox}>
                {this.image ? <Image
                    source={{ uri: this.image }}
                    style={styles.imagePreview}
                /> : null}

                <ThemedTextInput
                        placeholder="Add caption…"
                        value={this.caption}
                        onChangeText={(t) => {
                            this.caption = t;
                            onSave();                    // notify parent to re-save
                        }}
                        style={styles.captionInput}
                        />
                <Button
                    title="Choose Image"
                    color="gray"
                    onPress={() => { showImagePickerPrompt(); } }
                />
                <Button
                    title="Remove Image"
                    color="red"
                    onPress={() => { this.image = ""; onSave(); } }
                />
            </ThemedView>
        );
    }
}


const styles = StyleSheet.create({
    imageBox: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        marginBottom: 10,
        marginRight: 10,
    },
    imagePreview: {
        width: '100%', 
        aspectRatio: 1,  
        borderRadius: 10,
        marginBottom: 10,
    },
    captionInput: {
        alignSelf: 'stretch',
        marginBottom: 10,
      },
});