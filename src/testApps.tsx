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
  ScrollableItems,
  SelectingTitles,
  SurfaceApp,
} from './facets/_globals';
import {traceThing,} from './util/_globals';
import {
  DateTitles,
  buildDateSelecting,
  newDateSelectingTree,
} from './calendar/_globals';
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
class SimpleApp extends SurfaceApp{
  constructor(readonly test:SimpleTest){
    super(newInstance(false));
  }
  getContentTrees():Target|Target[]{
    return this.test.newTrees(this.facets)
  }
  onRetargeted(active:string){
    const onRetargeted=this.test.onRetargeted;
    traceThing('^onRetargeted',onRetargeted);
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
  constructor(readonly name:string,
              readonly titleTail:string,){}
  static Standard=new TextContentType('Standard','');
  static ShowChars=new TextContentType('ShowChars','|ShowChars');
  static getContentType(content:TextContent){
    return content.text.length>20?TextContentType.ShowChars:TextContentType.Standard;
  }
}
function newTextualTree(facets:Facets){
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
function newAllSimplesTree(facets:Facets):Target{
  return facets.newTargetGroup('AllSimples',[
    newTextualTree(facets),
    newTogglingTree(facets,true),
    newIndexingTree(facets),
    newTriggerTree(facets)]);
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
    false?buildAllSimples:buildAllSimplesForm),
  SelectingTyped:new SimpleTest('SelectingTyped',newSelectingTypedTree,
    buildSelectingTyped,
    (facets:Facets,activeTitle:string)=>{
      traceThing('onRetargeted:no live',{activeTitle:activeTitle});
      const live=true?null:facets.getTargetState(SelectingTitles.Live) as boolean;
      if(live!==null) [SelectingTitles.OpenEditButton,SelectingTitles.CharsCount].forEach(title=>
        ['',TextContentType.ShowChars.titleTail].forEach(tail=>
          facets.setTargetLive(title+tail,live),
        ),
      );
    }),
  SelectingScrolling:new SimpleTest('SelectingScrolling',newSelectingScrollingTree,
    buildSelectingScrolling,
    (f:Facets,activeTitle:string)=>listFacetsRetargeted(f)),
};
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
function newSelectingScrollingTree(facets:Facets){
  let createNew=(from:TextContent)=>({text:from.text+'+'}as TextContent);
  const list:ScrollableItems=new ScrollableItems(textContents,3,facets,SelectingTitles.Chooser,createNew);
  const frame:IndexingFramePolicy={
    frameTitle:SelectingTitles.Frame,
    indexingTitle:SelectingTitles.Chooser,
    newFrameTargets:()=>newListActionTargets(facets,list),
    getIndexables:()=>list.getScrolledItems(),
    newUiSelectable:(item:TextContent)=>item.text,
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
  return facets.newIndexingFrame(frame);
}
function newListActionTargets(f:Facets,list:ScrollableItems){
  return [
    f.newTriggerTarget(SelectingTitles.UpButton,{
      targetStateUpdated:()=>list.swapItemDown(),
    }),
    f.newTriggerTarget(SelectingTitles.DownButton,{
      targetStateUpdated:()=>list.swapItemUp(),
    }),
    f.newTriggerTarget(SelectingTitles.DeleteButton,{
      targetStateUpdated:()=>list.deleteItem(),
    }),
    f.newTriggerTarget(SelectingTitles.NewButton,{
      targetStateUpdated:()=>list.addItem(),
    }),
  ]
}
function listFacetsRetargeted(f:Facets){
  let items:ScrollableItems=f.supplement as ScrollableItems;
  traceThing('^listFacetsRetargeted');
  const itemAt=items.itemAt(items.getShowAt());
  f.setTargetLive(SelectingTitles.DeleteButton,textContents.length>1);
  f.setTargetLive(SelectingTitles.UpButton,itemAt>0);
  f.setTargetLive(SelectingTitles.DownButton,
    itemAt<textContents.length-1);
}
class ContentingTest extends SurfaceApp{
  private readonly fullListTargets=true;
  private readonly chooserTitle=SelectingTitles.Chooser;
  private readonly indexingTitle=SimpleTitles.Indexing;
  private readonly list:ScrollableItems;
  constructor(){
    super(newInstance(false));
    this.list=new ScrollableItems(textContents,3,this.facets,this.indexingTitle);
  }
  getContentTrees():Target|Target[]{
    function activateChooser(){
      f.activateContentTree(SelectingTitles.Chooser);
    }
    function newContentTree(content:TextContent):Target{
      function newEditTarget(indexed:TextContent,tail:string){
        return f.newTextualTarget(SelectingTitles.TextEditField+tail,{
          passText:indexed.text,
          targetStateUpdated:(state,title)=>indexed.text=state as string,
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
    let chooserTargets=this.fullListTargets?newListActionTargets(f,this.list):[];
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
        getIndexables:()=>this.list.getScrolledItems(),
        newFrameTargets:()=>chooserTargets,
        newUiSelectable:(item:TextContent)=>item.text,
      }));
    return trees;
  }
  onRetargeted(activeTitle:string){
    if(this.fullListTargets) listFacetsRetargeted(this.facets);
    traceThing('^onRetargeted',activeTitle);
  }
  buildLayout(){
    function newEditField(tail:string){
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
  if(false) new SimpleApp(SimpleTests.SelectingScrolling).buildSurface();
  else new ContentingTest().buildSurface();
}
