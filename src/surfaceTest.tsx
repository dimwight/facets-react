import React from 'react';
import ReactDOM from 'react-dom';
import {
  Facets,
  newInstance,
  Target,
  IndexingFramePolicy,
  TextualCoupler,
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
} from './react/export';
import {traceThing}from './util/export';
import {Surface}from './facets/export';
import {ShowableList,SelectingTitles} from './facets/Selecting';
import {ShowPanel} from './react/Facet';
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
interface AppSpec{
  readonly name,
  readonly newTree: (Facets)=>Target,
  readonly buildLayout:(Facets)=>void,
}
class Test implements AppSpec{
  constructor(
    readonly name,
    readonly newTree: (Facets)=>Target,
    readonly buildLayout:(Facets)=>void,
  ){}
}
const Tests={
  Textual:new Test('Textual',newTextualTree,buildTextual),
  TogglingLive:new Test('TogglingLive',newTogglingTree,buildToggling),
  Indexing:new Test('Indexing',newIndexingTree,buildIndexing),
  Trigger:new Test('Trigger',newTriggerTree,buildTrigger),
  AllSimples:new Test('AllSimples',newAllSimplesTree,buildAllSimples),
  SelectingTyped:new Test('SelectingTyped',newSelectingTypedTree,buildSelectingTyped),
  SelectingShowable:new Test('SelectingShowable',newSelectingShowableTree,buildSelectingShowable),
  Contenting:new Test('Contenting',newContentingTrees,buildContenting),
};
interface TextContent {
  text? : string;
}
class TextContentType{
  constructor(
    readonly name,
    readonly titleTail,
  ){}
  static Standard=new TextContentType('Standard','');
  static ShowChars=new TextContentType('ShowChars','|ShowChars');
  static getContentType(content:TextContent){
    return content.text.length>20?TextContentType.ShowChars:TextContentType.Standard;
  }
}
class TestSurface extends Surface{
  constructor(private test:Test){
    super(newInstance(false));
  }
  defineContent=()=>this.test.newTree(this.facets);
  buildLayout=()=>this.test.buildLayout(this.facets);
}
function newTextualTree(facets){
  const first=facets.newTextualTarget(SimpleTitles.TEXTUAL_FIRST,{
      passText:'Some text for '+SimpleTitles.TEXTUAL_FIRST,
      targetStateUpdated:state=>{
        facets.updateTargetState(SimpleTitles.TEXTUAL_SECOND,
          SimpleTitles.TEXTUAL_FIRST+' has changed to: '+state);
      },
    }),
    second=facets.newTextualTarget(SimpleTitles.TEXTUAL_SECOND,{
      passText:'Some text for '+SimpleTitles.TEXTUAL_SECOND,
    });
  return facets.newTargetGroup('TextualTest',[first,second]);
}
function setSimplesLive(facets,state){
  [SimpleTitles.TEXTUAL_FIRST,SimpleTitles.TEXTUAL_SECOND,
    SimpleTitles.INDEXED,SimpleTitles.INDEXING,SimpleTitles.INDEX,
    SimpleTitles.TRIGGER,SimpleTitles.TRIGGEREDS,
  ].forEach(title=>{
    facets.setTargetLive(title,state);
  })
}
function newTogglingTree(facets){
  const toggling=facets.newTogglingTarget(SimpleTitles.TOGGLING,{
    passSet:SimpleTitles.TOGGLE_START,
    targetStateUpdated:state=>setSimplesLive(facets,state),
  }),
  toggled=facets.newTextualTarget(SimpleTitles.TOGGLED,{
      getText:()=>facets.getTargetState(SimpleTitles.TOGGLING)as boolean?'Set':'Not set',
    });
  facets.onRetargeted=()=>{
    facets.setTargetLive(SimpleTitles.TOGGLED,
      facets.getTargetState(SimpleTitles.TOGGLING)as boolean);
  };
  return facets.newTargetGroup('TogglingTest',[toggling,toggled]);
}
function newTriggerTree(facets){
  let triggers:number=0;
  const trigger=facets.newTriggerTarget(SimpleTitles.TRIGGER,{
      targetStateUpdated:(state,title)=>{
        if(++triggers>4)facets.setTargetLive(title,false);
      },
    }),
    triggered=facets.newTextualTarget(SimpleTitles.TRIGGEREDS,{
      getText:()=>{
        const count=triggers.toString();
        return !facets.isTargetLive(SimpleTitles.TRIGGER)?
          `No more than ${count}!`:count
      },
    });
  return facets.newTargetGroup('TriggerTest',[trigger,triggered]);
}
function newIndexingTree(facets){
  const indexing=facets.newIndexingTarget(SimpleTitles.INDEXING,{
      passIndex:0,
      getUiSelectables:(title)=> SimpleTitles.INDEXABLES,
      getIndexables: (title)=> SimpleTitles.INDEXABLES,
    }),
    index=facets.newTextualTarget(SimpleTitles.INDEX,{
      getText:()=>''+facets.getTargetState(SimpleTitles.INDEXING),
    }),
    indexed=facets.newTextualTarget(SimpleTitles.INDEXED,{
      getText:()=>SimpleTitles.INDEXABLES[facets.getTargetState(SimpleTitles.INDEXING)as number],
    });
  return facets.newTargetGroup('IndexingTest',[indexing,index,indexed]);
}
function newAllSimplesTree(facets):Target{
  return facets.newTargetGroup('AllTest',[
    newTextualTree(facets),
    newTogglingTree(facets),
    newIndexingTree(facets),
    newTriggerTree(facets)]);
}
function buildTextual(facets){
  const first=SimpleTitles.TEXTUAL_FIRST,second=SimpleTitles.TEXTUAL_SECOND;
  ReactDOM.render(
    <RowPanel title={Tests.Textual.name} withRubric={true}>
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
    <RowPanel title={Tests.TogglingLive.name} withRubric={true}>
      <TogglingCheckbox title={SimpleTitles.TOGGLING} facets={facets}/>
      <TextualLabel title={SimpleTitles.TOGGLED} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );

}
function buildTrigger(facets){
  ReactDOM.render(
    <RowPanel title={Tests.Trigger.name} withRubric={true}>
      <TriggerButton title={SimpleTitles.TRIGGER} facets={facets}/>
      <TextualLabel title={SimpleTitles.TRIGGEREDS} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  )
}
function buildIndexing(facets){
  ReactDOM.render(
    <RowPanel title={Tests.Indexing.name} withRubric={true}>
      <IndexingDropdown title={SimpleTitles.INDEXING} facets={facets}/>
      <TextualLabel title={SimpleTitles.INDEX} facets={facets}/>
      <TextualLabel title={SimpleTitles.INDEXED} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildAllSimples(facets){
  const textual1=SimpleTitles.TEXTUAL_FIRST,textual2=SimpleTitles.TEXTUAL_SECOND;
  ReactDOM.render(<div>
      <RowPanel title={Tests.Textual.name} withRubric={true}>
        <TextualField title={textual1} facets={facets}/>
        <TextualLabel title={textual1} facets={facets}/>
        <TextualField title={textual2} facets={facets} cols={40}/>
        <TextualLabel title={textual2} facets={facets}/>
      </RowPanel>
      <RowPanel title={Tests.TogglingLive.name} withRubric={true}>
        <TogglingCheckbox title={SimpleTitles.TOGGLING} facets={facets}/>
        <TextualLabel title={SimpleTitles.TOGGLED} facets={facets}/>
      </RowPanel>
      <RowPanel title={Tests.Indexing.name} withRubric={true}>
        <IndexingDropdown title={SimpleTitles.INDEXING} facets={facets}/>
        <TextualLabel title={SimpleTitles.INDEX} facets={facets}/>
        <TextualLabel title={SimpleTitles.INDEXED} facets={facets}/>
      </RowPanel>
      <RowPanel title={Tests.Trigger.name} withRubric={true}>
        <TriggerButton title={SimpleTitles.TRIGGER} facets={facets}/>
        <TextualLabel title={SimpleTitles.TRIGGEREDS} facets={facets}/>
      </RowPanel>
    </div>,
    document.getElementById('root'),
  );
}
function newSelectingTypedTree(facets:Facets){
  function listAt():number{
    return facets.getTargetState(frame.indexingTitle) as number;
  }
  const list : TextContent[]=[
    {text: 'Hello world!'},
    {text: 'Hello Dolly!'},
    {text: 'Hello, good evening and welcome!'},
  ];
  function getType(indexed:TextContent){
    return TextContentType.getContentType(indexed);
  }
  const frame:IndexingFramePolicy={
    frameTitle: SelectingTitles.FRAME,
    indexingTitle: SelectingTitles.CHOOSER,
    getIndexables:()=>list,
    newUiSelectable:(item:TextContent)=>item.text,
    newFrameTargets:()=>[
      facets.newTextualTarget(SimpleTitles.INDEXED,{
        getText:()=>getType(facets.getIndexingState(
            SelectingTitles.CHOOSER).indexed).name,
      }),
    ]
    ,
    newIndexedTreeTitle:indexed=>SelectingTitles.FRAME+getType(indexed).titleTail,
    newIndexedTree: (indexed:TextContent,title:string) =>{
      const tail=getType(indexed).titleTail;
      return facets.newTargetGroup(title,tail===''?[
        facets.newTextualTarget(SelectingTitles.EDIT, {
          passText: indexed.text,
          targetStateUpdated: state => indexed.text = state as string,
        }),
      ]:[
        facets.newTextualTarget(SelectingTitles.EDIT+tail, {
          passText: indexed.text,
          targetStateUpdated: state => indexed.text = state as string,
        }),
        facets.newTextualTarget(SelectingTitles.CHARS+tail, {
          getText: () =>''+indexed.text.length,
        }),
      ])
    },
  };
  facets.onRetargeted=activeTitle=>{
    traceThing('onRetargeted',{activeTitle:activeTitle});
    const live=facets.getTargetState(SelectingTitles.LIVE) as boolean;
    if(false)[SelectingTitles.EDIT,SelectingTitles.CHARS].forEach(title=>
        ['',TextContentType.ShowChars.titleTail].forEach(tail=>
      facets.setTargetLive(title+tail,live),
      ),
    );
  };
  traceThing('^newSelectingTypedTree',{onRetargeted:facets.onRetargeted})
  return facets.newIndexingFrame(frame);
}
function buildSelectingTyped(facets){
  function newEditField(tail){
    return false?null:<PanelRow>
      <TextualField title={SelectingTitles.EDIT+tail} facets={facets} cols={30}/>
    </PanelRow>;
  }
  let tail=TextContentType.ShowChars.titleTail;
  let liveCheckbox=true?null:<PanelRow>
    <TogglingCheckbox title={SelectingTitles.LIVE} facets={facets}/>
  </PanelRow>;
  ReactDOM.render(<RowPanel title={Tests.SelectingTyped.name} withRubric={true}>
      {false?<IndexingDropdown title={SelectingTitles.CHOOSER} facets={facets}/>
        :<IndexingList title={SelectingTitles.CHOOSER} facets={facets}/>}
      {true?null:<PanelRow>
        <TextualLabel title={SimpleTitles.INDEXED} facets={facets}/>
      </PanelRow>}
      <ShowPanel title={SimpleTitles.INDEXED} facets={facets}>
        <RowPanel title={TextContentType.Standard.name}>
          {newEditField('')}
          {liveCheckbox}
        </RowPanel>
        <RowPanel title={TextContentType.ShowChars.name}>
          {newEditField(tail)}
          <PanelRow>
            <TextualLabel title={SelectingTitles.CHARS+tail} facets={facets}/>
          </PanelRow>
          {liveCheckbox}
        </RowPanel>
      </ShowPanel>

    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildSelectingShowable(facets){
  ReactDOM.render(<RowPanel title={Tests.SelectingShowable.name} withRubric={true}>
    <RowPanel title={SelectingTitles.FRAME}>
      {false?<IndexingDropdown title={SelectingTitles.CHOOSER} facets={facets}/>:
        <IndexingList
          title={SelectingTitles.CHOOSER}
          facets={facets}
          listWidth={false?null:200}/>}
      <PanelRow>
        <TriggerButton title={SelectingTitles.UP} facets={facets}/>
        <TriggerButton title={SelectingTitles.DOWN} facets={facets}/>
        <TriggerButton title={SelectingTitles.DELETE} facets={facets}/>
        <TriggerButton title={SelectingTitles.NEW} facets={facets}/>
      </PanelRow>
      <PanelRow>
        <TextualField title={SelectingTitles.EDIT} facets={facets} cols={30}/>
      </PanelRow>
    </RowPanel>
    </RowPanel>,
    document.getElementById('root'),
  );
}
function newSelectingShowableTree(facets){
  const content=[
    {text: 'Hello world!'},
    {text: 'Hello Dolly!'},
    {text: 'Hello, sailor!'},
    {text: 'Hello, good evening and welcome!'},
  ];
  const frame:IndexingFramePolicy={
    frameTitle: SelectingTitles.FRAME,
    indexingTitle: SelectingTitles.CHOOSER,
    newFrameTargets:()=>list.newActionTargets(),
    getIndexables:()=>list.getShowables(),
    newUiSelectable: (item:TextContent)=>item.text,
    newIndexedTreeTitle:indexed=>SelectingTitles.FRAME,
    newIndexedTree: (indexed:TextContent,title:string) => {
      traceThing('^newIndexedTargets',{indexed:indexed});
      return facets.newTargetGroup(title,[
        facets.newTextualTarget(SelectingTitles.EDIT, {
          passText: indexed.text,
          targetStateUpdated: state => indexed.text = state as string,
        }),
        facets.newTextualTarget(SelectingTitles.CHARS, {
          getText: () => ''+(facets.getTargetState(SelectingTitles.EDIT)as string
          ).length,
        }),
      ])
    },
  };
  const list=new ShowableList<TextContent>(content,3,facets,frame.indexingTitle);
  return facets.newIndexingFrame(frame);
}
function newContentingTrees(facets:Facets){
  const content=[
    {text: 'Hello world!'},
    {text: 'Hello Dolly!'},
    {text: 'Hello, sailor!'},
    {text: 'Hello, good evening and welcome!'},
  ];
  const indexingTitle=SelectingTitles.CHOOSER;
  const list=new ShowableList<TextContent>(content,3,facets,indexingTitle);
  const actions=true?[]:list.newActionTargets();
  actions.push(
    facets.newTextualTarget(SimpleTitles.INDEX,{
    passText:'For onRetargeted'
  }),
  facets.newTriggerTarget(SelectingTitles.EDIT,{
    targetStateUpdated:()=>{
      facets.activateContentTree(SimpleTitles.TEXTUAL_FIRST)
    }
  }));
  let trees=[];
  const frame=facets.newIndexingFrame({
    frameTitle: SelectingTitles.FRAME,
    indexingTitle: indexingTitle,
    getIndexables:()=>list.getShowables(),
    newFrameTargets:()=>actions,
    newUiSelectable: (item:TextContent)=>item.text,
  });
  trees.push(facets.newTargetGroup(SimpleTitles.TEXTUAL_FIRST,[
    facets.newTextualTarget(SimpleTitles.INDEXED,{
      getText:(getText)=>{
        const state=facets.getTargetState(indexingTitle),
          contentAt=list.contentAt(state as number);
        traceThing('^'+SimpleTitles.INDEXED,{state:state,contentAt:contentAt})
        return content[contentAt].text
      }
    }),
    facets.newTriggerTarget(SelectingTitles.SAVE,{
      targetStateUpdated:()=>{
        facets.activateContentTree(SelectingTitles.FRAME)
      }
    }),
    facets.newTriggerTarget(SelectingTitles.CANCEL,{
      targetStateUpdated:()=>{
        facets.activateContentTree(SelectingTitles.FRAME)
      }
    })
  ]),frame);
  facets.onRetargeted=activeTitle=>{
    traceThing('^onRetargeted',activeTitle);
    facets.updateTargetState(SimpleTitles.INDEX,activeTitle);
  };
  return true?trees:frame;
}
function buildContenting(facets:Facets){
  ReactDOM.render(<ShowPanel title={SimpleTitles.INDEX} facets={facets}>
    <RowPanel title={SelectingTitles.FRAME}>
        <IndexingList
            title={SelectingTitles.CHOOSER}
            facets={facets}
            listWidth={200}/>
      {false?<PanelRow>
          <TriggerButton title={SelectingTitles.UP} facets={facets}/>
          <TriggerButton title={SelectingTitles.DOWN} facets={facets}/>
          <TriggerButton title={SelectingTitles.DELETE} facets={facets}/>
          <TriggerButton title={SelectingTitles.NEW} facets={facets}/>
          <TriggerButton title={SelectingTitles.EDIT} facets={facets}/>
        </PanelRow>
        :<PanelRow>
          <TriggerButton title={SelectingTitles.EDIT} facets={facets}/>
        </PanelRow>
      }
      </RowPanel>
    <RowPanel title={SimpleTitles.TEXTUAL_FIRST}>
      <TextualLabel title={SimpleTitles.INDEXED} facets={facets}/>
      <PanelRow>
        <TriggerButton title={SelectingTitles.SAVE} facets={facets}/>
        <TriggerButton title={SelectingTitles.CANCEL} facets={facets}/>
      </PanelRow>
    </RowPanel>
    </ShowPanel>,
    document.getElementById('root'),
  );
}
export function doTest(){
  new TestSurface(Tests.Contenting).buildSurface();
}
