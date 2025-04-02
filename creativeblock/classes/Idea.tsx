export class Idea {
    private title: string; // A brief summary of the idea.
    constructor(title: string) { // Constructor for the Idea class.
        this.title = title;
    }

    public getTitle(): string { // Getter for title.
        return this.title;
    }

    public setTitle(newTitle: string): void { // Setter for title.
        this.title = newTitle;
    }

    public toJSON() { // Serialize to JSON
        return {
            title: this.title,
        };
    }
}