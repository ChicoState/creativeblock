import React from 'react';
import { StyleSheet, Button } from "react-native";
import { memo, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput'

enum IdeaTypes {
  Images = "images",
  TextBox = "text_box"
}

 function AddIdeasButton (){
     const [ideas, setIdeas] = React.useState([]);
    const [ideaID, setIdeaID] = React.useState(0);
     function RemoveTextIdea(index){
         let newIdeas = ideas.filter((i)=> {return index != i})
         setIdeas(newIdeas);
         }
     return(
         <>
         <ThemedView style={styles.titleContainer}>
            <Button title = "Add an Idea" onPress = {()=>{setIdeas([...ideas , ideaID]); setIdeaID(ideaID+1) }}  />

        </ThemedView>

        <ThemedView style = {styles.bottomContainer}>
            {ideas.map((i)=>{return <TextIdea key = {i} RemoveTextIdea = {RemoveTextIdea} index = {i}/>})}
        </ThemedView>
        </>
         );
 }



function TextIdea({RemoveTextIdea, index})
{
    const [nameText, onChangeNameText] = React.useState('');
    return (
        <>
         <ThemedTextInput  placeholder="Type out your thoughts!" onChangeText={onChangeNameText} value={nameText} />

         <ThemedView style = {styles.titleContainer}>
         <Button title = "Remove This Idea" onPress = {()=> {RemoveTextIdea(index)}}  />
         </ThemedView>
        </>
        );

}
export {AddIdeasButton, TextIdea};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'flex-end',
        margin: '20',
        gap: 8,
        //backgroundColor: "red",
    },
    bottomContainer: {
        //flex: 1,
        justifyContent: 'center',
    }
});





