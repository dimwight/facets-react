import React from 'react';
import ReactDOM from 'react-dom';
import {
  Facets,
  IndexingFramePolicy,
  newInstance,
  Target,
} from 'facets-js';
import {
  IndexingList,
  PanelRow,
  RowPanel,
  TextualField,
  TriggerButton,
} from '../react/_globals';
import {
  ScrollableItems,
  SelectingTitles,
  SurfaceApp,
} from '../facets/_globals';
import {
  DayItem,
  DateTitles,
} from '../util/_globals';
export function newDateSelectingTree(f:Facets){
  function newListTargets(list:ScrollableItems){
    let scrollBy=7;
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
  const list=new ScrollableItems([new DayItem(new Date())],7,f,DateTitles.Chooser);
  const frame:IndexingFramePolicy={
    frameTitle:DateTitles.App,
    indexingTitle:DateTitles.Chooser,
    newFrameTargets:()=>newListTargets(list),
    newIndexedTree:(day:DayItem)=>{
      return f.newTargetGroup(DateTitles.Day,[
        f.newTextualTarget(DateTitles.Year,{
          passText:day.year()
        }),
        f.newTextualTarget(DateTitles.Month,{
          passText:day.month()
        })
      ])
    },
    getIndexables:()=>list.getScrolledItems(),
    newUiSelectable:(day:DayItem)=>day.weekDay(),
    newIndexedTreeTitle:indexed=>SelectingTitles.Frame,
  };
  return f.newIndexingFrame(frame);
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