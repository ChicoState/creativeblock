import { IdeaModule } from '@/classes/IdeaModule';
import { Idea } from "@/classes/Idea";


describe("Test Idea Class", ()=> {
    test("Test get and set title", ()=> {
        var myidea = new Idea("");
        myidea.setTitle("NewTitle")
        expect(myidea.getTitle()).toBe("NewTitle");
      });

      test("Test adding Idea Modules", ()=> {
        var mods :IdeaModule[] = [];
        var myidea = new Idea("",mods);
        myidea.addModule(new IdeaModule());
        myidea.addModule(new IdeaModule());

        mods = myidea.getModules();
        expect(mods.length).toBe(2);
      });

      test("Test removing Idea Modules", ()=> {
        var mods :IdeaModule[] = [];
        var myidea = new Idea("",mods);
        myidea.addModule(new IdeaModule());
        myidea.addModule(new IdeaModule());
        myidea.addModule(new IdeaModule());
        myidea.removeModule(0);
        myidea.removeModule(0);
        mods = myidea.getModules();
        expect(mods.length).toBe(1);
      });

      test("Test removing Idea Modules while empty", ()=> {
        var mods :IdeaModule[] = [];
        var myidea = new Idea("",mods);
        expect( myidea.removeModule(0)).toBe(undefined);
      });      

      test("Test removing Idea Modules while out of bounds", ()=> {
        var mods :IdeaModule[] = [];
        var myidea = new Idea("",mods);
        myidea.addModule(new IdeaModule());
        myidea.addModule(new IdeaModule());
        expect( myidea.removeModule(3)).toBe(undefined);
      });   
})