import { ThemedView } from '@/components/ThemedView';
export class IdeaModule {

    public getView(): JSX.Element { // Returns a view for this module which will be shown in the idea view.
        return (
            <ThemedView></ThemedView>
        )
    }
}