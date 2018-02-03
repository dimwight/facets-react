import React from 'react';
import ReactDOM from 'react-dom';
import {
  Facets,
  IndexingFramePolicy,
  newInstance,
} from 'facets-js';
import {
  IndexingList,
  PanelRow,
  RowPanel,
  TextualField,
  TriggerButton,
  TextualLabel,
  IndexingListFlex,
} from '../react/_globals';
import {
  ScrollableList,
  SelectingTitles,
  SurfaceApp,
} from '../facets/_globals';
import {
  DateTitles,
  DayItem,
  traceThing,
} from '../util/_globals';
export function newTree(f:Facets){
  function newListTargets(list:ScrollableList){
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
  function newItemTargets(day:DayItem){
    return f.newTargetGroup(DateTitles.Day,[
      f.newTextualTarget(DateTitles.Year,{
        passText:day.year(),
      }),
      f.newTextualTarget(DateTitles.Month,{
        passText:day.month(),
      }),
    ])
  }
  const list=new ScrollableList([new DayItem(new Date())],7,f,DateTitles.Indexing);
  const frame:IndexingFramePolicy={
    frameTitle:DateTitles.CalendarApp,
    indexingTitle:DateTitles.Indexing,
    newFrameTargets:()=>newListTargets(list),
    newIndexedTree:(day)=>{
      return newItemTargets(day);
    },
    getIndexables:()=>list.getScrolledItems(),
    newUiSelectable:(day:DayItem)=>day.weekDay(),
    newIndexedTreeTitle:indexed=>SelectingTitles.Selected,
  };
  return f.newIndexingFrame(frame);
}
export function buildLayout(f:Facets){
  ReactDOM.render(<RowPanel title={DateTitles.CalendarApp} withRubric={true}>
      <PanelRow>
        <TextualLabel title={DateTitles.Year} facets={f}/>
        <TextualLabel title={DateTitles.Month} facets={f}/>
      </PanelRow>
      {false?<IndexingList
        title={DateTitles.Indexing}
        facets={f}
        listWidth={false?NaN:20}/>:
        <IndexingListFlex
        title={DateTitles.Indexing}
        facets={f}/>}
      <PanelRow>
        <TriggerButton title={SelectingTitles.ScrollUp} facets={f}/>
        <TriggerButton title={SelectingTitles.ScrollDown} facets={f}/>
      </PanelRow>
      <TextualField title={SelectingTitles.ScrollBy} facets={f} cols={1}/>
    </RowPanel>,
    document.getElementById('root'),
  );
}
function disableAll(f:Facets){
  traceThing('^onRetargeted');
  if(false)[
    DateTitles.Year,
    DateTitles.Month,
    DateTitles.Indexing,
    SelectingTitles.ScrollUp,
    SelectingTitles.ScrollDown,
    SelectingTitles.ScrollBy
  ].forEach(title=>{
    f.setTargetLive(title,false)
  })
}
export function launchApp(){
  new class extends SurfaceApp{
    getContentTrees(){
      this.onRetargeted=activeTitle=>disableAll(this.facets);
      return newTree(this.facets)
    }
    buildLayout(){
      buildLayout(this.facets)
    }
  }(newInstance(false)).buildSurface();
}