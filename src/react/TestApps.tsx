import React from 'react';
import ReactDOM from 'react-dom';
import {
  Facets,
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
} from './_globals';
import {
  AppCore,
  ContentingApp,
  newAllSimplesTree,
  newIndexingTree,
  newSelectingScrollingTree,
  newSelectingTypedTree,
  newTextualTree,
  newTogglingTree,
  newTriggerTree,
  selectingFacetsRetargeted,
  SelectingTitles,
  SimpleTitles,
  TextContentType,
} from '../app/_globals';
import {traceThing} from '../util/_globals';
class TestApp extends AppCore{
  constructor(readonly test:TestAppSpec){
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
class TestAppSpec{
  constructor(readonly name:string,
              readonly newTrees:(f:Facets,flag?:boolean)=>Target,
              readonly buildLayout:(f:Facets)=>void,
              readonly onRetargeted?:(facets:Facets,active:string)=>void,){}
}
const TestAppSpecs={
  Textual:new TestAppSpec('Textual',newTextualTree,buildTextual),
  TogglingLive:new TestAppSpec('TogglingLive',newTogglingTree,buildToggling,
    (facets:Facets)=>{
      facets.setTargetLive(SimpleTitles.Toggled,
        facets.getTargetState(SimpleTitles.Toggling)as boolean);
    }),
  Indexing:new TestAppSpec('Indexing',newIndexingTree,buildIndexing),
  Trigger:new TestAppSpec('Trigger',newTriggerTree,buildTrigger),
  AllNonSelecting:new TestAppSpec('AllNonSelecting',newAllSimplesTree,
    true?buildAllSimples:buildAllSimplesForm),
  SelectingTyped:new TestAppSpec('SelectingTyped',newSelectingTypedTree,
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
  SelectingScrolling:new TestAppSpec('SelectingScrolling',newSelectingScrollingTree,
    buildSelectingScrolling,
    (f:Facets,activeTitle:string)=>selectingFacetsRetargeted(f)),
};
function buildTextual(facets:Facets){
  const first=SimpleTitles.FirstTextual,second=SimpleTitles.SecondTextual;
  ReactDOM.render(
    <RowPanel title={TestAppSpecs.Textual.name} withRubric={true}>
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
    <RowPanel title={TestAppSpecs.TogglingLive.name} withRubric={true}>
      <TogglingCheckbox title={SimpleTitles.Toggling} facets={facets}/>
      <TextualLabel title={SimpleTitles.Toggled} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );

}
function buildTrigger(facets:Facets){
  ReactDOM.render(
    <RowPanel title={TestAppSpecs.Trigger.name} withRubric={true}>
      <TriggerButton title={SimpleTitles.Trigger} facets={facets}/>
      <TextualLabel title={SimpleTitles.Triggereds} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  )
}
function buildIndexing(facets:Facets){
  ReactDOM.render(
    <RowPanel title={TestAppSpecs.Indexing.name} withRubric={true}>
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
      <RowPanel title={TestAppSpecs.Textual.name} withRubric={true}>
        <TextualField title={textual1} facets={facets}/>
        <TextualLabel title={textual1} facets={facets}/>
        <TextualField title={textual2} facets={facets} cols={40}/>
        <TextualLabel title={textual2} facets={facets}/>
      </RowPanel>
      <RowPanel title={TestAppSpecs.TogglingLive.name} withRubric={true}>
        <TogglingCheckbox title={SimpleTitles.Toggling} facets={facets}/>
        <TextualLabel title={SimpleTitles.Toggled} facets={facets}/>
      </RowPanel>
      <RowPanel title={TestAppSpecs.Indexing.name} withRubric={true}>
        {false?<IndexingDropdown title={SimpleTitles.Indexing} facets={facets}/>
          :<IndexingList title={SimpleTitles.Indexing} facets={facets}/>}
        <TextualLabel title={SimpleTitles.Index} facets={facets}/>
        <TextualLabel title={SimpleTitles.Indexed} facets={facets}/>
      </RowPanel>
      <RowPanel title={TestAppSpecs.Trigger.name} withRubric={true}>
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
    <RowPanel title={TestAppSpecs.AllNonSelecting.name+'Form'} withRubric={false}>
      {specs.map((spec,key)=>newFormField(spec,facets,key))}
    </RowPanel>,
    document.getElementById('root'),
  );
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
  ReactDOM.render(<RowPanel title={TestAppSpecs.SelectingTyped.name} withRubric={true}>
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
    <RowPanel title={TestAppSpecs.SelectingScrolling.name} withRubric={true}>
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
export function launchApp(){
  if(true) new TestApp(TestAppSpecs.SelectingTyped).buildSurface();
  else new ContentingApp().buildSurface();
}
