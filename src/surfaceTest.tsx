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
  TextualLabel,
  TextualField,
  TogglingCheckbox,
  TriggerButton,
  IndexingDropdown,
  IndexingList,
  IndexingOvershoot,
} from './react/export';
import {
  traceThing,
  swapElement,
  removeElement,
  addElement
} from './util/export';
import {Surface}from './facets/export';
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
    NEW='New',
    UP='Move Up',
    DOWN='Move Down',
    DELETE='Delete',
    EDIT='Edit Selection',
    CHARS='Characters';
}
class Test{
  constructor(
    readonly name,
    readonly newTree?: (Facets,Test?)=>Target,
    readonly buildLayout?:(Facets)=>void
  ){}
}
const Tests={
  Textual:new Test('Textual',newTextualTree,buildTextual),
  TogglingLive:new Test('TogglingLive',newTogglingTree,buildToggling),
  Indexing:new Test('Indexing',newIndexingTree,buildIndexing),
  Trigger:new Test('Trigger',newTriggerTree,buildTrigger),
  AllSimples:new Test('AllSimples',newAllSimplesTree,buildAllSimples),
  SelectingBasic:new Test('SelectingBasic',newSelectingTree,buildSelectingBasic),
  SelectingPlus:new Test('SelectingPlus',newSelectingTree,buildSelectingPlus)
};
interface TextContent {
  text? : string;
}
class TestSurface extends Surface{
  constructor(private test:Test){
    super(newInstance(false));
  }
  newTargetTree=()=>this.test.newTree(this.facets,this.test);
  buildLayout=()=>{
    if(false&&this.test===Tests.AllSimples)[
      SimpleTitles.TEXTUAL_FIRST,
      SimpleTitles.INDEXING,
      SimpleTitles.TOGGLING,
      SimpleTitles.TRIGGER,
      SimpleTitles.TRIGGEREDS]
      .forEach(title=>this.facets.setTargetLive(title,false));
    this.test.buildLayout(this.facets);
  }
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
  facets.onRetargeted=()=>{
    facets.setTargetLive(SimpleTitles.TOGGLED,
      facets.getTargetState(SimpleTitles.TOGGLING)as boolean);
  };
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
    newTogglingTree(facets),
    newIndexingTree(facets),
    newTriggerTree(facets));
}
function newSelectingTree(facets:Facets,test){
  let basic=test===Tests.SelectingBasic;
  class ShowList<T>{
    private showFrom=0;
    constructor(private content:T[],private readonly showLength){}
    getShowables():T[]{
      return this.content.slice(this.showFrom, this.showFrom+this.showLength);
    }
    onOvershoot(belowShowZero){
      let thenFrom=this.showFrom,thenStop=thenFrom+this.showLength;
      if(belowShowZero&&thenFrom>0)this.showFrom--;
      else if(!belowShowZero&&thenStop<this.content.length)
        this.showFrom++;
      traceThing('^onOvershoot',{
        belowShowZero:belowShowZero,
        thenFrom:thenFrom,
        thenStop:thenStop,
        nowFrom:this.showFrom
      });
    }
    contentAt(showAt){
      return showAt+this.showFrom;
    }
  }
  facets.supplement={
    overshot:belowShowZero=>{
      list.onOvershoot(belowShowZero);
      facets.notifyTargetUpdated(SelectingTitles.SELECT)
    }
  }as IndexingOvershoot;
  function getShowAt():number{
    return facets.getTargetState(frame.indexingTitle) as number;
  }
  let content=[
    {text: 'Hello, good evening and welcome!'},
    {text: 'Hello world!'},
    {text: 'Hello Dolly!'},
    {text: 'Hello, sailor!'},
  ];
  const list=new ShowList<TextContent>(content,3);
  let contentIds=0;
  const frame:IndexingFramePolicy={
    title: SelectingTitles.FRAME,
    indexingTitle: SelectingTitles.SELECT,
    newIndexedTitle:indexed=>SelectingTitles.FRAME,
    content: content,
    getUiSelectables: () => list.getShowables().map((item)=>item.text),
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
    newIndexingTargets:()=>basic?[
        facets.newTextualTarget(SimpleTitles.INDEXED,{
          getText:title=>{
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
            let at=list.contentAt(getShowAt());
            swapElement(content,at,true);
            facets.updateTargetState(frame.indexingTitle,at-1)
          }
        }),
        facets.newTriggerTarget(SelectingTitles.DOWN,{
          targetStateUpdated:(title,state)=>{
            let at=list.contentAt(getShowAt());
            swapElement(content,at,false );
            facets.updateTargetState(frame.indexingTitle,at+1)
          }
        }),
        facets.newTriggerTarget(SelectingTitles.DELETE,{
          targetStateUpdated:(title,state)=>{
            let at=list.contentAt(getShowAt()),
              atEnd=removeElement(content,at);
            if(atEnd)
              facets.updateTargetState(frame.indexingTitle,at-1)
          }
        }),
        facets.newTriggerTarget(SelectingTitles.NEW,{
          targetStateUpdated:()=>{
            let showAt=getShowAt(),contentAt=list.contentAt(showAt);
            addElement(content,contentAt,
                src=>({text: 'NewContent'+contentIds++}));
            facets.updateTargetState(frame.indexingTitle,showAt)
          }
        })
      )
      ]
  };
  facets.onRetargeted=()=>{
    if(basic){
      let live=facets.getTargetState(SelectingTitles.LIVE)as boolean;
      [SelectingTitles.SELECT,SimpleTitles.INDEXED,SelectingTitles.EDIT,
        SelectingTitles.CHARS].forEach(title_=>
        facets.setTargetLive(title_,live))
    }
    else{
      let at=getShowAt();
      facets.setTargetLive(SelectingTitles.DELETE,list.getShowables().length>1);
      facets.setTargetLive(SelectingTitles.UP,at>0);
      facets.setTargetLive(SelectingTitles.DOWN,
        at<frame.content.length-1);
      traceThing('^onRetargeted',list);
    }
  };
  return facets.buildSelectingFrame(frame);
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
      <RowPanel rubric={Tests.TogglingLive.name}>
        <TogglingCheckbox title={SimpleTitles.TOGGLING} facets={facets}/>
        <TextualLabel title={SimpleTitles.TOGGLED} facets={facets}/>
      </RowPanel>
      <RowPanel rubric={Tests.Indexing.name}>
        <IndexingDropdown title={SimpleTitles.INDEXING} facets={facets}/>
        <TextualLabel title={SimpleTitles.INDEX} facets={facets}/>
        <TextualLabel title={SimpleTitles.INDEXED} facets={facets}/>
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
  new TestSurface(Tests.SelectingPlus).buildSurface();
}
