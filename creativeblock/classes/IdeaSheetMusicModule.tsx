import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { IdeaModule } from '@/classes/IdeaModule';
import { ThemedView } from '@/components/ThemedView';
import { View, Text } from 'react-native';
import MozartPianoSonata from '../assets/MozartPianoSonata.musicxml';

export class IdeaSheetMusicModule extends IdeaModule {
    private sheet: string;

    constructor(sheet: string) {
        super();
        this.sheet = sheet;
    }

    public getSheet() :string {
        return this.sheet;
    }

    public getView(onSave: () => void): JSX.Element {

    const MusicXMLViewer = () => {
      const [xmlData, setXmlData] = useState(null);
      const [htmlContent, setHtmlContent] = useState('');

/*
useEffect(() => {
           const loadMusicXML = async () => {
             try {
               // Example: loading from the app's document directory
               const filePath = RNFS.DocumentDirectoryPath + '@/assets/ActorPreludeSample.xml';
               const fileContents = await RNFS.readFile(filePath);
               setXmlData(fileContents);
             } catch (error) {
               console.error('Failed to load XML file:', error);
             }
           };


        loadMusicXML();
      }, []);
*/
      useEffect(() => {
         setXmlData(MozartPianoSonata);
        if (xmlData) {
          // Embed the XML data into a basic HTML template for OSMD
          const osmdHtmlContent = `
            <html>
              <head>
                <script src="https://unpkg.com/opensheetmusicdisplay@0.9.0/dist/opensheetmusicdisplay.min.js"></script>
              </head>
              <body>
                <div id="osmd-container" style="width: 100%; height: 100%"></div>
                <script>
                  const osmd = new OpenSheetMusicDisplay("osmd-container");
                  const xml = \`${xmlData}\`;
                  osmd.load(xml).then(() => {
                    osmd.render();
                  });
                </script>
              </body>
            </html>
          `;
          setHtmlContent(osmdHtmlContent);
        }
      }, [xmlData]);

      if (!htmlContent) {
        return (
          <View>
            <Text>Loading music...</Text>
          </View>
        );
      }

      return (
        <View style={{ flex: 1 }}>
          {/* WebView to render the music notation */}
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={{ flex: 1 }}
          />
        </View>
      );
    };


    }
}










