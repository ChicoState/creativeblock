import { IdeaModule } from '@/classes/IdeaModule';

export class IdeaImageModule extends IdeaModule {
    private image: string;
    constructor(image: string) {
        super();
        this.image = image;
    }

    public getImage(): string {
        return this.image;
    }
}