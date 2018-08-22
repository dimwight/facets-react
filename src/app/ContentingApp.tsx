import {
  AppCore,
  selectingFacetsRetargeted,
  newSelectingActionTargets,
  ScrollableList,
  SelectingTitles,
  SimpleTitles,
  TextContent,
  textContents,
  TextContentType,
} from './_globals';
import {
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
export class ContentingApp extends AppCore{
  private readonly fullListTargets=true;
  private readonly chooserTitle=SelectingTitles.Chooser;
  private readonly indexingTitle=SimpleTitles.Indexing;
  private readonly list:ScrollableList;
  constructor(){
    super(newInstance(false));
    this.list=new ScrollableList(textContents,3,this.facets,this.indexingTitle);
  }
  newContentTrees():Target|Target[]{
    function activateChooser(){
      f.activateContentTree(SelectingTitles.Chooser);
    }
    function newContentTree(content:TextContent):Target{
      function newEditTarget(indexed:TextContent,tail:string,onTextEdit:()=>void){
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
            SelectingTitles.TextEditField+TextContentType.ShowChars.titleTail)as string).length,
        })
      }
      let type=TextContentType.getContentType(content);
      let tail=type.titleTail;
      let members:Target[]=[];
      const saveTitle=SelectingTitles.SaveEditButton+tail;
      const onTextEdit=()=>{
        traceThing('^onTextEdit',{saveTitle:saveTitle})
        f.setTargetLive(saveTitle,true)
      };
      members.push(newEditTarget(content,tail,onTextEdit));
      if(type==TextContentType.ShowChars) members.push(newCharsTarget(tail));

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
    let active:TextContent,edit:TextContent;
    let chooserTargets=this.fullListTargets?newSelectingActionTargets(f,this.list):[];
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
      newContentTree(textContents[0]),
      newContentTree(textContents[1]),
      f.newIndexingFrame({
        frameTitle:this.chooserTitle,
        indexingTitle:this.indexingTitle,
        getIndexables:()=>this.list.getScrolledItems(),
        newFrameTargets:()=>chooserTargets,
        newUiSelectable:(item:TextContent)=>item.text,
      }));
    return trees;
  }
  onRetargeted(activeTitle:string){
    if(this.fullListTargets) selectingFacetsRetargeted(this.facets);
    traceThing('^disableAll',activeTitle);
  }
  buildLayout(){
    function newEditField(tail:string){
      return (<PanelRow>
        <TextualField title={SelectingTitles.TextEditField+tail} facets={f} cols={30}/>
      </PanelRow>)
    }
    function newSaveCancelRow(tail:string){
      return (<PanelRow>
        <TriggerButton title={SelectingTitles.SaveEditButton+tail} facets={f}/>
        <TriggerButton title={SelectingTitles.CancelEditButton+tail} facets={f}/>
      </PanelRow>)
    }
    let tail=TextContentType.ShowChars.titleTail;
    let f=this.facets;
    ReactDOM.render(<ShowPanel title={f.activeContentTitle} facets={f}>
        <RowPanel title={SelectingTitles.Chooser}>
          <IndexingList
            title={SimpleTitles.Indexing}
            facets={f}
            listWidth={200}/>
          {this.fullListTargets?<PanelRow>
              <TriggerButton title={SelectingTitles.UpButton} facets={f}/>
              <TriggerButton title={SelectingTitles.DownButton} facets={f}/>
              <TriggerButton title={SelectingTitles.DeleteButton} facets={f}/>
              <br/><br/>
              <TriggerButton title={SelectingTitles.OpenEditButton} facets={f}/>
            </PanelRow>
            :<PanelRow>
              <TriggerButton title={SelectingTitles.OpenEditButton} facets={f}/>
            </PanelRow>
          }
        </RowPanel>
        <RowPanel title={TextContentType.Standard.name}>
          {newEditField('')}
          {newSaveCancelRow('')}
        </RowPanel>
        <RowPanel title={TextContentType.ShowChars.name}>
          {newEditField(tail)}
          <PanelRow>
            <TextualLabel title={SelectingTitles.CharsCount+tail} facets={f}/>
          </PanelRow>
          {newSaveCancelRow(tail)}
        </RowPanel>
      </ShowPanel>,
      document.getElementById('root'),
    );
  }
}

