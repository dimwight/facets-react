import React from 'react';
import {traceThing} from '../util/export';
import {
  TargetValues,
  Facet,
  LabelRubric,
} from './local';
import {SelectingOvershoot} from "../facets/export";
interface IndexingValues extends TargetValues{
  selectables?:string[]
  index?:number
}
abstract class IndexingFacet extends Facet<IndexingValues,IndexingValues>{
  protected readUpdate(update){
    return {
      index:Number(update),
      selectables:this.props.facets.getIndexingState(this.props.title).uiSelectables,
    }
  }
  indexChanged(index){
    this.stateChanged(Number(index));
  }
  render(){
    let state=this.state;
    return this.renderUi({
      selectables:state.selectables,
      selectedAt:(state as IndexingValues).index,
      disabled:!state.live,
      rubric:this.props.title,
    });
  }
  protected abstract renderUi(props:IndexingUiProps);
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
  onChange=(e)=>{
    this.indexChanged(e.target.value)
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
  className:string
  tabIndex:number
  text:string
  id:string
  onClick:(e)=>void
  onKeyDown:(e)=>void
  key:string
}
export function ListItem(p:ListItemProps){
  return <div
    id={p.id}
    className={p.className}
    style={{cursor:'default'}}
    tabIndex={p.tabIndex}
    onClick={p.onClick}
    onKeyDown={p.onKeyDown}
  >{p.text}</div>;
}
export class IndexingList extends IndexingFacet{
  private boxWidth=0;
  onClick=(e)=>{
    this.indexChanged(e.target.id.substr(0,1));
  };
  onKeyDown=(e)=>{
    let indexThen=e.target.id.substr(0,1),indexNow=indexThen;
    if(e.key==='ArrowDown'){
      indexNow++;
    }
    else if(e.key==='ArrowUp'){
      indexNow--;
    }
    if(indexNow!==indexThen){
      if(indexNow>=0&&indexNow<this.state.selectables.length)
        this.indexChanged(indexNow);
      else(this.props.facets.supplement as SelectingOvershoot
        ).overshot(indexNow<0)
    }
  };
  protected renderUi(props:IndexingUiProps){
    traceThing('^IndexingList',props);
    let disabled=false?true:!this.state.live,selectables=props.selectables;
    let items=selectables.map((s, at)=>{
      let selected=at===props.selectedAt;
      traceThing('^IndexingList',{at:at,s:s,selected:selected});
      return (<ListItem
        className={(selected?'listSelected':'listItem')+(disabled?'Disabled':'')}
        tabIndex={selected&&!disabled?1:null}
        onClick={disabled?null:this.onClick}
        onKeyDown={disabled?null:this.onKeyDown}
        id={at+this.unique}
        text={s}
        key={s+(++Facet.ids)}
      />)});
    return (<span>
      <LabelRubric text={props.rubric} disabled={disabled}/>
      <div className={'listBox'}
           style={{
             display:'table',
             width:this.boxWidth===0?null:this.boxWidth,
           }}
           id={'listBox'+this.unique}
      >{items}</div>
      </span>)
  }
  componentDidUpdate(){
    let selected=this.state.index+this.unique,
      listBox='listBox'+this.unique;
    document.getElementById(selected).focus();
    let box=document.getElementById(listBox);
    let renderWidth=Number(box.offsetWidth),borderWidth=Number(box.style.borderWidth);
    traceThing('^componentDidUpdate',{
      renderWidth:renderWidth,
      borderWidth:borderWidth,
      boxWidth:this.boxWidth});
    if(this.boxWidth===0)this.boxWidth=renderWidth
  }
}
