import { IdeaModule } from '@/classes/IdeaModule';

export class IdeaTextComponent extends IdeaModule {
    private text: string;
    constructor(text: string) { 
        super();
        this.text = text;
    }
}