import React from 'react';
import ReactDOM from 'react-dom';
import {
  Facets,
  IndexingFramePolicy,
  newInstance,
} from 'facets-js';
import {
  Facet,
  IndexingFacet,
  IndexingUiProps,
  LabelRubric,
  ListItemProps,
  PanelRow,
  RowPanel,
  TextualField,
  TextualLabel,
  TriggerButton,
} from '../react/_globals';
import {
  ItemScroller,
  ScrollableList,
  SelectingTitles,
  SurfaceApp,
} from '../facets/_globals';
import {
  DateTitles,
  DayItem,
  traceThing,
} from '../util/_globals';
function newTree(f:Facets){
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
  const list=new ScrollableList([new DayItem(new Date())],35,f,DateTitles.Indexing);
  const frame:IndexingFramePolicy={
    frameTitle:DateTitles.CalendarApp,
    indexingTitle:DateTitles.Indexing,
    newFrameTargets:()=>newListTargets(list),
    newIndexedTree:(day)=>{
      return newItemTargets(day);
    },
    getIndexables:()=>list.getScrolledItems(),
    newUiSelectable:(day:DayItem)=>day,
    newIndexedTreeTitle:indexed=>SelectingTitles.Selected,
  };
  return f.newIndexingFrame(frame);
}
function RowItem(p:ListItemProps){
  const selected=p.classTail.includes('Selected');
  const debug=false;
  return <div
    id={p.id}
    className={'listItemFlex'+p.classTail}
    tabIndex={p.tabIndex}
    onClick={p.onClick}
    onKeyDown={p.onKeyDown}
    style={{
      cursor:'default',
      fontSize:'110%',
      flexBasis:50,
      flexGrow:selected?4:1,
      height:p.height,
      display:'flex',
      alignItems:'center',
      border:debug?'1px dotted':null,
    }}>
    <div style={{
      flexGrow:1,
      textAlign:'center',
      border:debug?'1px solid':null,
    }}>{p.text}</div>
  </div>;
}
class IndexingRowList extends IndexingFacet{
  onItemClick=(e:KeyboardEvent)=>{
    if(!this.state.live) return;
    this.indexChanged((e.target as HTMLElement).id.substr(0,1));
  };
  onItemKeyDown=(e:KeyboardEvent)=>{
    if(!this.state.live) return;
    const id=(e.target as HTMLElement).id;
    const indexThen:number=Number(id.substr(0,id.indexOf('_')));
    let indexNow:number=indexThen;
    const key=e.key;
    const jump=key==='ArrowDown'?7:key==='ArrowUp'?-7:
      key==='ArrowRight'?1:key==='ArrowLeft'?-1:0;
    indexNow+=jump;
    if(indexNow===indexThen) return;
    const selectables=this.state.selectables;
    if(!selectables) throw new Error('No selectables');
    if(indexNow>=0&&indexNow<selectables.length)
      this.indexChanged(indexNow);
    else if(this.props.facets.supplement)
      (this.props.facets.supplement as ItemScroller).scrollItems(jump)
  };
  protected renderUi(props:IndexingUiProps){
    traceThing('^IndexingRowList',props);
    const selectables=props.selectables,rows:any[]=[];
    const rowHeight=30,rowCount=5,rowItemCount=selectables.length/rowCount;
    const disabled=!this.state.live;
    const newSliceRow=(keyAt:number,slice:any[])=>{
      return <div
        className={'listRowFlex'}
        key={'listRow'+keyAt+this.unique}
        style={{
          display:'flex',
          alignItems:'center',
          flexFlow:'row auto',
          height:rowHeight,
          border:false?'1px dotted':null,
        }}
      >{slice.map((day:DayItem,at:number)=>{
        const globalAt=at+(keyAt-1)*slice.length;
        const selected=globalAt===props.selectedAt;
        const dayName=day.dayName(),dayNumber=day.dayNumber();
        return (<RowItem
          classTail={(selected&& !disabled?'Selected':'')+(disabled?'Disabled':'')}
          tabIndex={selected&& !disabled?1:NaN}
          onClick={this.onItemClick}
          onKeyDown={this.onItemKeyDown}
          id={globalAt+'_'+this.unique}
          text={keyAt===0?dayName:dayNumber}
          key={dayName+dayNumber+(Facet.ids++)}
          height={rowHeight}
        />)
      })}</div>
    };
    rows.push(newSliceRow(0,selectables.slice(0,rowItemCount)));
    for(let rowAt=0; rowAt<rowCount; rowAt++)
      rows.push(newSliceRow(rowAt+1,selectables.slice(rowAt*rowItemCount,
        rowAt*rowItemCount+rowItemCount)))
    return (<span>
      <LabelRubric text={props.rubric} disabled={disabled}/>
      <div className={'listBoxFlex'}
           style={{
             display:'flex',
             alignItems:'stretch',
             flexDirection:'column',
             height:rowHeight*(rowCount+1),
           }}
           id={'listBox'+this.unique}
      >{rows}</div>
      </span>)
  }
  componentDidUpdate(){
    const id=this.state.index+'_'+this.unique as string;
    const element=document.getElementById(id);
    if(!element) throw new Error('No element');
    else element.focus();
  }
}
function buildLayout(f:Facets){
  ReactDOM.render(<RowPanel title={DateTitles.CalendarApp} withRubric={true}>
      <PanelRow>
        <TextualLabel title={DateTitles.Year} facets={f}/>
        <TextualLabel title={DateTitles.Month} facets={f}/>
      </PanelRow>
      <IndexingRowList title={DateTitles.Indexing} facets={f}/>
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
  [
    DateTitles.Year,
    DateTitles.Month,
    DateTitles.Indexing,
    SelectingTitles.ScrollUp,
    SelectingTitles.ScrollDown,
    SelectingTitles.ScrollBy,
  ].forEach(title=>{
    f.setTargetLive(title,false)
  })
}
export function launchApp(){
  new class extends SurfaceApp{
    getContentTrees(){
      return newTree(this.facets)
    }
    onRetargeted(activeTitle:string){
      if(false) disableAll(this.facets);
    }
    buildLayout(){
      buildLayout(this.facets)
    }
  }(newInstance(false)).buildSurface();
}