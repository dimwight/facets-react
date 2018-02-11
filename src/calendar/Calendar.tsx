import React from 'react';
import ReactDOM from 'react-dom';
import {
  Facets,
  IndexingFramePolicy,
  newInstance,
} from 'facets-js';
import {
  PanelRow,
  RowPanel,
  TextualField,
  TriggerButton,
  TextualLabel,
  IndexingFacet,
  ListItemProps,
  IndexingUiProps,
  Facet,
  LabelRubric,
} from '../react/_globals';
import {
  ScrollableList,
  SelectingTitles,
  SurfaceApp,
  ItemScroller,
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
    const indexThen:number=Number((e.target as HTMLElement).id.substr(0,1));
    let indexNow:number=indexThen;
    const key=e.key;
    if(key==='ArrowDown'||key==='ArrowRight'){
      indexNow+=key==='ArrowDown'?3:1;
    }
    else if(key==='ArrowUp'||key==='ArrowLeft'){
      indexNow-=key==='ArrowUp'?3:1;
    }
    if(indexNow!==indexThen){
      const selectables=this.state.selectables;
      if(!selectables)throw new Error('No selectables');
      if(indexNow>=0&&indexNow<selectables.length)
        this.indexChanged(indexNow);
      else if(this.props.facets.supplement){
        const skip=indexNow<0?indexNow:indexNow-selectables.length+1;
        traceThing('^IndexingRowList',skip);
        (this.props.facets.supplement as ItemScroller).scrollItems(skip)
      }
    }
  };
  protected renderUi(props:IndexingUiProps){
    traceThing('^IndexingRowList',props);
    const selectables=props.selectables,rows:any[]=[];
    const rowHeight=30,rowCount=5,rowItemCount=selectables.length/rowCount;
    const disabled=!this.state.live;
    const newRow=(keyAt:number,slice:any[])=>{
      return <div
        className={'listRowFlex'}
        key={'listRow'+keyAt+this.unique}
        style={{
          display:'flex',
          alignItems:'center',
          flexFlow:'row auto',
          height: rowHeight,
          border:false?'1px dotted':null,
        }}
      >{slice.map((day:DayItem,at:number)=>{
        const selected=at+(keyAt-1)*slice.length===props.selectedAt;
        traceThing('^IndexingRowList',{at:at,s:day,selected:selected});
        return (<RowItem
          classTail={(selected&& !disabled?'Selected':'')+(disabled?'Disabled':'')}
          tabIndex={selected&& !disabled?1:NaN}
          onClick={this.onItemClick}
          onKeyDown={this.onItemKeyDown}
          id={at+this.unique}
          text={keyAt===0?day.dayName():day.dayNumber()}
          key={day.dayName()+day.dayNumber()+(Facet.ids++)}
          height={rowHeight}
        />)
      })}</div>
    };
    rows.push(newRow(0,selectables.slice(0,rowItemCount)));
    for(let rowAt=0;rowAt<rowCount;rowAt++){
      rows.push(newRow(rowAt+1,selectables.slice(rowAt*rowItemCount,rowAt*rowItemCount+rowItemCount)))
    }
    return (<span>
      <LabelRubric text={props.rubric} disabled={disabled}/>
      <div className={'listBoxFlex'}
           style={{
             display:'flex',
             alignItems:'stretch',
             flexDirection :'column',
             height: rowHeight*(rowCount+1),
           }}
           id={'listBox'+this.unique}
      >{rows}</div>
      </span>)
  }
  componentDidUpdate(){
    const selected=this.state.index+this.unique as string;
    const element=document.getElementById(selected);
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
      if(false)disableAll(this.facets);
    }
    buildLayout(){
      buildLayout(this.facets)
    }
  }(newInstance(false)).buildSurface();
}