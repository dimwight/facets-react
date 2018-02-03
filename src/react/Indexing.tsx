import React from 'react';
import {traceThing} from '../util/_globals';
import {
  TargetValues,
  Facet,
  LabelRubric,
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
    let state=this.state;
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
    let options=props.selectables.map((s,at)=>
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
}
function ListItem(p:ListItemProps){
  return <div
    id={p.id}
    className={'listItem'+p.classTail}
    style={{
      cursor:'default',
      whiteSpace: false?null:'nowrap',
      overflow:'hidden',
    }}
    tabIndex={p.tabIndex}
    onClick={p.onClick}
    onKeyDown={p.onKeyDown}
  >{p.text}</div>;
}
function ListItemFlex(p:ListItemProps){
  return <div
    id={p.id}
    className={'listItemFlex'+p.classTail}
    style={{
      cursor:'default',
      whiteSpace: false?null:'nowrap',
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
    if(!this.state.live)return;
    this.indexChanged((e.target as HTMLElement).id.substr(0,1));
  };
  onKeyDown=(e:KeyboardEvent)=>{
    if(!this.state.live)return;
    let indexThen:number=Number((e.target as HTMLElement).id.substr(0,1)),
      indexNow:number=indexThen;
    if(e.key==='ArrowDown'){
      indexNow++;
    }
    else if(e.key==='ArrowUp'){
      indexNow--;
    }
    if(indexNow!==indexThen){
      if(indexNow>=0&&indexNow<(this.state.selectables as any[]).length)
        this.indexChanged(indexNow);
      else if(this.props.facets.supplement)
        (this.props.facets.supplement as ItemScroller
        ).scrollItems(indexNow<0?-1:1)
    }
  };
  protected renderUi(props:IndexingUiProps){
    traceThing('^IndexingList',props);
    let disabled=!this.state.live,selectables=props.selectables;
    let items=selectables.map((s, at)=>{
      let selected=at===props.selectedAt;
      traceThing('^IndexingList',{at:at,s:s,selected:selected});
      return (<ListItem
        classTail={(selected&&!disabled?'Selected':'')+(disabled?'Disabled':'')}
        tabIndex={selected&&!disabled?1:NaN}
        onClick={this.onClick}
        onKeyDown={this.onKeyDown}
        id={at+this.unique}
        text={s}
        key={s+(Facet.ids++)}
      />)});
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
    let box=document.getElementById('listBox'+this.unique);
    if(!box)throw new Error('No box');
    let renderWidth=Number(box.offsetWidth);
    traceThing('^componentDidUpdate',{
      renderWidth:renderWidth,
      boxWidth:this.boxWidth
    });
    if(this.boxWidth===0)this.boxWidth=renderWidth;
  }
  private setSelectedFocus(){
    let selected=this.state.index+this.unique as string;
    const element=document.getElementById(selected);
    if(!element)throw new Error('No element');
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
export class IndexingListFlex extends IndexingFacet{
  onItemClick=(e:KeyboardEvent)=>{
    if(!this.state.live)return;
    this.indexChanged((e.target as HTMLElement).id.substr(0,1));
  };
  onItemKeyDown=(e:KeyboardEvent)=>{
    if(!this.state.live)return;
    let indexThen:number=Number((e.target as HTMLElement).id.substr(0,1)),
      indexNow:number=indexThen;
    traceThing('^IndexingListFlex',e.key);
    if(e.key==='ArrowDown'||e.key==='ArrowRight'){
      indexNow++;
    }
    else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){
      indexNow--;
    }
    if(indexNow!==indexThen){
      if(indexNow>=0&&indexNow<(this.state.selectables as any[]).length)
        this.indexChanged(indexNow);
      else if(this.props.facets.supplement)
        (this.props.facets.supplement as ItemScroller)
          .scrollItems(indexNow<0?-1:1)
    }
  };
  protected renderUi(props:IndexingUiProps){
    traceThing('^IndexingListFlex',props);
    let disabled=!this.state.live,selectables=props.selectables;
    let items=selectables.map((s, at)=>{
      let selected=at===props.selectedAt;
      traceThing('^IndexingListFlex',{at:at,s:s,selected:selected});
      return (<ListItemFlex
        classTail={(selected&&!disabled?'Selected':'')+(disabled?'Disabled':'')}
        tabIndex={selected&&!disabled?1:NaN}
        onClick={this.onItemClick}
        onKeyDown={this.onItemKeyDown}
        id={at+this.unique}
        text={s}
        key={s+(Facet.ids++)}
      />)});
    return (<span>
      <LabelRubric text={props.rubric} disabled={disabled}/>
      <div className={'listBoxFlex'}
           style={{
             display:false?'table':'flex',
             flexFlow: 'row wrap'
           }}
           id={'listBox'+this.unique}
      >{items}</div>
      </span>)
  }
  private setSelectedFocus(){
    let selected=this.state.index+this.unique as string;
    const element=document.getElementById(selected);
    if(!element)throw new Error('No element');
    else element.focus();
  }
  componentWillMount(){
  }
  componentDidMount(){
    super.componentDidMount();
  }
  componentDidUpdate(){
    this.setSelectedFocus();
  }
}
