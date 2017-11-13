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
  ShowPanel,
} from './react/export';
import {
} from './facets/export';
import {
SelectingTitles,
ShowableList,
} from './facets/Selecting';
import {traceThing}from './util/export';
import {SurfaceApp} from './facets/Surface';
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
class SimpleTest{
  constructor(
    readonly name,
    readonly newTrees,
    readonly buildLayout,
    readonly onRetargeted?,
  ){}
}
const SimpleTests={
  Textual:new SimpleTest('Textual',newTextualTree,buildTextual),
  TogglingLive:new SimpleTest('TogglingLive',newTogglingTree,buildToggling,
    (facets:Facets)=>{
      facets.setTargetLive(SimpleTitles.TOGGLED,
        facets.getTargetState(SimpleTitles.TOGGLING)as boolean);
    }),
  Indexing:new SimpleTest('Indexing',newIndexingTree,buildIndexing),
  Trigger:new SimpleTest('Trigger',newTriggerTree,buildTrigger),
  AllNonSelecting:new SimpleTest('AllNonSelecting',newAllSimplesTree,buildAllSimples),
  SelectingTyped:new SimpleTest('SelectingTyped',newSelectingTypedTree,buildSelectingTyped,
    (facets,activeTitle)=>{
      traceThing('^onRetargeted',{activeTitle:activeTitle});
      const live=facets.getTargetState(SelectingTitles.LIVE) as boolean;
      if(false)[SelectingTitles.EDIT,SelectingTitles.CHARS].forEach(title=>
        ['',TextContentType.ShowChars.titleTail].forEach(tail=>
          facets.setTargetLive(title+tail,live),
        ),
      );
    }),
  SelectingShowable:new SimpleTest('SelectingShowable',newSelectingShowableTree,buildSelectingShowable),
};
export function doTest(){
  if(false)new TestApp(SimpleTests.AllNonSelecting).buildSurface();
  else new ContentingTest(newInstance(true)).buildSurface();
}
class TestApp extends SurfaceApp{
  constructor(readonly test:SimpleTest){
    super(newInstance(true));
  }
  getContentTrees():Target|Target[]{
    return this.test.newTrees(this.facets)
  }
  onRetargeted(active){
    const onRetargeted=this.test.onRetargeted;
    if(onRetargeted)onRetargeted(this.facets,active)
  }
  buildLayout():void{
    this.test.buildLayout(this.facets)
  }
}
class TextContent {
  constructor(public text : string){}
  clone():TextContent{
    return new TextContent(this.text)
  }
}
const content=[
  new TextContent('Hello world!'),
  new TextContent('Hello, good evening and welcome!'),
  new TextContent('Hello Dolly!'),
  new TextContent('Hello, sailor!'),
];
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
class ContentingTest extends SurfaceApp{
  readonly fullFrameTargets=false;
  readonly indexingTitle=SelectingTitles.CHOOSER;
  readonly frameTitle=SelectingTitles.FRAME;
  readonly list;
  readonly frameTargets:Target[];
  active:TextContent;
  edit:TextContent;
  constructor(ff:Facets){
    super(ff);
    this.list=new ShowableList<TextContent>(content,3,ff,this.indexingTitle);
    this.frameTargets=this.fullFrameTargets?this.list.newActionTargets():[];
  }
  getContentTrees():Target|Target[]{
    function getType(indexed:TextContent){
      return TextContentType.getContentType(indexed);
    }
    function activateChooser(){
      this.facets.activateContentTree(this.frameTitle);
    }
    function newEditTarget(indexed:TextContent,tail){
      return this.facets.newTextualTarget(SelectingTitles.EDIT+tail,{
        passText:indexed.text,
        targetStateUpdated:(state,title)=>indexed.text=state as string,
      })
    }
    function newCharsTarget(tail){
      return this.facets.newTextualTarget(SelectingTitles.CHARS+tail,{
        getText:(title)=>''+(this.facets.getTargetState(
          SelectingTitles.EDIT+TextContentType.ShowChars.titleTail)as string).length
      })
    }
    function newContentTree(content:TextContent):Target {
      let f=this.facets;
      let type=getType(content);
      let tail=type.titleTail();
      let members=[];
      members.push(newEditTarget(content,tail));
      if(type==TextContentType.ShowChars)members.push(newCharsTarget(tail));
      members.push(f.newTriggerTarget(SelectingTitles.SAVE+tail,{
        targetStateUpdated:(state,title)=>{
          this.active.copyClone(this.edit);
          activateChooser();
        }
      }));
      members.push(f.newTriggerTarget(SelectingTitles.CANCEL+tail,{
        targetStateUpdated:(state,title)=>activateChooser()
      }));
      return f.newTargetGroup(type.name, members);
    }
    let f=this.facets;
    this.frameTargets.push(
      f.newTextualTarget(SimpleTitles.INDEX,{
        passText:'For onRetargeted',
      }),
      f.newTriggerTarget(SelectingTitles.EDIT,{
        targetStateUpdated:()=>{
            this.active=this.facets.getIndexingState(SelectingTitles.CHOOSER
            ).indexed;
            this.facets.addContentTree(newContentTree(this.edit=this.active.clone()));
        },
      }));
    let trees=[];
    const frame=f.newIndexingFrame({
      frameTitle: this.frameTitle,
      indexingTitle: this.indexingTitle,
      getIndexables:()=>this.list.getShowables(),
      newFrameTargets:()=>this.frameTargets,
      newUiSelectable: (item:TextContent)=>item.text,
    });
    trees.push(
      f.newTargetGroup(SimpleTitles.TEXTUAL_FIRST,[
        f.newTextualTarget(SimpleTitles.INDEXED,{
          getText:(getText)=>{
            const state=f.getTargetState(this.indexingTitle),
              contentAt=this.list.contentAt(state as number);
            return content[contentAt].text
          },
        }),
        f.newTriggerTarget(SelectingTitles.SAVE,{
          targetStateUpdated:()=>{
            f.activateContentTree(SelectingTitles.FRAME)
          },
        }),
        f.newTriggerTarget(SelectingTitles.CANCEL,{
          targetStateUpdated:()=>{
            f.activateContentTree(SelectingTitles.FRAME)
          },
        }),
    ]),frame);
    return true?trees:frame;
  }
  onRetargeted(activeTitle:string){
    if(this.fullFrameTargets)this.list.onFacetsRetargeted();
    this.facets.updateTargetState(SimpleTitles.INDEX,activeTitle);
  }
  buildLayout(){
    let f=this.facets;
    ReactDOM.render(<ShowPanel title={SimpleTitles.INDEX} facets={f}>
        <RowPanel title={SelectingTitles.FRAME}>
          <IndexingList
            title={SelectingTitles.CHOOSER}
            facets={f}
            listWidth={200}/>
          {this.fullFrameTargets?<PanelRow>
              <TriggerButton title={SelectingTitles.UP} facets={f}/>
              <TriggerButton title={SelectingTitles.DOWN} facets={f}/>
              <TriggerButton title={SelectingTitles.DELETE} facets={f}/>
              <TriggerButton title={SelectingTitles.NEW} facets={f}/>
              <TriggerButton title={SelectingTitles.EDIT} facets={f}/>
            </PanelRow>
            :<PanelRow>
              <TriggerButton title={SelectingTitles.EDIT} facets={f}/>
            </PanelRow>
          }
        </RowPanel>
        <RowPanel title={SimpleTitles.TEXTUAL_FIRST}>
          <TextualLabel title={SimpleTitles.INDEXED} facets={f}/>
          <PanelRow>
            <TriggerButton title={SelectingTitles.SAVE} facets={f}/>
            <TriggerButton title={SelectingTitles.CANCEL} facets={f}/>
          </PanelRow>
        </RowPanel>
      </ShowPanel>,
      document.getElementById('root'),
    );
  }
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
function newTogglingTree(facets,setLive){
  const toggling=facets.newTogglingTarget(SimpleTitles.TOGGLING,{
    passSet:SimpleTitles.TOGGLE_START,
    targetStateUpdated:state=>{
      if(setLive)setSimplesLive(facets,state)
    },
  }),
  toggled=facets.newTextualTarget(SimpleTitles.TOGGLED,{
      getText:()=>facets.getTargetState(SimpleTitles.TOGGLING)as boolean?'Set':'Not set',
    });
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
  return facets.newTargetGroup('AllSimples',[
    newTextualTree(facets),
    newTogglingTree(facets,true),
    newIndexingTree(facets),
    newTriggerTree(facets)]);
}
function newSelectingTypedTree(facets:Facets){
  function listAt():number{
    return facets.getTargetState(frame.indexingTitle) as number;
  }
  function getType(indexed:TextContent){
    return TextContentType.getContentType(indexed);
  }
  const frame:IndexingFramePolicy={
    frameTitle: SelectingTitles.FRAME,
    indexingTitle: SelectingTitles.CHOOSER,
    getIndexables:()=>this.list,
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
  return facets.newIndexingFrame(frame);
}
function newSelectingShowableTree(facets){
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
function buildTextual(facets){
  const first=SimpleTitles.TEXTUAL_FIRST,second=SimpleTitles.TEXTUAL_SECOND;
  ReactDOM.render(
    <RowPanel title={SimpleTests.Textual.name} withRubric={true}>
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
    <RowPanel title={SimpleTests.TogglingLive.name} withRubric={true}>
      <TogglingCheckbox title={SimpleTitles.TOGGLING} facets={facets}/>
      <TextualLabel title={SimpleTitles.TOGGLED} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );

}
function buildTrigger(facets){
  ReactDOM.render(
    <RowPanel title={SimpleTests.Trigger.name} withRubric={true}>
      <TriggerButton title={SimpleTitles.TRIGGER} facets={facets}/>
      <TextualLabel title={SimpleTitles.TRIGGEREDS} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  )
}
function buildIndexing(facets){
  ReactDOM.render(
    <RowPanel title={SimpleTests.Indexing.name} withRubric={true}>
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
      <RowPanel title={SimpleTests.Textual.name} withRubric={true}>
        <TextualField title={textual1} facets={facets}/>
        <TextualLabel title={textual1} facets={facets}/>
        <TextualField title={textual2} facets={facets} cols={40}/>
        <TextualLabel title={textual2} facets={facets}/>
      </RowPanel>
      <RowPanel title={SimpleTests.TogglingLive.name} withRubric={true}>
        <TogglingCheckbox title={SimpleTitles.TOGGLING} facets={facets}/>
        <TextualLabel title={SimpleTitles.TOGGLED} facets={facets}/>
      </RowPanel>
      <RowPanel title={SimpleTests.Indexing.name} withRubric={true}>
        <IndexingDropdown title={SimpleTitles.INDEXING} facets={facets}/>
        <TextualLabel title={SimpleTitles.INDEX} facets={facets}/>
        <TextualLabel title={SimpleTitles.INDEXED} facets={facets}/>
      </RowPanel>
      <RowPanel title={SimpleTests.Trigger.name} withRubric={true}>
        <TriggerButton title={SimpleTitles.TRIGGER} facets={facets}/>
        <TextualLabel title={SimpleTitles.TRIGGEREDS} facets={facets}/>
      </RowPanel>
    </div>,
    document.getElementById('root'),
  );
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
  ReactDOM.render(<RowPanel title={SimpleTests.SelectingTyped.name} withRubric={true}>
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
  ReactDOM.render(<RowPanel title={SimpleTests.SelectingShowable.name} withRubric={true}>
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
