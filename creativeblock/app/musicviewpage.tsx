import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { useRouter, useFocusEffect } from 'expo-router';
import {SheetMusicDisplay} from '@/classes/SheetMusic'
import { View } from 'react-native';
import VexFlowComponent from '@/components/VexFlowComponent';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

    const CheckMusic = ({ navigation }) => {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>


          <Text>Details Screen</Text>
          <Button
            title="Show Music"
            onPress={() => SheetMusicDisplay}
          />
        </View>
      );
    };




const TryOSMD = () => {
  return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OpenSheetMusicDisplay Example</title>
                <script src="https://cdn.jsdelivr.net/npm/opensheetmusicdisplay@0.10.1/build/opensheetmusicdisplay.min.js"></script>
            </head>
            <body>
                <div id="osmd-container" style="width: 100%; height: 100vh;"></div>
                <script>
                    window.onload = function () {
                        const osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmd-container");
                        osmd.load("https://example.com/path/to/musicxml/file.xml").then(function() {
                            osmd.render();
                        }).catch(function(error) {
                            console.error("Error loading MusicXML:", error);
                        });
                    }
                </script>
            </body>
            </html>
          ` }}
        />
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });


    export default TryOSMD;







