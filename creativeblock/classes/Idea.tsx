import { IdeaModule } from '@/classes/IdeaModule';

export class Idea {
    private title: string; // A brief summary of the idea.
    private modules: IdeaModule[] = [];
    constructor(title: string, modules?: IdeaModule[]) { // Constructor for the Idea class.
        this.title = title;
        if (modules) this.modules = modules;
    }

    public getTitle(): string { // Getter for title.
        return this.title;
    }

    public setTitle(newTitle: string): void { // Setter for title.
        this.title = newTitle;
    }

    public getModules(): IdeaModule[] {
        return this.modules;
    }

    public addModule (module: IdeaModule) {
        this.modules.push(module);
    }

    public removeModule(index: number) {
        const updated = this.modules.filter((_, i) => i !== index);
        this.modules = updated;
    }


    public toJSON() { // Serialize to JSON
        return {
            title: this.title,
            modules:  this.modules
        };
    }
}