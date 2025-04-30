import { Idea } from '@/classes/Idea'


export class Project {
    private title: string; // Name of the project.
    private category: string;
    private ideas: Idea[] = []; // Array of ideas.
    private is_public : bool;

    constructor(title: string, category?: string, ideas?: Idea[]) { // Constructor for the Project class.
        this.title = title;
        this.category = (category) ? category : "";
        if (ideas) this.ideas = ideas;
    }
    public getTitle(): string { // Getter for title.
        return this.title;
    }

    public setTitle(newTitle: string): void { // Setter for title.
        this.title = newTitle;
    }

    public getIdeas(): Idea[] { // Returns array of ideas.
        return this.ideas;
    }

public getIsPublic() : bool {
    return is_public;
    }

public setIsPublic (newPublicity) : void {
    this.is_public = newPublicity;
    }

    public addIdea(newIdea?: Idea): void { // Adds a new idea. Will
        if (newIdea) {
            this.ideas.push(newIdea);
        } else {
            this.ideas.push(new Idea(''));
        }
    }

    public updateIdea(index: number, newIdea: Idea): void { // Updates the idea at the given index with a new value.
        this.ideas[index] = newIdea;
    }

    public removeIdea(index: number): void { // Removes idea at given index.
        this.ideas.splice(index, 1);
    }

    public toJSON() { // Serialize to JSON
        return {
            title: this.title,
            ideas: this.ideas.map(idea => idea.toJSON()), 
        };
    }
}