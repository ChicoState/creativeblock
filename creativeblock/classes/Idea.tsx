import { IdeaModule } from '@/classes/IdeaModule';

export class Idea {
    private title: string; // A brief summary of the idea.
    private modules: IdeaModule[] = [];
    constructor(title: string, comps?: IdeaModule[]) { // Constructor for the Idea class.
        this.title = title;
        if (comps) {
            this.modules = comps;
        }
    }

    public getTitle(): string { // Getter for title.
        return this.title;
    }

    public setTitle(newTitle: string): void { // Setter for title.
        this.title = newTitle;
    }

    public addModules (module: IdeaModule) {
        this.modules.push(module);
    }


    public toJSON() { // Serialize to JSON
        return {
            title: this.title,
            modules:  this.modules
        };
    }
}