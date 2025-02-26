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
}