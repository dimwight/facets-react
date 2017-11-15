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
  export const FirstTextual='First',SecondTextual='Second',
    Indexing='Choose Item',
    Index='Index',Indexed='Indexed',IndexStart=0,
    TextualIndexables=[FirstTextual,SecondTextual],
    Toggling='Click to toggle',Toggled='TogglingLive state',
    Trigger='Click Me!',Triggereds='Button presses',
    ToggleStart=false,
    NumericField='Number',NumericLabel='Value',NumericStart=123;
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
      facets.setTargetLive(SimpleTitles.Toggled,
        facets.getTargetState(SimpleTitles.Toggling)as boolean);
    }),
  Indexing:new SimpleTest('Indexing',newIndexingTree,buildIndexing),
  Trigger:new SimpleTest('Trigger',newTriggerTree,buildTrigger),
  AllNonSelecting:new SimpleTest('AllNonSelecting',newAllSimplesTree,buildAllSimples),
  SelectingTyped:new SimpleTest('SelectingTyped',newSelectingTypedTree,buildSelectingTyped,
    (facets,activeTitle)=>{
      traceThing('^onRetargeted',{activeTitle:activeTitle});
      const live=facets.getTargetState(SelectingTitles.Live) as boolean;
      if(false)[SelectingTitles.OpenEditButton,SelectingTitles.CharsCount].forEach(title=>
        ['',TextContentType.ShowChars.titleTail].forEach(tail=>
          facets.setTargetLive(title+tail,live),
        ),
      );
    }),
  SelectingShowable:new SimpleTest('SelectingShowable',newSelectingShowableTree,buildSelectingShowable),
};
export function doTest(){
  if(false)new TestApp(SimpleTests.SelectingTyped).buildSurface();
  else new ContentingTest().buildSurface();
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
  copyClone(clone:TextContent){
    this.text=clone.text
  }
}
const selectables=[
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
  readonly fullChooserTargets=false;
  readonly chooserTitle=SelectingTitles.Chooser;
  readonly indexingTitle=SimpleTitles.Indexing;
  readonly list;
  constructor(){
    super(newInstance(false));
    this.list=new ShowableList<TextContent>(selectables,3,this.facets,this.indexingTitle);
  }
  getContentTrees():Target|Target[]{
    function activateChooser(){
      f.activateContentTree(SelectingTitles.Chooser);
    }
    function newContentTree(content:TextContent):Target {
      function newEditTarget(indexed:TextContent,tail){
        return f.newTextualTarget(SelectingTitles.TextEditField+tail,{
          passText:indexed.text,
          targetStateUpdated:(state,title)=>indexed.text=state as string,
        })
      }
      function newCharsTarget(tail){
        return f.newTextualTarget(SelectingTitles.CharsCount+tail,{
          getText:(title)=>''+(f.getTargetState(
            SelectingTitles.TextEditField+TextContentType.ShowChars.titleTail)as string).length,
        })
      }
      let type=TextContentType.getContentType(content);
      let tail=type.titleTail;
      let members=[];
      members.push(newEditTarget(content,tail));
      if(type==TextContentType.ShowChars)members.push(newCharsTarget(tail));
      members.push(f.newTriggerTarget(SelectingTitles.SaveEditButton+tail,{
        targetStateUpdated:(state,title)=>{
          active.copyClone(edit);
          activateChooser();
        },
      }));
      members.push(f.newTriggerTarget(SelectingTitles.CancelEditButton+tail,{
        targetStateUpdated:(state,title)=>activateChooser(),
      }));
      return f.newTargetGroup(type.name, members);
    }
    let f=this.facets;
    let active:TextContent,edit:TextContent;
    let chooserTargets=this.fullChooserTargets?this.list.newActionTargets():[];
    chooserTargets.push(
      f.newTriggerTarget(SelectingTitles.OpenEditButton,{
        targetStateUpdated:()=>{
          active=this.facets.getIndexingState(this.indexingTitle)
            .indexed;
          this.facets.addContentTree(newContentTree(
            edit=active.clone()));
        },
      }));
    let trees=[];
    trees.push(
      newContentTree(selectables[0]),
      newContentTree(selectables[1]),
      f.newIndexingFrame({
      frameTitle: this.chooserTitle,
      indexingTitle: this.indexingTitle,
      getIndexables:()=>this.list.getShowables(),
      newFrameTargets:()=>chooserTargets,
      newUiSelectable: (item:TextContent)=>item.text,
    }));
    return trees;
  }
  onRetargeted(activeTitle:string){
    if(this.fullChooserTargets)this.list.onFacetsRetargeted();
    traceThing('^onRetargeted',activeTitle);
  }
  buildLayout(){
    function newEditField(tail){
      return (<PanelRow>
        <TextualField title={SelectingTitles.TextEditField+tail} facets={f} cols={30}/>
      </PanelRow>)
    }
    function newSaveCancelRow(){
      return (<PanelRow>
        <TriggerButton title={SelectingTitles.SaveEditButton} facets={f}/>
        <TriggerButton title={SelectingTitles.CancelEditButton} facets={f}/>
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
          {this.fullChooserTargets?<PanelRow>
              <TriggerButton title={SelectingTitles.UpButton} facets={f}/>
              <TriggerButton title={SelectingTitles.DownButton} facets={f}/>
              <TriggerButton title={SelectingTitles.DeleteButton} facets={f}/>
              <TriggerButton title={SelectingTitles.NewButton} facets={f}/>
              <TriggerButton title={SelectingTitles.OpenEditButton} facets={f}/>
            </PanelRow>
            :<PanelRow>
              <TriggerButton title={SelectingTitles.OpenEditButton} facets={f}/>
            </PanelRow>
          }
        </RowPanel>
        <RowPanel title={TextContentType.Standard.name}>
          {newEditField('')}
          {newSaveCancelRow()}
        </RowPanel>
        <RowPanel title={TextContentType.ShowChars.name}>
          {newEditField(tail)}
        <PanelRow>
        <TextualLabel title={SelectingTitles.CharsCount+tail} facets={f}/>
        </PanelRow>
          {newSaveCancelRow()}
        </RowPanel>
      </ShowPanel>,
      document.getElementById('root'),
    );
  }
}
function buildSelectingTyped(facets){
  function newEditField(tail){
    return false?null:<PanelRow>
      <TextualField title={SelectingTitles.OpenEditButton+tail} facets={facets} cols={30}/>
    </PanelRow>;
  }
  let tail=TextContentType.ShowChars.titleTail;
  let liveCheckbox=true?null:<PanelRow>
    <TogglingCheckbox title={SelectingTitles.Live} facets={facets}/>
  </PanelRow>;
  ReactDOM.render(<RowPanel title={SimpleTests.SelectingTyped.name} withRubric={true}>
      {false?<IndexingDropdown title={SelectingTitles.Chooser} facets={facets}/>
        :<IndexingList title={SelectingTitles.Chooser} facets={facets}/>}
      {true?null:<PanelRow>
        <TextualLabel title={SimpleTitles.Indexed} facets={facets}/>
      </PanelRow>}
      <ShowPanel title={SimpleTitles.Indexed} facets={facets}>
        <RowPanel title={TextContentType.Standard.name}>
          {newEditField('')}
        </RowPanel>
        <RowPanel title={TextContentType.ShowChars.name}>
          {newEditField(tail)}
          <PanelRow>
            <TextualLabel title={SelectingTitles.CharsCount+tail} facets={facets}/>
          </PanelRow>
        </RowPanel>
      </ShowPanel>

    </RowPanel>,
    document.getElementById('root'),
  );
}
function newTextualTree(facets){
  const first=facets.newTextualTarget(SimpleTitles.FirstTextual,{
      passText:'Some text for '+SimpleTitles.FirstTextual,
      targetStateUpdated:state=>{
        facets.updateTargetState(SimpleTitles.SecondTextual,
          SimpleTitles.FirstTextual+' has changed to: '+state);
      },
    }),
    second=facets.newTextualTarget(SimpleTitles.SecondTextual,{
      passText:'Some text for '+SimpleTitles.SecondTextual,
    });
  return facets.newTargetGroup('TextualTest',[first,second]);
}
function setSimplesLive(facets,state){
  [SimpleTitles.FirstTextual,SimpleTitles.SecondTextual,
    SimpleTitles.Indexed,SimpleTitles.Indexing,SimpleTitles.Index,
    SimpleTitles.Trigger,SimpleTitles.Triggereds,
  ].forEach(title=>{
    facets.setTargetLive(title,state);
  })
}
function newTogglingTree(facets,setLive){
  const toggling=facets.newTogglingTarget(SimpleTitles.Toggling,{
    passSet:SimpleTitles.ToggleStart,
    targetStateUpdated:state=>{
      if(setLive)setSimplesLive(facets,state)
    },
  }),
  toggled=facets.newTextualTarget(SimpleTitles.Toggled,{
      getText:()=>facets.getTargetState(SimpleTitles.Toggling)as boolean?'Set':'Not set',
    });
  return facets.newTargetGroup('TogglingTest',[toggling,toggled]);
}
function newTriggerTree(facets){
  let triggers:number=0;
  const trigger=facets.newTriggerTarget(SimpleTitles.Trigger,{
      targetStateUpdated:(state,title)=>{
        if(++triggers>4)facets.setTargetLive(title,false);
      },
    }),
    triggered=facets.newTextualTarget(SimpleTitles.Triggereds,{
      getText:()=>{
        const count=triggers.toString();
        return !facets.isTargetLive(SimpleTitles.Trigger)?
          `No more than ${count}!`:count
      },
    });
  return facets.newTargetGroup('TriggerTest',[trigger,triggered]);
}
function newIndexingTree(facets){
  const indexing=facets.newIndexingTarget(SimpleTitles.Indexing,{
      passIndex:0,
      getUiSelectables:(title)=> SimpleTitles.TextualIndexables,
      getIndexables: (title)=> SimpleTitles.TextualIndexables,
    }),
    index=facets.newTextualTarget(SimpleTitles.Index,{
      getText:()=>''+facets.getTargetState(SimpleTitles.Indexing),
    }),
    indexed=facets.newTextualTarget(SimpleTitles.Indexed,{
      getText:()=>SimpleTitles.TextualIndexables[facets.getTargetState(SimpleTitles.Indexing)as number],
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
    frameTitle: SelectingTitles.Frame,
    indexingTitle: SelectingTitles.Chooser,
    getIndexables:()=>selectables,
    newUiSelectable:(item:TextContent)=>item.text,
    newFrameTargets:()=>[
      facets.newTextualTarget(SimpleTitles.Indexed,{
        getText:()=>getType(facets.getIndexingState(
          SelectingTitles.Chooser).indexed).name,
      }),
    ]
    ,
    newIndexedTreeTitle:indexed=>SelectingTitles.Frame+getType(indexed).titleTail,
    newIndexedTree: (indexed:TextContent,title:string) =>{
      const tail=getType(indexed).titleTail;
      return facets.newTargetGroup(title,tail===''?[
        facets.newTextualTarget(SelectingTitles.OpenEditButton, {
          passText: indexed.text,
          targetStateUpdated: state => indexed.text = state as string,
        }),
      ]:[
        facets.newTextualTarget(SelectingTitles.OpenEditButton+tail, {
          passText: indexed.text,
          targetStateUpdated: state => indexed.text = state as string,
        }),
        facets.newTextualTarget(SelectingTitles.CharsCount+tail, {
          getText: () =>''+indexed.text.length,
        }),
      ])
    },
  };
  return facets.newIndexingFrame(frame);
}
function newSelectingShowableTree(facets){
  const frame:IndexingFramePolicy={
    frameTitle: SelectingTitles.Frame,
    indexingTitle: SelectingTitles.Chooser,
    newFrameTargets:()=>list.newActionTargets(),
    getIndexables:()=>list.getShowables(),
    newUiSelectable: (item:TextContent)=>item.text,
    newIndexedTreeTitle:indexed=>SelectingTitles.Frame,
    newIndexedTree: (indexed:TextContent,title:string) => {
      traceThing('^newIndexedTargets',{indexed:indexed});
      return facets.newTargetGroup(title,[
        facets.newTextualTarget(SelectingTitles.OpenEditButton, {
          passText: indexed.text,
          targetStateUpdated: state => indexed.text = state as string,
        }),
        facets.newTextualTarget(SelectingTitles.CharsCount, {
          getText: () => ''+(facets.getTargetState(SelectingTitles.OpenEditButton)as string
          ).length,
        }),
      ])
    },
  };
  const list=new ShowableList<TextContent>(selectables,3,facets,frame.indexingTitle);
  return facets.newIndexingFrame(frame);
}
function buildTextual(facets){
  const first=SimpleTitles.FirstTextual,second=SimpleTitles.SecondTextual;
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
      <TogglingCheckbox title={SimpleTitles.Toggling} facets={facets}/>
      <TextualLabel title={SimpleTitles.Toggled} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );

}
function buildTrigger(facets){
  ReactDOM.render(
    <RowPanel title={SimpleTests.Trigger.name} withRubric={true}>
      <TriggerButton title={SimpleTitles.Trigger} facets={facets}/>
      <TextualLabel title={SimpleTitles.Triggereds} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  )
}
function buildIndexing(facets){
  ReactDOM.render(
    <RowPanel title={SimpleTests.Indexing.name} withRubric={true}>
      <IndexingDropdown title={SimpleTitles.Indexing} facets={facets}/>
      <TextualLabel title={SimpleTitles.Index} facets={facets}/>
      <TextualLabel title={SimpleTitles.Indexed} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildAllSimples(facets){
  const textual1=SimpleTitles.FirstTextual,textual2=SimpleTitles.SecondTextual;
  ReactDOM.render(<div>
      <RowPanel title={SimpleTests.Textual.name} withRubric={true}>
        <TextualField title={textual1} facets={facets}/>
        <TextualLabel title={textual1} facets={facets}/>
        <TextualField title={textual2} facets={facets} cols={40}/>
        <TextualLabel title={textual2} facets={facets}/>
      </RowPanel>
      <RowPanel title={SimpleTests.TogglingLive.name} withRubric={true}>
        <TogglingCheckbox title={SimpleTitles.Toggling} facets={facets}/>
        <TextualLabel title={SimpleTitles.Toggled} facets={facets}/>
      </RowPanel>
      <RowPanel title={SimpleTests.Indexing.name} withRubric={true}>
        <IndexingDropdown title={SimpleTitles.Indexing} facets={facets}/>
        <TextualLabel title={SimpleTitles.Index} facets={facets}/>
        <TextualLabel title={SimpleTitles.Indexed} facets={facets}/>
      </RowPanel>
      <RowPanel title={SimpleTests.Trigger.name} withRubric={true}>
        <TriggerButton title={SimpleTitles.Trigger} facets={facets}/>
        <TextualLabel title={SimpleTitles.Triggereds} facets={facets}/>
      </RowPanel>
    </div>,
    document.getElementById('root'),
  );
}
function buildSelectingShowable(facets){
  ReactDOM.render(<RowPanel title={SimpleTests.SelectingShowable.name} withRubric={true}>
    <RowPanel title={SelectingTitles.Frame}>
      {false?<IndexingDropdown title={SelectingTitles.Chooser} facets={facets}/>:
        <IndexingList
          title={SelectingTitles.Chooser}
          facets={facets}
          listWidth={false?null:200}/>}
      <PanelRow>
        <TriggerButton title={SelectingTitles.UpButton} facets={facets}/>
        <TriggerButton title={SelectingTitles.DownButton} facets={facets}/>
        <TriggerButton title={SelectingTitles.DeleteButton} facets={facets}/>
        <TriggerButton title={SelectingTitles.NewButton} facets={facets}/>
      </PanelRow>
      <PanelRow>
        <TextualField title={SelectingTitles.OpenEditButton} facets={facets} cols={30}/>
      </PanelRow>
    </RowPanel>
    </RowPanel>,
    document.getElementById('root'),
  );
}
