import React from 'react';
import { StyleSheet } from 'react-native';
import { IdeaModule } from '@/classes/IdeaModule';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput';

export class IdeaTextModule extends IdeaModule {
  constructor(private text: string) { super(); }
  getText() { return this.text; }

  // ---- return a proper component that uses hooks ----
  getView(onSave: () => void): JSX.Element {
    const moduleRef = this;                // capture class instance
  
    const AutoGrowTextInput: React.FC = () => {
      /* keep text in component state so it re-renders as you type */
      const [text, setText] = React.useState<string>(moduleRef.text);
      const [height, setHeight] = React.useState<number>(80);
  
      return (
        <ThemedView>
          <ThemedTextInput
            multiline
            value={text}                                  /* <- use local state */
            onChangeText={(t) => {
              setText(t);                                 /* re-render */
              moduleRef.text = t;                         /* store in class */
            }}
            onEndEditing={onSave}
            onContentSizeChange={(e) =>
              setHeight(Math.max(80, e.nativeEvent.contentSize.height + 20))
            }
            style={[styles.input, { height }]}
            textAlignVertical="top"
            placeholder="Start typing…"
          />
        </ThemedView>
      );
    };
  
    return <AutoGrowTextInput />;
  }
  
}

/* styles */
const styles = StyleSheet.create({
  input: {
    color: '#333',
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});
