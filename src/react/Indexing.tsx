import React from 'react';
import {traceThing} from '../util/_globals';
import {
  Facet,
  LabelRubric,
  TargetValues,
} from './_locals';
import {ItemScroller} from "../facets/_globals";
import './Indexing.css'
interface IndexingValues extends TargetValues{
  selectables?:string[]
  index?:number
  listWidth?:number
}
abstract class IndexingFacet extends Facet<IndexingValues,IndexingValues>{
  constructor(props:IndexingValues){
    super(props)
  }
  protected readUpdate(update:any){
    return {
      index:Number(update),
      selectables:this.props.facets.getIndexingState(this.props.title).uiSelectables,
    }
  }
  indexChanged(index:any){
    this.stateChanged(Number(index));
  }
  render():any{
    const state=this.state;
    return this.renderUi({
      selectables:state.selectables as string[],
      selectedAt:(state as IndexingValues).index as number,
      disabled:!state.live,
      rubric:this.props.title,
    });
  }
  protected abstract renderUi(props:IndexingUiProps):void;
}
interface IndexingUiProps{
  selectables:string[]
  disabled:boolean
  selectedAt:number
  rubric:string
}
interface SelectOptionProps{
  value:number
  text:string
  key:string
}
function SelectOption(props:SelectOptionProps){
  traceThing('^SelectOption',props);
  return <option value={props.value}>{props.text}</option>
}
export class IndexingDropdown extends IndexingFacet{
  constructor(props:IndexingValues){
    super(props)
  }
  onChange=(e:any)=>{
    this.indexChanged((e.target as any).value)
  };
  protected renderUi(props:IndexingUiProps){
    traceThing('^IndexingDropdown',props);
    const options=props.selectables.map((s,at)=>
      <SelectOption
        text={s}
        key={s+(++Facet.ids)}
        value={at}
      />,
    );
    return (<span>
      <LabelRubric text={props.rubric} disabled={props.disabled}/>
      <select
        value={props.selectedAt}
        className={props.disabled?'textDisabled':''}
        disabled={props.disabled}
        onChange={this.onChange}
      >{options}</select>
    </span>)
  }
}
interface ListItemProps{
  classTail:string
  tabIndex:number
  text:string
  id:string
  onClick:(e:any)=>void
  onKeyDown:(e:any)=>void
  key:string
  height?:number
}
function ListItem(p:ListItemProps){
  return <div
    id={p.id}
    className={'listItem'+p.classTail}
    style={{
      cursor:'default',
      whiteSpace:false?null:'nowrap',
      overflow:'hidden',
    }}
    tabIndex={p.tabIndex}
    onClick={p.onClick}
    onKeyDown={p.onKeyDown}
  >{p.text}</div>;
}
export class IndexingList extends IndexingFacet{
  private boxWidth=0;
  onClick=(e:KeyboardEvent)=>{
    if(!this.state.live) return;
    this.indexChanged((e.target as HTMLElement).id.substr(0,1));
  };
  onItemKeyDown=(e:KeyboardEvent)=>{
    if(!this.state.live) return;
    const indexThen:number=Number((e.target as HTMLElement).id.substr(0,1));
    let indexNow:number=indexThen;
    if(e.key==='ArrowDown'){
      indexNow++;
    }
    else if(e.key==='ArrowUp'){
      indexNow--;
    }
    if(indexNow!==indexThen){
      if(!this.state.selectables)throw new Error('No selectables');
      if(indexNow>=0&&indexNow<this.state.selectables.length)
        this.indexChanged(indexNow);
      else if(this.props.facets.supplement)
        (this.props.facets.supplement as ItemScroller
        ).scrollItems(indexNow<0?-1:1)
    }
  };
  protected renderUi(props:IndexingUiProps){
    traceThing('^IndexingList',props);
    const disabled=!this.state.live,selectables=props.selectables;
    const items=selectables.map((s,at)=>{
      const selected=at===props.selectedAt;
      traceThing('^IndexingList',{at:at,s:s,selected:selected});
      return (<ListItem
        classTail={(selected&& !disabled?'Selected':'')+(disabled?'Disabled':'')}
        tabIndex={selected&& !disabled?1:NaN}
        onClick={this.onClick}
        onKeyDown={this.onItemKeyDown}
        id={at+this.unique}
        text={s}
        key={s+(Facet.ids++)}
      />)
    });
    return (<span>
      <LabelRubric text={props.rubric} disabled={disabled}/>
      <div className={'listBox'}
           style={{
             display:'table',
             width:this.boxWidth||null,
             overflow:true?'auto':'scroll',
           }}
           id={'listBox'+this.unique}
      >{items}</div>
      </span>)
  }
  private fixBoxWidth(){
    const box=document.getElementById('listBox'+this.unique);
    if(!box) throw new Error('No box');
    const renderWidth=Number(box.offsetWidth);
    traceThing('^componentDidUpdate',{
      renderWidth:renderWidth,
      boxWidth:this.boxWidth,
    });
    if(this.boxWidth===0) this.boxWidth=renderWidth;
  }
  private setSelectedFocus(){
    const selected=this.state.index+this.unique as string;
    const element=document.getElementById(selected);
    if(!element) throw new Error('No element');
    else element.focus();
  }
  componentWillMount(){
    this.boxWidth=this.props.listWidth||0;
  }
  componentDidMount(){
    super.componentDidMount();
    this.fixBoxWidth();
  }
  componentDidUpdate(){
    this.setSelectedFocus();
  }
}
function ListItemFlex(p:ListItemProps){
  const selected=p.classTail.includes('Selected');
  const debug=false;
  return <div
    id={p.id}
    className={'listItemFlex'+p.classTail}
    style={{
      cursor:'default',
      fontSize:'110%',
      flexBasis:50,
      flexGrow:selected?4:1,
      height:p.height,
      display:'flex',
      alignItems:'center',
      border:debug?'1px dotted':null,
    }}
    tabIndex={p.tabIndex}
    onClick={p.onClick}
    onKeyDown={p.onKeyDown}
  >
   <div style={{
      flexGrow:1,
      textAlign:'center',
     border:debug?'1px solid':null,
    }}>{p.text}</div>
  </div>;
}
export class IndexingListFlex extends IndexingFacet{
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
        traceThing('^IndexingListFlex',skip);
        (this.props.facets.supplement as ItemScroller).scrollItems(skip)
      }
    }
  };
  protected renderUi(props:IndexingUiProps){
    traceThing('^IndexingListFlex',props);
    let newItem=(s:string,at:number)=>{
      const selected=false&&at===props.selectedAt;
      traceThing('^IndexingListFlex',{at:at,s:s,selected:selected});
      return (<ListItemFlex
        classTail={(selected&& !disabled?'Selected':'')+(disabled?'Disabled':'')}
        tabIndex={selected&& !disabled?1:NaN}
        onClick={this.onItemClick}
        onKeyDown={this.onItemKeyDown}
        id={at+this.unique}
        text={s}
        key={s+(Facet.ids++)}
        height={rowHeight}
      />)
    };
    let selectables=props.selectables,rows:any[]=[];
    const rowHeight=30,rowCount=5,rowItemCount=selectables.length/rowCount;
    const disabled=!this.state.live;
    const items=selectables.map(newItem);
    for(let rowAt=0;rowAt<rowCount;rowAt++){
      let items=selectables.slice(rowAt*rowItemCount,rowAt*rowItemCount+rowItemCount)
        .map(newItem);
      rows.push(<div className={'listRowFlex'}
         style={{
           display:'flex',
           alignItems:'center',
           flexFlow:'row auto',
           // flexBasis:150,
           height: rowHeight,
           border:true?'1px dotted':null,
         }}
         key={'listRow'+rowAt+this.unique}
        >{items}</div>
      )
    }
    return (<span>
      <LabelRubric text={props.rubric} disabled={disabled}/>
      <div className={'listBoxFlex'}
           style={{
             display:'flex',
             alignItems:'stretch',
             flexDirection :'column',
             height: rowHeight*rowCount,
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
