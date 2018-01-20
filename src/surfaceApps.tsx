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
  ScrollableItems,
  SelectingTitles,
} from './facets/Selecting';
import {
  traceThing,
  SkippableItem,
} from './util/_globals';
import {SurfaceApp} from './facets/Surface';
import {FieldSpec} from './react/Facet';
namespace SimpleTitles{
  export const FirstTextual='First',SecondTextual='Second',
    Indexing='Choose Item',
    Index='Index',Indexed='Indexed',IndexStart=0,
    TextualIndexables=[FirstTextual,SecondTextual],
    Toggling='Click to toggle',Toggled='TogglingLive state',
    Trigger='Click Me!',Triggereds='Button presses',
    ToggleStart=false,
    NumericField='Number',NumericLabel='Value',NumericStart=123;
}
class TestApp extends SurfaceApp{
  constructor(readonly test:SimpleApp){
    super(newInstance(false));
  }
  getContentTrees():Target|Target[]{
    return this.test.newTrees(this.facets)
  }
  onRetargeted(active){
    const onRetargeted=this.test.onRetargeted;
    if(onRetargeted) onRetargeted(this.facets,active)
  }
  buildLayout():void{
    this.test.buildLayout(this.facets)
  }
}
class TextContent{
  constructor(public text:string){}
  clone():TextContent{
    return new TextContent(this.text)
  }
  copyClone(clone:TextContent){
    this.text=clone.text
  }
}
const textContents=[
  new TextContent('Hello world!'),
  new TextContent('Hello, good evening and welcome!'),
  new TextContent('Hello Dolly!'),
  new TextContent('Hello, sailor!'),
];
class TextContentType{
  constructor(readonly name,
              readonly titleTail,){}
  static Standard=new TextContentType('Standard','');
  static ShowChars=new TextContentType('ShowChars','|ShowChars');
  static getContentType(content:TextContent){
    return content.text.length>20?TextContentType.ShowChars:TextContentType.Standard;
  }
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
function newTogglingTree(facets,setLive){
  const toggling=facets.newTogglingTarget(SimpleTitles.Toggling,{
      passSet:SimpleTitles.ToggleStart,
      targetStateUpdated:state=>{
        if(setLive) setSimplesLive(facets,state)
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
function newIndexingTree(facets){
  const indexing=facets.newIndexingTarget(SimpleTitles.Indexing,{
      passIndex:0,
      newUiSelectable:(indexable)=>indexable,
      getIndexables:(title)=>SimpleTitles.TextualIndexables,
    } as IndexingCoupler),
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
    newIndexedTreeTitle:indexed=>SelectingTitles.Frame+getType(indexed).titleTail,
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
function newSelectingScrollingTree(facets){
  const frame:IndexingFramePolicy={
    frameTitle:SelectingTitles.Frame,
    indexingTitle:SelectingTitles.Chooser,
    newFrameTargets:()=>list.newActionTargets(),
    getIndexables:()=>list.getScrolledItems(),
    newUiSelectable:false?null:(item:TextContent)=>item.text,
    newIndexedTreeTitle:indexed=>SelectingTitles.Frame,
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
  let createNew=(from:TextContent)=>({text:from.text+'+'}as TextContent);
  const list=new ScrollableItems(textContents,3,facets,
    frame.indexingTitle,createNew);
  return facets.newIndexingFrame(frame);
}
function buildTextual(facets){
  const first=SimpleTitles.FirstTextual,second=SimpleTitles.SecondTextual;
  ReactDOM.render(
    <RowPanel title={SimpleApps.Textual.name} withRubric={true}>
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
    <RowPanel title={SimpleApps.TogglingLive.name} withRubric={true}>
      <TogglingCheckbox title={SimpleTitles.Toggling} facets={facets}/>
      <TextualLabel title={SimpleTitles.Toggled} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );

}
function buildTrigger(facets){
  ReactDOM.render(
    <RowPanel title={SimpleApps.Trigger.name} withRubric={true}>
      <TriggerButton title={SimpleTitles.Trigger} facets={facets}/>
      <TextualLabel title={SimpleTitles.Triggereds} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  )
}
function buildIndexing(facets){
  ReactDOM.render(
    <RowPanel title={SimpleApps.Indexing.name} withRubric={true}>
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
      <RowPanel title={SimpleApps.Textual.name} withRubric={true}>
        <TextualField title={textual1} facets={facets}/>
        <TextualLabel title={textual1} facets={facets}/>
        <TextualField title={textual2} facets={facets} cols={40}/>
        <TextualLabel title={textual2} facets={facets}/>
      </RowPanel>
      <RowPanel title={SimpleApps.TogglingLive.name} withRubric={true}>
        <TogglingCheckbox title={SimpleTitles.Toggling} facets={facets}/>
        <TextualLabel title={SimpleTitles.Toggled} facets={facets}/>
      </RowPanel>
      <RowPanel title={SimpleApps.Indexing.name} withRubric={true}>
        <IndexingDropdown title={SimpleTitles.Indexing} facets={facets}/>
        <TextualLabel title={SimpleTitles.Index} facets={facets}/>
        <TextualLabel title={SimpleTitles.Indexed} facets={facets}/>
      </RowPanel>
      <RowPanel title={SimpleApps.Trigger.name} withRubric={true}>
        <TriggerButton title={SimpleTitles.Trigger} facets={facets}/>
        <TextualLabel title={SimpleTitles.Triggereds} facets={facets}/>
      </RowPanel>
    </div>,
    document.getElementById('root'),
  );
}
function buildAllSimplesForm(facets){
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
    <RowPanel title={SimpleApps.AllNonSelecting.name+'Form'} withRubric={false}>
      {specs.map((spec,key)=>newFormField(spec,facets,key))}
    </RowPanel>,
    document.getElementById('root'),
  );
}
function setSimplesLive(facets,state){
  [SimpleTitles.FirstTextual,SimpleTitles.SecondTextual,
    SimpleTitles.Indexed,SimpleTitles.Indexing,SimpleTitles.Index,
    SimpleTitles.Trigger,SimpleTitles.Triggereds,
  ].forEach(title=>{
    facets.setTargetLive(title,state);
  })
}
function buildSelectingTyped(facets){
  function newEditField(tail){
    return false?null:<PanelRow>
      <TextualField title={SelectingTitles.OpenEditButton+tail} facets={facets}
                    cols={30}/>
    </PanelRow>;
  }
  let tail=TextContentType.ShowChars.titleTail;
  let liveCheckbox=true?null:<PanelRow>
    <TogglingCheckbox title={SelectingTitles.Live} facets={facets}/>
  </PanelRow>;
  ReactDOM.render(<RowPanel title={SimpleApps.SelectingTyped.name} withRubric={true}>
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
function buildSelectingScrolling(facets){
  ReactDOM.render(<RowPanel title={SimpleApps.SelectingScrolling.name} withRubric={true}>
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
class DateContent implements SkippableItem<Date>{
  constructor(public readonly date:Date){}
  newSkipped(skip:number):SkippableItem<any>{
    return new DateContent(new Date(this.date.valueOf()+skip))
  }
}
namespace DateTitles{
  export const App='DateSelecting',Chooser='Select Date';
}
function newDateSelectingTree(facets){
  const frame:IndexingFramePolicy={
    frameTitle:DateTitles.App,
    indexingTitle:DateTitles.Chooser,
    newFrameTargets:()=>list.newActionTargets(),
    getIndexables:()=>list.getScrolledItems(),
    newUiSelectable:(item:DateContent)=>item.date.valueOf(),
    newIndexedTreeTitle:indexed=>SelectingTitles.Frame,
  };
  const list=new ScrollableItems([new DateContent(new Date())],3,facets,frame.indexingTitle);
  return facets.newIndexingFrame(frame);
}
function buildDateSelecting(facets){
  ReactDOM.render(<RowPanel title={SimpleApps.DateSelecting.name} withRubric={true}>
      <IndexingList
        title={DateTitles.Chooser}
        facets={facets}
        listWidth={false?null:200}/>
      <PanelRow>
        <TriggerButton title={SelectingTitles.ScrollUp} facets={facets}/>
        <TriggerButton title={SelectingTitles.ScrollDown} facets={facets}/>
      </PanelRow>
    </RowPanel>,
    document.getElementById('root'),
  );
}
class SimpleApp{
  constructor(readonly name,
              readonly newTrees,
              readonly buildLayout,
              readonly onRetargeted?,){}
}
const SimpleApps={
  Textual:new SimpleApp('Textual',newTextualTree,buildTextual),
  TogglingLive:new SimpleApp('TogglingLive',newTogglingTree,buildToggling,
    (facets:Facets)=>{
      facets.setTargetLive(SimpleTitles.Toggled,
        facets.getTargetState(SimpleTitles.Toggling)as boolean);
    }),
  Indexing:new SimpleApp('Indexing',newIndexingTree,buildIndexing),
  Trigger:new SimpleApp('Trigger',newTriggerTree,buildTrigger),
  AllNonSelecting:new SimpleApp('AllNonSelecting',newAllSimplesTree,
    false?buildAllSimples:buildAllSimplesForm),
  SelectingTyped:new SimpleApp('SelectingTyped',newSelectingTypedTree,buildSelectingTyped,
    (facets,activeTitle)=>{
      traceThing('^onRetargeted:no live',{activeTitle:activeTitle});
      const live=true?null:facets.getTargetState(SelectingTitles.Live) as boolean;
      if(live!==null) [SelectingTitles.OpenEditButton,SelectingTitles.CharsCount].forEach(title=>
        ['',TextContentType.ShowChars.titleTail].forEach(tail=>
          facets.setTargetLive(title+tail,live),
        ),
      );
    }),
  SelectingScrolling:new SimpleApp('SelectingScrolling',newSelectingScrollingTree,buildSelectingScrolling),
  DateSelecting:new SimpleApp(DateTitles.App,newDateSelectingTree,buildDateSelecting),
};
class ContentingTest extends SurfaceApp{
  readonly fullChooserTargets=false;
  readonly chooserTitle=SelectingTitles.Chooser;
  readonly indexingTitle=SimpleTitles.Indexing;
  readonly list;
  constructor(){
    super(newInstance(true));
    this.list=new ScrollableItems(textContents,3,this.facets,
      this.indexingTitle);
  }
  getContentTrees():Target|Target[]{
    function activateChooser(){
      f.activateContentTree(SelectingTitles.Chooser);
    }
    function newContentTree(content:TextContent):Target{
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
      if(type==TextContentType.ShowChars) members.push(newCharsTarget(tail));
      members.push(f.newTriggerTarget(SelectingTitles.SaveEditButton+tail,{
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
      newContentTree(textContents[0]),
      newContentTree(textContents[1]),
      f.newIndexingFrame({
        frameTitle:this.chooserTitle,
        indexingTitle:this.indexingTitle,
        getIndexables:()=>this.list.getScrollings(),
        newFrameTargets:()=>chooserTargets,
        newUiSelectable:(item:TextContent)=>item.text,
      }));
    return trees;
  }
  onRetargeted(activeTitle:string){
    if(this.fullChooserTargets) this.list.onFacetsRetargeted();
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
export function launchApp(){
  if(true) new TestApp(SimpleApps.DateSelecting).buildSurface();
  else new ContentingTest().buildSurface();
}