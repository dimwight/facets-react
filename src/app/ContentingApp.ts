import {
  AppCore,
  Selecting,
  ScrollableList,
  SelectingTitles,
  SimpleTitles,
  Texts,
} from './_globals';
import {
  Facets,
  newInstance,
  Target,
} from 'facets-js';
import {traceThing} from '../util/_globals';
import {
  IndexingList,
  PanelRow,
  RowPanel,
  ShowPanel,
  TextualField,
  TextualLabel,
  TriggerButton,
} from '../react/_globals';
import ReactDOM from 'react-dom';
import React from 'react';
import contents=Texts.contents;
export class ContentingApp extends AppCore{
  private readonly fullListTargets=true;
  private readonly chooserTitle=SelectingTitles.Chooser;
  private readonly indexingTitle=SimpleTitles.Indexing;
  private readonly list:ScrollableList;
  constructor(readonly layoutBuild:(f:Facets,fullListTargets:boolean)=>void){
    super(newInstance(false));
    this.list=new ScrollableList(Texts.contents,3,this.facets,this.indexingTitle);
  }
  newContentTrees():Target|Target[]{
    function activateChooser(){
      f.activateContentTree(SelectingTitles.Chooser);
    }
    function newContentTree(content:Texts.Content):Target{
      function newEditTarget(indexed:Texts.Content,tail:string,onTextEdit:()=>void){
        return f.newTextualTarget(SelectingTitles.TextEditField+tail,{
          passText:indexed.text,
          targetStateUpdated:(state,title)=>{
            indexed.text=state as string;
            onTextEdit();
          },
        })
      }
      function newCharsTarget(tail:string){
        return f.newTextualTarget(SelectingTitles.CharsCount+tail,{
          getText:(title)=>''+(f.getTargetState(
            SelectingTitles.TextEditField+Texts.Type.ShowChars.titleTail)as string).length,
        })
      }
      let type=Texts.Type.getContentType(content);
      let tail=type.titleTail;
      let members:Target[]=[];
      const saveTitle=SelectingTitles.SaveEditButton+tail;
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
      members.push(f.newTriggerTarget(SelectingTitles.CancelEditButton+tail,{
        targetStateUpdated:(state,title)=>activateChooser(),
      }));
      return f.newTargetGroup(type.name,members);
    }
    let f=this.facets;
    let active:Texts.Content,edit:Texts.Content;
    let chooserTargets=this.fullListTargets?Selecting.newActionTargets(f,this.list):[];
    chooserTargets.push(
      f.newTriggerTarget(SelectingTitles.OpenEditButton,{
        targetStateUpdated:()=>{
          active=this.facets.getIndexingState(this.indexingTitle)
            .indexed;
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

