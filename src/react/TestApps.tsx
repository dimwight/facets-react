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
  Selecting,
  Trees,
  SelectingTitles as Selectings,
  SimpleTitles as Simples,
  Texts,
} from '../app/_globals';
import {traceThing} from '../util/_globals';
class Spec{
  constructor(readonly name:string,
              readonly newTrees:(f:Facets,flag?:boolean)=>Target,
              readonly buildLayout:(f:Facets)=>void,
              readonly onRetargeted?:(facets:Facets,active:string)=>void,){}
}
class App extends AppCore{
  constructor(readonly test:Spec){
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
export const Specs={
  Textual:new Spec('Textual',Trees.newTextual,buildTextual),
  TogglingLive:new Spec('TogglingLive',Trees.newToggling,buildToggling,
    (facets:Facets)=>{
      facets.setTargetLive(Simples.Toggled,
        facets.getTargetState(Simples.Toggling)as boolean);
    }),
  Indexing:new Spec('Indexing',Trees.newIndexing,buildIndexing),
  Trigger:new Spec('Trigger',Trees.newTrigger,buildTrigger),
  AllNonSelecting:new Spec('AllNonSelecting',Trees.newAllSimples,
    true?buildAllSimples:buildAllSimplesForm),
  SelectingTyped:new Spec('SelectingTyped',Trees.newSelectingTyped,
    buildSelectingTyped,
    (facets:Facets,activeTitle:string)=>{
      traceThing('^disableAll',{activeTitle:activeTitle});
      const live=true?null:facets.getTargetState(Selectings.Live) as boolean;
      if(live!==null) [Selectings.TextEditField,Selectings.CharsCount].forEach(title=>
        ['',Texts.Type.ShowChars.titleTail].forEach(tail=>
          facets.setTargetLive(title+tail,live),
        ),
      );
    }),
  SelectingScrolling:new Spec('SelectingScrolling',Trees.newSelectingScrolling,
    buildSelectingScrolling,
    (f:Facets,activeTitle:string)=>Selecting.facetsRetargeted(f)),
};
function buildTextual(facets:Facets){
  const first=Simples.FirstTextual,second=Simples.SecondTextual;
  ReactDOM.render(
    <RowPanel title={Specs.Textual.name} withRubric={true}>
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
    <RowPanel title={Specs.TogglingLive.name} withRubric={true}>
      <TogglingCheckbox title={Simples.Toggling} facets={facets}/>
      <TextualLabel title={Simples.Toggled} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );

}
function buildTrigger(facets:Facets){
  ReactDOM.render(
    <RowPanel title={Specs.Trigger.name} withRubric={true}>
      <TriggerButton title={Simples.Trigger} facets={facets}/>
      <TextualLabel title={Simples.Triggereds} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  )
}
function buildIndexing(facets:Facets){
  ReactDOM.render(
    <RowPanel title={Specs.Indexing.name} withRubric={true}>
      <IndexingDropdown title={Simples.Indexing} facets={facets}/>
      <TextualLabel title={Simples.Index} facets={facets}/>
      <TextualLabel title={Simples.Indexed} facets={facets}/>
    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildAllSimples(facets:Facets){
  const textual1=Simples.FirstTextual,textual2=Simples.SecondTextual;
  ReactDOM.render(<div>
      <RowPanel title={Specs.Textual.name} withRubric={true}>
        <TextualField title={textual1} facets={facets}/>
        <TextualLabel title={textual1} facets={facets}/>
        <TextualField title={textual2} facets={facets} cols={40}/>
        <TextualLabel title={textual2} facets={facets}/>
      </RowPanel>
      <RowPanel title={Specs.TogglingLive.name} withRubric={true}>
        <TogglingCheckbox title={Simples.Toggling} facets={facets}/>
        <TextualLabel title={Simples.Toggled} facets={facets}/>
      </RowPanel>
      <RowPanel title={Specs.Indexing.name} withRubric={true}>
        {true?<IndexingDropdown title={Simples.Indexing} facets={facets}/>
          :<IndexingList title={Simples.Indexing} facets={facets}/>}
        <TextualLabel title={Simples.Index} facets={facets}/>
        <TextualLabel title={Simples.Indexed} facets={facets}/>
      </RowPanel>
      <RowPanel title={Specs.Trigger.name} withRubric={true}>
        <TriggerButton title={Simples.Trigger} facets={facets}/>
        <TextualLabel title={Simples.Triggereds} facets={facets}/>
      </RowPanel>
    </div>,
    document.getElementById('root'),
  );
}
function buildAllSimplesForm(facets:Facets){
  const textual1=Simples.FirstTextual,textual2=Simples.SecondTextual;
  const specs:FieldSpec[]=[
    {type:FieldType.TextualField,title:textual1},
    {type:FieldType.TextualLabel,title:textual1},
    {type:FieldType.TextualField,title:textual2,cols:40},
    {type:FieldType.TextualLabel,title:textual2},
    {type:FieldType.TogglingCheckbox,title:Simples.Toggling},
    {type:FieldType.TextualLabel,title:Simples.Toggled},
    {type:FieldType.IndexingDropdown,title:Simples.Indexing},
    {type:FieldType.TextualLabel,title:Simples.Indexed},
    {type:FieldType.TextualLabel,title:Simples.Index},
    {type:FieldType.TriggerButton,title:Simples.Trigger},
    {type:FieldType.TextualLabel,title:Simples.Triggereds},
  ];
  ReactDOM.render(
    <RowPanel title={Specs.AllNonSelecting.name+'Form'} withRubric={false}>
      {specs.map((spec,key)=>newFormField(spec,facets,key))}
    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildSelectingTyped(facets:Facets){
  function newEditField(tail:string){
    return <PanelRow>
      <TextualField title={Selectings.TextEditField+tail} facets={facets}cols={30}/>
    </PanelRow>;
  }
  let tail=Texts.Type.ShowChars.titleTail;
  let liveCheckbox=true?null:<PanelRow>
    <TogglingCheckbox title={Selectings.Live} facets={facets}/>
  </PanelRow>;
  ReactDOM.render(<RowPanel title={Specs.SelectingTyped.name} withRubric={true}>
      {false?<IndexingDropdown title={Selectings.Chooser} facets={facets}/>
        :<IndexingList title={Selectings.Chooser} facets={facets}/>}
      {true?null:<PanelRow>
        <TextualLabel title={Simples.Indexed} facets={facets}/>
      </PanelRow>}
      <ShowPanel title={Simples.Indexed} facets={facets}>
        <RowPanel title={Texts.Type.Standard.name}>
          {newEditField('')}
        </RowPanel>
        <RowPanel title={Texts.Type.ShowChars.name}>
          {newEditField(tail)}
          <PanelRow>
            <TextualLabel title={Selectings.CharsCount+tail} facets={facets}/>
          </PanelRow>
        </RowPanel>
      </ShowPanel>

    </RowPanel>,
    document.getElementById('root'),
  );
}
function buildSelectingScrolling(facets:Facets){
  ReactDOM.render(
    <RowPanel title={Specs.SelectingScrolling.name} withRubric={true}>
      <RowPanel title={Selectings.Frame}>
        {false?<IndexingDropdown title={Selectings.Chooser} facets={facets}/>:
          <IndexingList
            title={Selectings.Chooser }
            facets={facets}
            listWidth={false?NaN:200}/>}
        <PanelRow>
          <TriggerButton title={Selectings.UpButton} facets={facets}/>
          <TriggerButton title={Selectings.DownButton} facets={facets}/>
          <TriggerButton title={Selectings.DeleteButton} facets={facets}/>
          <TriggerButton title={Selectings.NewButton} facets={facets}/>
        </PanelRow>
        <PanelRow>
          <TextualField title={Selectings.TextEditField} facets={facets} cols={30}/>
        </PanelRow>
      </RowPanel>
    </RowPanel>,
    document.getElementById('root'),
  );
}
export function buildContentingLayout(f:Facets,fullListTargets:boolean){
  function newEditField(tail:string){
    return (<PanelRow>
      <TextualField title={Selectings.TextEditField+tail} facets={f} cols={30}/>
    </PanelRow>)
  }
  function newSaveCancelRow(tail:string){
    return (<PanelRow>
      <TriggerButton title={Selectings.SaveEditButton+tail} facets={f}/>
      <TriggerButton title={Selectings.CancelEditButton+tail} facets={f}/>
    </PanelRow>)
  }
  let tail=Texts.Type.ShowChars.titleTail;
  const openEdit=Selectings.OpenEditButton;
  ReactDOM.render(<ShowPanel title={f.activeContentTitle} facets={f}>
      <RowPanel title={Selectings.Chooser}>
        <IndexingList
          title={Simples.Indexing}
          facets={f}
          listWidth={200}
          itemDoubleClicked={()=>f.updateTarget(openEdit,'itemDoubleClicked')}
        />}
        {fullListTargets?<PanelRow>
            <TriggerButton title={Selectings.UpButton} facets={f}/>
            <TriggerButton title={Selectings.DownButton} facets={f}/>
            <TriggerButton title={Selectings.DeleteButton} facets={f}/>
            <br/><br/>
            <TriggerButton title={openEdit} facets={f}/>
          </PanelRow>
          :<PanelRow>
            <TriggerButton title={openEdit} facets={f}/>
          </PanelRow>
        }
      </RowPanel>
      <RowPanel title={Texts.Type.Standard.name}>
        {newEditField('')}
        {newSaveCancelRow('')}
      </RowPanel>
      <RowPanel title={Texts.Type.ShowChars.name}>
        {newEditField(tail)}
        <PanelRow>
          <TextualLabel title={Selectings.CharsCount+tail} facets={f}/>
        </PanelRow>
        {newSaveCancelRow(tail)}
      </RowPanel>
    </ShowPanel>,
    document.getElementById('root'),
  );
}
export function launchApp(spec:Spec){
  new App(spec).buildSurface();
}
