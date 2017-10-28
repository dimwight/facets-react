import React from 'react';
import {Facets,SimpleState} from 'facets-js';
import {SmartTextField} from './SmartTextField';
import {traceThing} from '../util/Bits';
import './Layout.css';
interface TargetValues{
  title:string
  facets?:Facets
  state?:SimpleState
  live?:boolean
}
class Facet<I extends TargetValues,K extends TargetValues> extends React.Component<I,K>{
  private didMount:boolean;
  public static ids=0;
  protected readonly unique:string;
  constructor(props){
    super(props);
    this.unique=props.title+Facet.ids++;
    props.facets.attachFacet(props.title,this.facetUpdated);
  }
  facetUpdated=(update)=>{
    let updateWithLive:{}=Object.assign({},this.readUpdate(update),{
      live:this.props.facets.isTargetLive(this.props.title)
    });
    if(!this.didMount)
      this.state=Object.assign({}as K,this.props,updateWithLive,);
    else this.setState(updateWithLive);
  };
  protected stateChanged(state:SimpleState){
    let facets=this.props.facets,title=this.props.title;
    facets.updateTargetState(title,state);
    facets.notifyTargetUpdated(title);
  }
  componentDidMount(){
    this.didMount=true;
  }
  protected readUpdate(update):{}{
    return {state:update}
  }
}
interface TextualValues extends TargetValues{
  text?:string
  cols?:number
}
interface TogglingValues extends TargetValues{
  set?:boolean
}
interface LabelValues{
  text:string
  disabled:boolean
  target?:string
  style?:any
  classes?:string
}
export function LabelText (props:LabelValues){
  return (<span className={props.disabled?'textDisabled':''}>
    {props.text}&nbsp;</span>)
}
export class TogglingCheckbox extends Facet<TogglingValues,TogglingValues>{
  protected readUpdate(update):{}{
    return {set:Boolean(update)}
  }
  onChange=(e)=>{
    let set=e.target.checked;
    this.stateChanged(set);
    this.setState({
      set:set
    })
  };
  render(){
    return (<span>
      <LabelRubric text={this.props.title} disabled={!this.state.live} target={this.props.title}/>
        <input
          id={this.props.title}
          type="checkbox"
          style={{verticalAlign: 'middle'}}
          onChange={this.onChange}
          checked={this.state.set}
          disabled={!this.state.live}
        />
    </span>)
  }
}
export function LabelRubric (props:LabelValues){
  // traceThing('LabelRubric',props)
  let htmlFor=props.target,text=props.text,
    className=(props.disabled?'rubricDisabled':'rubric');
  return htmlFor?<label htmlFor={htmlFor} className={className}>
      {text}&nbsp;</label>
    :<span className={className}>
      {text}&nbsp;</span>
}
export class TextualField extends Facet<TextualValues,TextualValues>{
  protected readUpdate(update){
    return {text:String(update)}
  }
  onFieldEnter=(text)=>{
     this.stateChanged(text);
  };
  getStateText=()=>this.state.text;
  isDisabled=()=>!this.state.live;
  render(){
    return (<div  className={'textualField'}>
        <LabelRubric text={this.props.title} disabled={!this.state.live}/>
        <SmartTextField
          getStartText={this.getStateText}
          onEnter={this.onFieldEnter}
          cols={this.props.cols}
          isDisabled={this.isDisabled}
          hint={'Hint'}
        />
      </div>
    );
  }
}
export class TextualLabel extends Facet<TextualValues,TextualValues>{
  protected readUpdate(update):{}{
    return {text:String(update)}
  }
  render(){
    let disabled=!this.state.live;
    return (<span>
      <LabelRubric text={this.props.title} disabled={disabled}/>
      &nbsp;
      <LabelText text={this.state.text} disabled={disabled}/>
        </span>)
  }
}
export class TriggerButton extends Facet<TargetValues,TargetValues>{
  protected readUpdate(update){
    return {}
  }
  onClick=()=>{
    this.stateChanged('No state!');
  };
  render(){
    return (<button
      onClick={this.onClick}
      disabled={!this.state.live}
    >{this.props.title}
    </button>)
  }
}
export function PanelRubric (props:LabelValues){
  let text=props.text,
    className=props.classes+' '+(props.disabled?'rubricDisabled':'rubric');
  return <div className={className}>{text}&nbsp;</div>
}
interface IndexingValues extends TargetValues{
  selectables?:string[]
  index?:number
}
abstract class IndexingFacet extends Facet<IndexingValues,IndexingValues>{
  protected readUpdate(update){
    return {
      index:Number(update),
      selectables:this.props.facets.getIndexingState(this.props.title).uiSelectables
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
      rubric:this.props.title
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
export function SelectOption(props:SelectOptionProps){
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
      />
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
    if(e.key==='ArrowDown')indexNow++;
    else if(e.key==='ArrowUp')indexNow--;
    if(indexNow!==indexThen&&indexNow>=0
        &&indexNow<this.state.selectables.length)
      this.indexChanged(indexNow)
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
export function RowPanel(props){
  let children=React.Children.map(props.children,child=>{
    return <div className={'panelMount'}>{child}</div>
  });
  return <div className={'panel'}>
    <PanelRubric text={props.rubric} disabled={false} classes={'panelRubric'}/>
    {children}
  </div>
}
export function PanelRow(props){
  let children=React.Children.map(props.children,child=>{
    return (<span>{child} </span>)
  });
  return <div className={'panelRow'}>{children}</div>
}
