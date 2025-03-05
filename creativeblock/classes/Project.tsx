import { Idea } from '@/classes/Idea'


export class Project {
    private title: string; // Name of the project.
    private ideas: Idea[] = []; // Array of ideas.

    constructor(title: string) { // Constructor for the Project class.
        this.title = title;
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

    public addIdea(newIdea?: Idea): void { // Adds a new idea. Will
        if (newIdea) {
            this.ideas.push(newIdea);
        } else {
            this.ideas.push(new Idea('', ''));
        }
    }

    public updateIdea(index: number, newIdea: Idea): void { // Updates the idea at the given index with a new value.
        this.ideas[index] = newIdea;
    }

    public removeIdea(index: number): void { // Removes idea at given index.
        this.ideas.splice(index, 1);
    }
}