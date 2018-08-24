import React from 'react';
import {traceThing} from '../util/_globals';
import {
  Facet,
  LabelRubric,
  TargetValues,
} from './_locals';
import {ItemScroller} from "../app/_globals";
import './Indexing.css'
interface IndexingValues extends TargetValues{
  selectables?:any[]
  index?:number
  listWidth?:number
  itemDblClicked?:()=>void
}
export abstract class IndexingFacet extends Facet<IndexingValues,IndexingValues>{
  constructor(props:IndexingValues){
    super(props)
  }
  protected readUpdate(update:any){
    return {
      index:Number(update),
      selectables:this.props.facets.getIndexingState(this.props.title).uiSelectables,
    }
  }
  indexChanged(index:number){
    this.stateChanged(index);
  }
  render():any{
    const state=this.state;
    return this.renderUi({
      selectables:state.selectables as any[],
      selectedAt:(state as IndexingValues).index as number,
      disabled:!state.live,
      rubric:this.props.title,
    });
  }
  protected abstract renderUi(props:IndexingUiProps):void;
}
export interface IndexingUiProps{
  selectables:any[]
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
export interface ListItemProps{
  classTail:string
  tabIndex:number
  text:string
  id:string
  onClick?:(e:any)=>void
  onDoubleClick?:(e:any)=>void
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
    onKeyDown={p.onKeyDown}
    onClick={p.onClick}
    onDoubleClick={p.onDoubleClick}
  >{p.text}</div>;
}
export class IndexingList extends IndexingFacet{
  private boxWidth=0;
  onItemClick=(e:MouseEvent)=>{
    traceThing('onItemClick');
    if(true||!this.state.live) return;
    this.indexChanged(Number((e.target as HTMLElement).id.substr(0,1)));
  };
  onItemDoubleClick=(e:MouseEvent)=>{
    traceThing('onItemDoubleClick');
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
    traceThing('^IndexingRowList',props);
    const disabled=!this.state.live;
    const items=props.selectables.map((s,at)=>{
      const selected=at===props.selectedAt;
      traceThing('^IndexingRowList',{at:at,s:s,selected:selected});
      return (<ListItem
        classTail={(selected&& !disabled?'Selected':'')+(disabled?'Disabled':'')}
        tabIndex={selected&& !disabled?1:NaN}
        onClick={this.onItemClick}
        onDoubleClick={this.onItemDoubleClick}
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
