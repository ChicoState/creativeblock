export class Idea {
    private title: string; // A brief summary of the idea.
    private desc: string;

    constructor(title: string, desc: string) { // Constructor for the Idea class.
        this.title = title;
        this.desc = desc;
    }

    public getTitle(): string { // Getter for title.
        return this.title;
    }

    public setTitle(newTitle: string): void { // Setter for title.
        this.title = newTitle;
    }

    public getDesc(): string { // Getter for desc.
        return this.desc;
    }

    public setDesc(newDesc: string):void { // Setter for desc.
        this.desc = newDesc;
    }

    public toJSON() { // Serialize to JSON
        return {
            title: this.title,
            desc: this.desc,
        };
    }
}