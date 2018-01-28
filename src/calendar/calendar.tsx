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
  FieldSpec,
} from '../react/_globals';
import {
  ScrollableItems,
  SelectingTitles,
  SurfaceApp,
} from '../facets/_globals';
import {
  traceThing,
  SkippableItem,
} from '../util/_globals';
class DateContent implements SkippableItem<Date>{
  constructor(public readonly date:Date){}
  newSkipped(skip:number):SkippableItem<any>{
    return new DateContent(new Date(this.date.valueOf()+skip))
  }
}
export namespace DateTitles{
  export const App='DateSelecting',Chooser='Select Date';
}
function newListActionTargets(f:Facets,list:ScrollableItems){
  let scrollBy=30;
  return [f.newTriggerTarget(SelectingTitles.ScrollUp,{
      targetStateUpdated:()=>list.scrollItems(-scrollBy),
    }),
      f.newTriggerTarget(SelectingTitles.ScrollDown,{
        targetStateUpdated:()=>list.scrollItems(scrollBy),
      }),
      f.newTextualTarget(SelectingTitles.ScrollBy,{
        passText:String(scrollBy),
        targetStateUpdated:state=>scrollBy=Number(state),
      })]
}
export function newDateSelectingTree(facets:Facets){
  const list=new ScrollableItems([new DateContent(new Date())],7,facets,DateTitles.Chooser);
  const frame:IndexingFramePolicy={
    frameTitle:DateTitles.App,
    indexingTitle:DateTitles.Chooser,
    newFrameTargets:()=>newListActionTargets(facets,list),
    getIndexables:()=>list.getScrolledItems(),
    newUiSelectable:(item:DateContent)=>item.date.valueOf(),
    newIndexedTreeTitle:indexed=>SelectingTitles.Frame,
  };
  return facets.newIndexingFrame(frame);
}
export function buildDateSelecting(facets:Facets){
  ReactDOM.render(<RowPanel title={DateTitles.App} withRubric={true}>
      <IndexingList
        title={DateTitles.Chooser}
        facets={facets}
        listWidth={false?NaN:200}/>
      <PanelRow>
        <TriggerButton title={SelectingTitles.ScrollUp} facets={facets}/>
        <TriggerButton title={SelectingTitles.ScrollDown} facets={facets}/>
      </PanelRow>
      <TextualField title={SelectingTitles.ScrollBy} facets={facets} cols={1}/>
    </RowPanel>,
    document.getElementById('root'),
  );
}
export function launchApp(){
  new class extends SurfaceApp{
    getContentTrees():Target|Target[]{
      return newDateSelectingTree(this.facets)
    }
    buildLayout():void{
      buildDateSelecting(this.facets)
    }
  }(newInstance(false)).buildSurface();
}