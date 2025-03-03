import React from 'react';
import { StyleSheet, Button } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation-native';
import {AddIdeasButton, TextIdea} from '@/components/Ideas.tsx';


export default function SetUpIdea() {
    return(
        <ThemedView style={{
            flex: 1,
            justifyContent: "top",
            alignItems: "stretch",
            //backgroundColor: "red",
            }}>

                <AddIdeasButton />

        </ThemedView>
    );
}


const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'flex-end',
        margin: '20',
        gap: 8,
        //overflow
        //backgroundColor: "red",
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    }
});




