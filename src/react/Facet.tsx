import React from 'react';
import {traceThing} from '../util/_globals';
import {
  Facets,
  SimpleState,
} from 'facets-js';
import {SmartTextField} from './_locals';
import {IndexingDropdown} from './_globals';
import './Facet.css';
export type FnGetBoolean=()=>boolean
export type FnPassString=(string)=>void
export type FnGetString=()=>string
export interface TargetValues{
  title:string
  showTitle?:string;
  facets:Facets
  state?:SimpleState
  live?:boolean
}
export class Facet<I extends TargetValues,K extends TargetValues>
  extends React.Component<I,K>{
  private canSetState:boolean;
  public static ids=0;
  protected readonly unique:string;
  constructor(props){
    super(props);
    this.unique=props.title+Facet.ids++;
    traceThing('^ Facet',{'title':props.title});
    props.facets.attachFacet(props.title,this.facetUpdated);
  }
  facetUpdated=(update)=>{
    let updateWithLive:{}=Object.assign({},
      this.readUpdate(update),{
        live:this.props.facets.isTargetLive(this.props.title),
        showTitle:this.props.title.replace(/\|.*/,''),
      });
    if(!this.canSetState)
      this.state=Object.assign({}as K,this.props,updateWithLive,);
    else this.setState(updateWithLive);
  };
  protected stateChanged(state:SimpleState){
    let facets=this.props.facets,title=this.props.title;
    facets.updateTargetState(title,state);
    facets.notifyTargetUpdated(title);
  }
  componentDidMount(){
    this.canSetState=true;
  }
  componentWillUnmount(){
    this.canSetState=false;
  }
  protected readUpdate(update):{}{
    return {state:update}
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
    >{this.state.showTitle}
    </button>)
  }
}
interface LabelValues{
  text:string
  disabled:boolean
  target?:string
  style?:any
  classes?:string
}
export function LabelText(props:LabelValues){
  return (<span className={props.disabled?'textDisabled':''}>
    {props.text}&nbsp;</span>)
}
export function LabelRubric(props:LabelValues){
  let htmlFor=props.target,text=props.text,
    className=(props.disabled?'rubricDisabled':'rubric');
  return htmlFor?<label htmlFor={htmlFor} className={className}>
      {text}&nbsp;</label>
    :<span className={className}>
      {text}&nbsp;</span>
}
interface TogglingValues extends TargetValues{
  set?:boolean
}
export class TogglingCheckbox extends Facet<TogglingValues,TogglingValues>{
  protected readUpdate(update):{}{
    return {set:Boolean(update)}
  }
  onChange=(e)=>{
    let set=e.target.checked;
    this.stateChanged(set);
    this.setState({
      set:set,
    })
  };
  render(){
    return (<span>
      <LabelRubric text={this.state.showTitle} disabled={!this.state.live}
                   target={this.state.showTitle}/>
        <input
          id={this.props.title}
          type="checkbox"
          style={{verticalAlign:'middle'}}
          onChange={this.onChange}
          checked={this.state.set}
          disabled={!this.state.live}
        />
    </span>)
  }
}
interface TextualValues extends TargetValues{
  text?:string
  cols?:number
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
    return (<div className={'textualField'}>
        <LabelRubric text={this.state.showTitle} disabled={!this.state.live}/>
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
  constructor(props){
    super(props);
    traceThing('^TextualLabel.constructor',this.props);
  }
  protected readUpdate(update):{}{
    return {text:String(update)}
  }
  render(){
    traceThing('^TextualLabel',this.state);
    let disabled=!this.state.live;
    return (<span>
      <LabelRubric text={this.state.showTitle} disabled={disabled}/>
      &nbsp;
      <LabelText text={this.state.text} disabled={disabled}/>
        </span>)
  }
}
export class ShowPanel extends Facet<TextualValues,TextualValues>{
  protected readUpdate(update):{}{
    return {text:String(update)}
  }
  render(){
    let all=this.props.children as any[],show;
    all.forEach((child,at)=>{
      traceThing('^ShowPanel_',child);
      if(child.props.title===this.state.text) show=child;
    });
    let children=React.Children.map(false?all:show,child=>{
      return <div className={'panelMount'}>{child}</div>
    });
    return <div className={'panel'}>{children}</div>
  }
}
interface RowPanelProps{
  title?:string
  withRubric?:boolean
  key?:string
  children
}
function PanelRubric(props:LabelValues){
  let text=props.text,
    className=props.classes+' '+(props.disabled?'rubricDisabled':'rubric');
  return <div className={className}>{text}&nbsp;</div>
}
export function RowPanel(props:RowPanelProps){
  let children=React.Children.map(props.children,child=>{
    return <div className={'panelMount'}>{child}</div>
  });
  const title=props.title;
  return <div className={'panel'} key={false?null:title}>
    {title&&props.withRubric?
      <PanelRubric text={title} disabled={false} classes={'panelRubric'}/>:null}
    {children}
  </div>
}
export function PanelRow(props){
  let children=React.Children.map(props.children,child=>{
    return (<span>{child} </span>)
  });
  return <div className={'panelRow'}>{children}</div>
}
export enum FieldType {
  TextualField,
  TextualLabel,
  TogglingCheckbox,
  IndexingDropdown,
  TriggerButton,
}
export interface FieldSpec{
  type:FieldType
  title:string
  cols?:number
}
export function newFormField(spec:FieldSpec,facets:Facets,key){
  switch(spec.type){
    case FieldType.TextualField:
      return <TextualField key={key} title={spec.title} facets={facets}
                           cols={spec.cols}/>;
    case FieldType.TextualLabel:
      return <TextualLabel key={key} title={spec.title} facets={facets}/>;
    case FieldType.TogglingCheckbox:
      return <TogglingCheckbox key={key} title={spec.title} facets={facets}/>;
    case FieldType.IndexingDropdown:
      return <IndexingDropdown key={key} title={spec.title} facets={facets}/>;
    case FieldType.TriggerButton:
      return <TriggerButton key={key} title={spec.title} facets={facets}/>

  }
}
