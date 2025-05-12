import { IdeaTextModule } from "@/classes/IdeaTextModule";
describe("Test Text Idea Class", ()=> {
    test("Make sure setter is working properly", ()=> {
      const myTextIdea = new IdeaTextModule("Test");
      expect(myTextIdea.getText()).toBe("Test");
    });
    test("Test empty set function", ()=> {
      const myTextIdea = new IdeaTextModule("");
      expect(myTextIdea.getText()).toBe("");
    });
  })
