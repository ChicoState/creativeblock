import { ThemedView } from '@/components/ThemedView';
export class IdeaModule {

    public getView(onSave: () => void): JSX.Element { // Returns a view for this module which will be shown in the idea view.
        return (
            <ThemedView></ThemedView>
        )
    }
}