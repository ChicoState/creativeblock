import { IdeaModule } from '@/classes/IdeaModule';

export class IdeaImageComponent extends IdeaModule {
    private image: string;
    constructor(image: string) {
        super();
        this.image = image;
    }
}