import { IdeaModule } from '@/classes/IdeaModule';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'
import { ThemedText } from '../app-example/components/ThemedText';
export class IdeaTextModule extends IdeaModule {
    private text: string;
    constructor(text: string) { 
        super();
        this.text = text;
    } 

    public getText(): string {
        return this.text;
    }

    public getView(): JSX.Element { // Returns a view for this module which will be shown in the idea view.
        let initialText: string = this.text;
        return (
            <ThemedView>
                <ThemedTextInput defaultValue={initialText} onChangeText={(text) => {
                    this.text = text; 
                }}>
                
                </ThemedTextInput>
            </ThemedView>
        )
    }

}