import {
  AppCore,
  Selecting,
  ScrollableList,
  SelectingTitles as Selectings,
  SimpleTitles as Simples,
  Texts,
} from './_globals';
import {
  Facets,
  newInstance,
  Target,
} from 'facets-js';
import {traceThing} from '../util/_globals';
import contents=Texts.contents;
export class ContentingApp extends AppCore{
  private readonly fullListTargets=true;
  private readonly chooserTitle=Selectings.Chooser;
  private readonly indexingTitle=Simples.Indexing;
  private readonly list:ScrollableList;
  constructor(readonly layoutBuild:(f:Facets,fullListTargets:boolean)=>void){
    super(newInstance(false));
    this.list=new ScrollableList(Texts.contents,3,this.facets,this.indexingTitle);
  }
  newContentTrees():Target|Target[]{
    function activateChooser(){
      f.activateContentTree(Selectings.Chooser);
    }
    function newContentTree(content:Texts.Content):Target{
      function newEditTarget(indexed:Texts.Content,tail:string,onTextEdit:()=>void){
        return f.newTextualTarget(Selectings.TextEditField+tail,{
          passText:indexed.text,
          targetStateUpdated:(state,title)=>{
            indexed.text=state as string;
            onTextEdit();
          },
        })
      }
      function newCharsTarget(tail:string){
        return f.newTextualTarget(Selectings.CharsCount+tail,{
          getText:(title)=>''+(f.getTargetState(
            Selectings.TextEditField+Texts.Type.ShowChars.titleTail)as string).length,
        })
      }
      let type=Texts.Type.getContentType(content);
      let tail=type.titleTail;
      let members:Target[]=[];
      const saveTitle=Selectings.SaveEditButton+tail;
      const onTextEdit=()=>{
        f.setTargetLive(saveTitle,true)
      };
      members.push(newEditTarget(content,tail,onTextEdit));
      if(type==Texts.Type.ShowChars) members.push(newCharsTarget(tail));

      members.push(f.newTriggerTarget(saveTitle,{
        passLive:false,
        targetStateUpdated:(state,title)=>{
          active.copyClone(edit);
          activateChooser();
        },
      }));
      members.push(f.newTriggerTarget(Selectings.CancelEditButton+tail,{
        targetStateUpdated:(state,title)=>activateChooser(),
      }));
      return f.newTargetGroup(type.name,members);
    }
    let f=this.facets;
    let active:Texts.Content,edit:Texts.Content;
    let chooserTargets=this.fullListTargets?Selecting.newActionTargets(f,this.list):[];
    chooserTargets.push(
      f.newTriggerTarget(Selectings.OpenEditButton,{
        targetStateUpdated:()=>{
          active=this.facets.getIndexingState(this.indexingTitle).indexed;
          traceThing('^targetStateUpdated');
          this.facets.addContentTree(newContentTree(
            edit=active.clone()));
        },
      }));
    let trees:Target[]=[];
    trees.push(
      newContentTree(contents[0]),
      newContentTree(contents[1]),
      f.newIndexingFrame({
        frameTitle:this.chooserTitle,
        indexingTitle:this.indexingTitle,
        getIndexables:()=>this.list.getScrolledItems(),
        newFrameTargets:()=>chooserTargets,
        newUiSelectable:(item:Texts.Content)=>item.text,
      }));
    return trees;
  }
  onRetargeted(activeTitle:string){
    if(this.fullListTargets) Selecting.facetsRetargeted(this.facets);
    traceThing('^disableAll',activeTitle);
  }
  buildLayout(){
    this.layoutBuild(this.facets,this.fullListTargets)
  }
}

