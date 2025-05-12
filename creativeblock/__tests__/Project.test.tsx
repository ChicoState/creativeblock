import { Idea } from "@/classes/Idea";
import { Project } from "@/classes/Project";

describe("Test Project Class", ()=> {
    test("Test get and set title", ()=> {
        const myideas: Idea[] = []
        const myProj = new Project("Test");
        myProj.setTitle("NewTitle")
        const title = myProj.getTitle();
        expect(title).toBe("NewTitle");
      });

      test("Test get and set title with empty string", ()=> {
        const myideas: Idea[] = []
        const myProj = new Project("Test");
        myProj.setTitle("")
        const title = myProj.getTitle();
        expect(title).toBe("");
      });

      test("Testing Idea Adding", ()=> {
        var myideas: Idea[] = []
        const myProj = new Project("Test","Music",myideas);
        myProj.addIdea(new Idea("test1"));
        myProj.addIdea(new Idea("test2"));
        myProj.addIdea(new Idea("test3"));
        myideas = myProj.getIdeas();

        expect(myideas.length).toBe(3);
      });

      test("Testing Idea Removing", ()=> {
        var myideas: Idea[] = []
        const myProj = new Project("Test","Music",myideas);
        myProj.addIdea(new Idea("test1"));
        myProj.addIdea(new Idea("test2"));
        myProj.addIdea(new Idea("test3"));
        myProj.removeIdea(0);
        myProj.removeIdea(0);
        myideas = myProj.getIdeas();

        expect(myideas.length).toBe(1);
      });

      test("Testing Idea Removing take the correct index", ()=> {
        var myideas: Idea[] = []
        const myProj = new Project("Test","Music",myideas);
        myProj.addIdea(new Idea("test1"));
        myProj.addIdea(new Idea("test2"));
        myProj.addIdea(new Idea("test3"));
        myProj.removeIdea(0);
        myProj.removeIdea(0);
        myideas = myProj.getIdeas();

        expect(myideas[0].getTitle()).toBe("test3");
      });

      test("Testing Idea Updating", ()=> {
        var myideas: Idea[] = []
        const myProj = new Project("Test","Music",myideas);
        myProj.addIdea(new Idea("test1"));
        myProj.updateIdea(0,new Idea("testUpdate"))
        myideas = myProj.getIdeas();

        expect(myideas[0].getTitle()).toBe("testUpdate");
      });

      test("Testing Removing from empy idea list", ()=> {
        var myideas: Idea[] = []
        const myProj = new Project("Test","Music",myideas);
        expect(myProj.removeIdea(0)).toBe(undefined);
      });

      test("Testing Removing from out of bounds", ()=> {
        var myideas: Idea[] = []
        const myProj = new Project("Test","Music",myideas);
        myProj.addIdea(new Idea("test1"));
        myProj.addIdea(new Idea("test2"));
        expect(myProj.removeIdea(3)).toBe(undefined);
      });
})