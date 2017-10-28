import React from 'react';
import ReactDOM from 'react-dom';
import {
  Facets,
  newInstance,
  Target,
  IndexingFramePolicy,
} from 'facets-js';
import {
  RowPanel,
  PanelRow,
  IndexingDropdown,
  IndexingList,
  TextualLabel,
  TextualField,
  TogglingCheckbox,
  TriggerButton,
} from './react/export';
import {
  traceThing,
  swapElement,
  removeElement,
  duplicateElement
} from './util/export';
import {Surface,Layout}from './facets/local';
export namespace SimpleTitles{
  export const TEXTUAL_FIRST='First',TEXTUAL_SECOND='Second',
    INDEXING=TEXTUAL_FIRST+' or '+TEXTUAL_SECOND,
    INDEX='Index',INDEXED='Indexed',INDEX_START=0,
    INDEXABLES=[TEXTUAL_FIRST,TEXTUAL_SECOND],
    TOGGLING='Click to toggle',TOGGLED='TogglingLive state',
    TRIGGER='Click Me!',TRIGGEREDS='Button presses',
    TOGGLE_START=false,
    NUMERIC_FIELD='Number',NUMERIC_LABEL='Value',NUMERIC_START=123;
}
export namespace SelectingTitles {
  export const FRAME='Selecting',
    SELECT='Select Content',
    ACTIONS='Actions',
    LIVE='Live',
    NEW='Duplicate',
    UP='Move Up',
    DOWN='Move Down',
    DELETE='Delete',
    EDIT='Edit Selection',
    CHARS='Characters';
}
export class Test{
  constructor(readonly name:string,
              readonly id:number,
              readonly buildTest?:(Facets)=>void,
              readonly newTree?:(Facets,Test?)=>Target){}
}
export const Tests={
  Textual:new Test('Textual',0,buildTextual,newTextualTree),
  TogglingLive:new Test('TogglingLive',1,buildToggling,newTogglingTree),
  Indexing:new Test('Indexing',2,buildIndexing,newIndexingTree),
  Trigger:new Test('Trigger',3,buildTrigger,newTriggerTree),
  AllSimples:new Test('AllSimples',4,buildAllSimples,newAllSimplesTree),
  SelectingBasic:new Test('SelectingBasic',5,buildSelectingBasic),
  SelectingPlus:new Test('SelectingPlus',6,buildSelectingPlus),
  Next:new Test('Next',7)
};
interface TextContent {
  text? : string;
}
class SimpleSurface extends Surface{
  constructor(private test:Test,facets){
    super(facets);
  }
  newTargetTree(){
    return this.test.newTree(this.facets,this.test);
  }
  buildLayout(){
    this.facets.getTargetState(SelectingTitles.SELECT);
    if(false&&this.test===Tests.AllSimples)[
      SimpleTitles.TEXTUAL_FIRST,
      SimpleTitles.INDEXING,
      SimpleTitles.TOGGLING,
      SimpleTitles.TRIGGER,
      SimpleTitles.TRIGGEREDS]
      .forEach(title=>this.facets.setTargetLive(title,false));
    new TestLayout(this.test).build(this.facets);
  }
}
class SelectingSurface extends Surface{
  readonly frame:IndexingFramePolicy;
  constructor(private test:Test,facets:Facets){
    super(facets);
    let list : TextContent[]=[
      {text: 'Hello world!'},
      {text: 'Hello Dolly!'},
      {text: 'Hello, good evening and welcome!'},
    ];
    this.frame={
      title: SelectingTitles.FRAME,
      indexingTitle: SelectingTitles.SELECT,
      newIndexedTitle:indexed=>SelectingTitles.FRAME,
      content: list,
      getUiSelectables: () => list.map((item)=>item.text),
      newIndexedTargets: (indexed:TextContent,title:string) => [
        facets.newTextualTarget(SelectingTitles.EDIT, {
          passText: indexed.text,
          targetStateUpdated: (title, state) => indexed.text = state as string
        }),
        facets.newTextualTarget(SelectingTitles.CHARS, {
          getText: title => ''+(facets.getTargetState(SelectingTitles.EDIT)as string
          ).length
        }),
      ]
      ,
      newIndexingTargets:()=>this.test===Tests.SelectingBasic?[
          facets.newTextualTarget(SimpleTitles.INDEXED,{
            getText:titley=>{
              let index=facets.getTargetState(SelectingTitles.SELECT)as number;
              return false&&index===null?"No target yet":list[index].text;
            }
          }),
          facets.newTogglingTarget(SelectingTitles.LIVE,{
            passSet:true
          })
        ]
        :[facets.newTargetGroup(SelectingTitles.ACTIONS,
          facets.newTriggerTarget(SelectingTitles.UP,{
            targetStateUpdated:(title,state)=>{
              let at=this.listAt();
              swapElement(list,at,true);
              facets.updateTargetState(this.frame.indexingTitle,at-1)
            }
          }),
          facets.newTriggerTarget(SelectingTitles.DOWN,{
            targetStateUpdated:(title,state)=>{
              let at=this.listAt();
              swapElement(list,at,false );
              facets.updateTargetState(this.frame.indexingTitle,at+1)
            }
          }),
          facets.newTriggerTarget(SelectingTitles.DELETE,{
            targetStateUpdated:(title,state)=>{
              let at=this.listAt(),atEnd=removeElement(list,at);
              if(atEnd)
                facets.updateTargetState(this.frame.indexingTitle,at-1)
            }
          }),
          facets.newTriggerTarget(SelectingTitles.NEW,{
            targetStateUpdated:(title,state)=>{
              let at=this.listAt();
              duplicateElement(list,at,src=>({text: (src as TextContent).text}));
              facets.updateTargetState(this.frame.indexingTitle,at+1)
            }
          })
        )
        ]
    }
  }
  listAt():number{
    return this.facets.getTargetState(this.frame.indexingTitle) as number;
  }
  newTargetTree(){
    return this.facets.buildSelectingFrame(this.frame);
  }
  onRetargeted=()=>{
    let facets=this.facets,frame=this.frame,list=this.frame.content;
    if(this.test===Tests.SelectingPlus){
      let at=this.listAt();
      facets.setTargetLive(SelectingTitles.DELETE,list.length>1);
      facets.setTargetLive(SelectingTitles.UP,at>0);
      facets.setTargetLive(SelectingTitles.DOWN,
        at<this.frame.content.length-1);
    }
    else{
      let live=facets.getTargetState(SelectingTitles.LIVE)as boolean;
      [SelectingTitles.SELECT,SimpleTitles.INDEXED,SelectingTitles.EDIT,
        SelectingTitles.CHARS].forEach(
          title=>facets.setTargetLive(title,live))
    }
  };
  buildLayout(){
    this.facets.getTargetState(SelectingTitles.SELECT);
    if(false&&this.test===Tests.AllSimples)[
      SimpleTitles.TEXTUAL_FIRST,
      SimpleTitles.INDEXING,
      SimpleTitles.TOGGLING,
      SimpleTitles.TRIGGER,
      SimpleTitles.TRIGGEREDS]
      .forEach(title=>this.facets.setTargetLive(title,false));
    new TestLayout(this.test).build(this.facets);
  }
}
class TestLayout implements Layout{
  constructor(private test:Test){}
  build=facets=>this.test.buildTest(facets);
}
function newTextualTree(facets){
  const first=facets.newTextualTarget(SimpleTitles.TEXTUAL_FIRST,{
      passText:'Some text for '+SimpleTitles.TEXTUAL_FIRST,
      targetStateUpdated:(title,state)=>{
        facets.updateTargetState(SimpleTitles.TEXTUAL_SECOND,
          SimpleTitles.TEXTUAL_FIRST+' has changed to: '+state);
      },
    }),
    second=facets.newTextualTarget(SimpleTitles.TEXTUAL_SECOND,{
      passText:'Some text for '+SimpleTitles.TEXTUAL_SECOND,
    });
  return facets.newTargetGroup('TextualTest',first,second);
}
function newTogglingTree(facets){
  const toggling=facets.newTogglingTarget(SimpleTitles.TOGGLING,{
      passSet:SimpleTitles.TOGGLE_START,
    }),
    toggled=facets.newTextualTarget(SimpleTitles.TOGGLED,{
      getText:(title)=>{
        return facets.getTargetState(SimpleTitles.TOGGLING)as boolean?'Set':'Not set'
      },
    });
  facets.attachOnRetargeted(()=>{
    facets.setTargetLive(SimpleTitles.TOGGLED,
      facets.getTargetState(SimpleTitles.TOGGLING)as boolean);
  });
  return facets.newTargetGroup('TogglingTest',toggling,toggled);
}
function newTriggerTree(facets){
  let triggers:number=0;
  const trigger=facets.newTriggerTarget(SimpleTitles.TRIGGER,{
      targetStateUpdated:(title)=>{
        if(++triggers>4)facets.setTargetLive(title,false);
      }
    }),
    triggered=facets.newTextualTarget(SimpleTitles.TRIGGEREDS,{
      getText:(title)=>{
        const count=triggers.toString();
        return !facets.isTargetLive(SimpleTitles.TRIGGER)?
          `No more than ${count}!`:count
      }
    });
  return facets.newTargetGroup('TriggerTest',trigger,triggered);
}
function newIndexingTree(facets){
  const indexing=facets.newIndexingTarget(SimpleTitles.INDEXING,{
      passIndex:0,
      getUiSelectables:(title)=> SimpleTitles.INDEXABLES,
      getIndexables: (title)=> SimpleTitles.INDEXABLES,
    }),
    index=facets.newTextualTarget(SimpleTitles.INDEX,{
      getText:(title)=>''+facets.getTargetState(SimpleTitles.INDEXING),
    }),
    indexed=facets.newTextualTarget(SimpleTitles.INDEXED,{
      getText:(title)=>SimpleTitles.INDEXABLES[facets.getTargetState(SimpleTitles.INDEXING)as number],
    });
  return facets.newTargetGroup('IndexingTest',indexing,index,indexed);
}
function newAllSimplesTree(facets){
  return facets.newTargetGroup('AllTest',
    newTextualTree(facets),
    newIndexingTree(facets),
    newTogglingTree(facets),
    newTriggerTree(facets));
}
function buildTextual(facets){
  let first=SimpleTitles.TEXTUAL_FIRST,second=SimpleTitles.TEXTUAL_SECOND;
  ReactDOM.render(
    <RowPanel rubric={Tests.Textual.name}>
      <TextualField title={first} facets={facets}/>
      <TextualLabel title={first} facets={facets}/>
      <TextualField title={second} facets={facets} cols={40}/>
      <TextualLabel title={second} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildToggling(facets){
  ReactDOM.render(
    <RowPanel rubric={Tests.TogglingLive.name}>
      <TogglingCheckbox title={SimpleTitles.TOGGLING} facets={facets}/>
      <TextualLabel title={SimpleTitles.TOGGLED} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );

}
function buildTrigger(facets){
  ReactDOM.render(
    <RowPanel rubric={Tests.Trigger.name}>
      <TriggerButton title={SimpleTitles.TRIGGER} facets={facets}/>
      <TextualLabel title={SimpleTitles.TRIGGEREDS} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  )
}
function buildIndexing(facets){
  ReactDOM.render(
    <RowPanel rubric={Tests.Indexing.name}>
      <IndexingDropdown title={SimpleTitles.INDEXING} facets={facets}/>
      <TextualLabel title={SimpleTitles.INDEX} facets={facets}/>
      <TextualLabel title={SimpleTitles.INDEXED} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildAllSimples(facets){
  let textual1=SimpleTitles.TEXTUAL_FIRST,textual2=SimpleTitles.TEXTUAL_SECOND;
  ReactDOM.render(<div>
      <RowPanel rubric={Tests.Textual.name}>
        <TextualField title={textual1} facets={facets}/>
        <TextualLabel title={textual1} facets={facets}/>
        <TextualField title={textual2} facets={facets} cols={40}/>
        <TextualLabel title={textual2} facets={facets}/>
      </RowPanel>
      <RowPanel rubric={Tests.Indexing.name}>
        <IndexingDropdown title={SimpleTitles.INDEXING} facets={facets}/>
        <TextualLabel title={SimpleTitles.INDEX} facets={facets}/>
        <TextualLabel title={SimpleTitles.INDEXED} facets={facets}/>
      </RowPanel>
      <RowPanel rubric={Tests.TogglingLive.name}>
        <TogglingCheckbox title={SimpleTitles.TOGGLING} facets={facets}/>
        <TextualLabel title={SimpleTitles.TOGGLED} facets={facets}/>
      </RowPanel>
      <RowPanel rubric={Tests.Trigger.name}>
        <TriggerButton title={SimpleTitles.TRIGGER} facets={facets}/>
        <TextualLabel title={SimpleTitles.TRIGGEREDS} facets={facets}/>
      </RowPanel>
    </div>,
    document.getElementById('root'),
  );
}
function buildSelectingBasic(facets){
  ReactDOM.render(<RowPanel rubric={Tests.SelectingBasic.name}>
      {false?<IndexingDropdown title={SelectingTitles.SELECT} facets={facets}/>
        :<IndexingList title={SelectingTitles.SELECT} facets={facets}/>}
      <PanelRow>
        <TextualField title={SelectingTitles.EDIT} facets={facets} cols={30}/>
      </PanelRow>
      <PanelRow>
        <TextualLabel title={SimpleTitles.INDEXED} facets={facets}/>
      </PanelRow>
      <PanelRow>
        <TextualLabel title={SelectingTitles.CHARS} facets={facets}/>
      </PanelRow>
      <PanelRow>
        <TogglingCheckbox title={SelectingTitles.LIVE} facets={facets}/>
      </PanelRow>
    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildSelectingPlus(facets){
  ReactDOM.render(<RowPanel rubric={Tests.SelectingPlus.name}>
      {false?<IndexingDropdown title={SelectingTitles.SELECT} facets={facets}/>:
        <IndexingList title={SelectingTitles.SELECT} facets={facets}/>}
      <PanelRow>
        <TextualField title={SelectingTitles.EDIT} facets={facets} cols={30}/>
      </PanelRow>
      <PanelRow>
        <TriggerButton title={SelectingTitles.UP} facets={facets}/>
        <TriggerButton title={SelectingTitles.DOWN} facets={facets}/>
        <TriggerButton title={SelectingTitles.DELETE} facets={facets}/>
        <TriggerButton title={SelectingTitles.NEW} facets={facets}/>
      </PanelRow>
    </RowPanel>,
    document.getElementById('root'),
  );
}
export function doTest(){
  let facets=newInstance(true);
  let surface=false?new SimpleSurface(Tests.AllSimples,facets)
    :new SelectingSurface(false?Tests.SelectingBasic:Tests.SelectingPlus,facets);
  surface.buildSurface();
}
