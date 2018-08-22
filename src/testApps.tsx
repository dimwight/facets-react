import React from 'react';
import ReactDOM from 'react-dom';
import {
  Facets,
  IndexingCoupler,
  IndexingFramePolicy,
  newInstance,
  Target,
} from 'facets-js';
import {
  FieldSpec,
  FieldType,
  IndexingDropdown,
  IndexingList,
  newFormField,
  PanelRow,
  RowPanel,
  ShowPanel,
  TextualField,
  TextualLabel,
  TogglingCheckbox,
  TriggerButton,
} from './react/_globals';
import {
  ScrollableList,
  SelectingTitles,
  AppCore,
  SimpleTitles,
  newSelectingActionTargets,
  TextContentType,
  TextContent,
  textContents,
  selectingFacetsRetargeted,
  ContentingApp,
} from './app/_globals';
import {traceThing,} from './util/_globals';
class SimpleApp extends AppCore{
  constructor(readonly test:SimpleTest){
    super(newInstance(false));
  }
  newContentTrees():Target|Target[]{
    return this.test.newTrees(this.facets)
  }
  onRetargeted(active:string){
    const onRetargeted=this.test.onRetargeted;
    traceThing('^disableAll',onRetargeted);
    if(onRetargeted) onRetargeted(this.facets,active)
  }
  buildLayout(){
    this.test.buildLayout(this.facets)
  }
}
function newTextualTree(facets:Facets){
  const first=facets.newTextualTarget(SimpleTitles.FirstTextual,{
      passText:'Some text for '+SimpleTitles.FirstTextual,
      targetStateUpdated:state=>{
        facets.updateTarget(SimpleTitles.SecondTextual,
          SimpleTitles.FirstTextual+' has changed to: '+state);
      },
    }),
    second=facets.newTextualTarget(SimpleTitles.SecondTextual,{
      passText:'Some text for '+SimpleTitles.SecondTextual,
    });
  return facets.newTargetGroup('TextualTest',[first,second]);
}
function newTogglingTree(facets:Facets,setLive:boolean){
  const toggling=facets.newTogglingTarget(SimpleTitles.Toggling,{
      passSet:SimpleTitles.ToggleStart,
      targetStateUpdated:state=>{
        if(setLive) setSimplesLive(facets,state as boolean)
      },
    }),
    toggled=facets.newTextualTarget(SimpleTitles.Toggled,{
      getText:()=>facets.getTargetState(SimpleTitles.Toggling)as boolean?'Set':'Not set',
    });
  return facets.newTargetGroup('TogglingTest',[toggling,toggled]);
}
function newTriggerTree(facets:Facets){
  let triggers:number=0;
  const trigger=facets.newTriggerTarget(SimpleTitles.Trigger,{
      targetStateUpdated:(state,title)=>{
        if(++triggers>4) facets.setTargetLive(title,false);
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
function newIndexingTree(facets:Facets){
  const indexing=facets.newIndexingTarget(SimpleTitles.Indexing,{
      passIndex:0,
      newUiSelectable:(indexable)=>indexable,
      getIndexables:()=>SimpleTitles.TextualIndexables,
    } as IndexingCoupler),
    index=facets.newTextualTarget(SimpleTitles.Index,{
      getText:()=>''+facets.getTargetState(SimpleTitles.Indexing),
    }),
    indexed=facets.newTextualTarget(SimpleTitles.Indexed,{
      getText:()=>SimpleTitles.TextualIndexables[facets.getTargetState(SimpleTitles.Indexing)as number],
    });
  return facets.newTargetGroup('IndexingTest',[indexing,index,indexed]);
}
function newAllSimplesTree(facets:Facets):Target{
  return facets.newTargetGroup('AllSimples',[
    newTextualTree(facets),
    newTogglingTree(facets,true),
    newIndexingTree(facets),
    newTriggerTree(facets)]);
}
function buildTextual(facets:Facets){
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
function buildToggling(facets:Facets){
  ReactDOM.render(
    <RowPanel title={SimpleTests.TogglingLive.name} withRubric={true}>
      <TogglingCheckbox title={SimpleTitles.Toggling} facets={facets}/>
      <TextualLabel title={SimpleTitles.Toggled} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );

}
function buildTrigger(facets:Facets){
  ReactDOM.render(
    <RowPanel title={SimpleTests.Trigger.name} withRubric={true}>
      <TriggerButton title={SimpleTitles.Trigger} facets={facets}/>
      <TextualLabel title={SimpleTitles.Triggereds} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  )
}
function buildIndexing(facets:Facets){
  ReactDOM.render(
    <RowPanel title={SimpleTests.Indexing.name} withRubric={true}>
      <IndexingDropdown title={SimpleTitles.Indexing} facets={facets}/>
      <TextualLabel title={SimpleTitles.Index} facets={facets}/>
      <TextualLabel title={SimpleTitles.Indexed} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildAllSimples(facets:Facets){
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
        {false?<IndexingDropdown title={SimpleTitles.Indexing} facets={facets}/>
          :<IndexingList title={SimpleTitles.Indexing} facets={facets}/>}
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
function buildAllSimplesForm(facets:Facets){
  const textual1=SimpleTitles.FirstTextual,textual2=SimpleTitles.SecondTextual;
  const specs:FieldSpec[]=[
    {type:FieldType.TextualField,title:textual1},
    {type:FieldType.TextualLabel,title:textual1},
    {type:FieldType.TextualField,title:textual2,cols:40},
    {type:FieldType.TextualLabel,title:textual2},
    {type:FieldType.TogglingCheckbox,title:SimpleTitles.Toggling},
    {type:FieldType.TextualLabel,title:SimpleTitles.Toggled},
    {type:FieldType.IndexingDropdown,title:SimpleTitles.Indexing},
    {type:FieldType.TextualLabel,title:SimpleTitles.Indexed},
    {type:FieldType.TextualLabel,title:SimpleTitles.Index},
    {type:FieldType.TriggerButton,title:SimpleTitles.Trigger},
    {type:FieldType.TextualLabel,title:SimpleTitles.Triggereds},
  ];
  ReactDOM.render(
    <RowPanel title={SimpleTests.AllNonSelecting.name+'Form'} withRubric={false}>
      {specs.map((spec,key)=>newFormField(spec,facets,key))}
    </RowPanel>,
    document.getElementById('root'),
  );
}
function setSimplesLive(facets:Facets,state:boolean){
  [SimpleTitles.FirstTextual,SimpleTitles.SecondTextual,
    SimpleTitles.Indexed,SimpleTitles.Indexing,SimpleTitles.Index,
    SimpleTitles.Trigger,SimpleTitles.Triggereds,
  ].forEach(title=>{
    facets.setTargetLive(title,state);
  })
}
function newSelectingTypedTree(facets:Facets){
  function listAt():number{
    return facets.getTargetState(frame.indexingTitle as string) as number;
  }
  function getType(indexed:TextContent){
    return TextContentType.getContentType(indexed);
  }
  const frame:IndexingFramePolicy={
    frameTitle:SelectingTitles.Frame,
    indexingTitle:SelectingTitles.Chooser,
    getIndexables:()=>textContents,
    newUiSelectable:(item:TextContent)=>item.text,
    newFrameTargets:()=>[
      facets.newTextualTarget(SimpleTitles.Indexed,{
        getText:()=>getType(facets.getIndexingState(
          SelectingTitles.Chooser).indexed).name,
      }),
    ]
    ,
    newIndexedTreeTitle:indexed=>SelectingTitles.Selected+getType(indexed).titleTail,
    newIndexedTree:(indexed:TextContent,title:string)=>{
      const tail=getType(indexed).titleTail;
      return facets.newTargetGroup(title,tail===''?[
        facets.newTextualTarget(SelectingTitles.OpenEditButton,{
          passText:indexed.text,
          targetStateUpdated:state=>indexed.text=state as string,
        }),
      ]:[
        facets.newTextualTarget(SelectingTitles.OpenEditButton+tail,{
          passText:indexed.text,
          targetStateUpdated:state=>indexed.text=state as string,
        }),
        facets.newTextualTarget(SelectingTitles.CharsCount+tail,{
          getText:()=>''+indexed.text.length,
        }),
      ])
    },
  };
  return facets.newIndexingFrame(frame);
}
function newSelectingScrollingTree(facets:Facets){
  let createNew=(from:TextContent)=>({text:from.text+'+'}as TextContent);
  const list:ScrollableList=new ScrollableList(textContents,3,facets,SelectingTitles.Chooser,createNew);
  const frame:IndexingFramePolicy={
    frameTitle:SelectingTitles.Frame,
    indexingTitle:SelectingTitles.Chooser,
    newFrameTargets:()=>newSelectingActionTargets(facets,list),
    getIndexables:()=>list.getScrolledItems(),
    newUiSelectable:(item:TextContent)=>item.text,
    newIndexedTreeTitle:indexed=>SelectingTitles.Selected,
    newIndexedTree:(indexed:TextContent,title:string)=>{
      traceThing('^newIndexedTargets',{indexed:indexed});
      return facets.newTargetGroup(title,[
        facets.newTextualTarget(SelectingTitles.OpenEditButton,{
          passText:indexed.text,
          targetStateUpdated:state=>indexed.text=state as string,
        }),
        facets.newTextualTarget(SelectingTitles.CharsCount,{
          getText:()=>''+(facets.getTargetState(SelectingTitles.OpenEditButton)as string
          ).length,
        }),
      ])
    },
  };
  return facets.newIndexingFrame(frame);
}
function buildSelectingTyped(facets:Facets){
  function newEditField(tail:string){
    return false?null:<PanelRow>
      <TextualField title={SelectingTitles.OpenEditButton+tail} facets={facets}
                    cols={30}/>
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
function buildSelectingScrolling(facets:Facets){
  ReactDOM.render(
    <RowPanel title={SimpleTests.SelectingScrolling.name} withRubric={true}>
      <RowPanel title={SelectingTitles.Frame}>
        {false?<IndexingDropdown title={SelectingTitles.Chooser} facets={facets}/>:
          <IndexingList
            title={SelectingTitles.Chooser }
            facets={facets}
            listWidth={false?NaN:200}/>}
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
class SimpleTest{
  constructor(readonly name:string,
              readonly newTrees:(f:Facets,flag?:boolean)=>Target,
              readonly buildLayout:(f:Facets)=>void,
              readonly onRetargeted?:(facets:Facets,active:string)=>void,){}
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
  AllNonSelecting:new SimpleTest('AllNonSelecting',newAllSimplesTree,
    true?buildAllSimples:buildAllSimplesForm),
  SelectingTyped:new SimpleTest('SelectingTyped',newSelectingTypedTree,
    buildSelectingTyped,
    (facets:Facets,activeTitle:string)=>{
      traceThing('^disableAll',{activeTitle:activeTitle});
      const live=true?null:facets.getTargetState(SelectingTitles.Live) as boolean;
      if(live!==null) [SelectingTitles.OpenEditButton,SelectingTitles.CharsCount].forEach(title=>
        ['',TextContentType.ShowChars.titleTail].forEach(tail=>
          facets.setTargetLive(title+tail,live),
        ),
      );
    }),
  SelectingScrolling:new SimpleTest('SelectingScrolling',newSelectingScrollingTree,
    buildSelectingScrolling,
    (f:Facets,activeTitle:string)=>selectingFacetsRetargeted(f)),
};
export function launchApp(){
  if(true) new SimpleApp(SimpleTests.SelectingTyped).buildSurface();
  else new ContentingApp().buildSurface();
}
