import { IdeaModule } from '@/classes/IdeaModule';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTextInput } from '@/components/ThemedTextInput'
import { ThemedText } from '../app-example/components/ThemedText';

export class Idea

TextModule extends IdeaModule {
    private text: string;
    constructor(text: string) { 
        super();
        this.tet = text;
    }

    public getView(): JSX.Element { // Returns a view for this module which will be shown in the idea view.
        let initialText: string = this.text;
        return (
            <ThemedView>
                <ThemedTextInput defaultValue = {initialText}>
                
                </ThemedTextInput>
            </ThemedView>
        )
    }

}