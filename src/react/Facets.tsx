import React from 'react';
import {traceThing} from '../util/_globals';
import {
  Facets,
  SimpleState,
} from 'facets-js';
import {SmartTextField} from './_locals';
import {IndexingDropdown} from './_globals';
import './Facets.css';
export type FnGetBoolean=()=>boolean
export type FnPassString=(string:string)=>void
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
  constructor(props:I){
    super(props);
    this.unique=props.title+Facet.ids++;
    traceThing('^ Facet',{'title':props.title});
    props.facets.attachFacet(props.title,this.facetUpdated);
  }
  facetUpdated=(update:any)=>{
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
    facets.updateTarget(title,state);
  }
  componentDidMount(){
    this.canSetState=true;
  }
  componentWillUnmount(){
    this.canSetState=false;
  }
  protected readUpdate(update:any):{}{
    return {state:update}
  }
}
export class TriggerButton extends Facet<TargetValues,TargetValues>{
  protected readUpdate(update:any){
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
  protected readUpdate(update:any):{}{
    return {set:Boolean(update)}
  }
  onChange=(e:Event)=>{
    let set=(e.target as HTMLInputElement).checked;
    this.stateChanged(set);
    this.setState({
      set:set,
    })
  };
  render(){
    return (<span>
      <LabelRubric text={this.state.showTitle as string} disabled={!this.state.live}
                   target={this.state.showTitle}/>
        <input
          id={this.props.title}
          type='checkbox'
          style={{verticalAlign:'middle'}}
          onChange={this.onChange as any}
          checked={this.state.set as any}
          disabled={!this.state.live as any}
        />
    </span>)
  }
}
interface LabelValues{
  text:string
  disabled:boolean
  target?:string
  style?:any
  classes?:string
}
interface TextualValues extends TargetValues{
  text?:string
  cols?:number
}
export class TextualField extends Facet<TextualValues,TextualValues>{
  protected readUpdate(update:any){
    return {text:String(update)}
  }
  onFieldEnter=(text:string)=>{
    this.stateChanged(text);
  };
  getStateText=():string=>this.state.text as string;
  isDisabled=()=>!this.state.live as boolean;
  render(){
    return (<div className={'textualField'}>
        <LabelRubric text={this.state.showTitle as string}
                     disabled={!this.state.live}/>
        <SmartTextField
          getStartText={this.getStateText}
          onEnter={this.onFieldEnter as FnPassString}
          cols={this.props.cols as number}
          isDisabled={this.isDisabled}
          hint={'Hint'}
        />
      </div>
    );
  }
}
export class TextualLabel extends Facet<TextualValues,TextualValues>{
  constructor(props:TextualValues){
    super(props);
    traceThing('^TextualLabel.constructor',this.props);
  }
  protected readUpdate(update:any):{}{
    return {text:String(update)}
  }
  render(){
    traceThing('^TextualLabel',this.state);
    let disabled=!this.state.live;
    return (<span>
      <LabelRubric text={this.state.showTitle as string} disabled={disabled}/>
      &nbsp;
      <LabelText text={this.state.text as string} disabled={disabled}/>
        </span>)
  }
}
export class ShowPanel extends Facet<TextualValues,TextualValues>{
  protected readUpdate(update:any):{}{
    return {text:String(update)}
  }
  render(){
    let all:any[]|any=this.props.children,show=all;
    all.forEach((child:any,at:number)=>{
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
  children?:any
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
  return <div className={'panel'} key={false?'':title}>
    {title&&props.withRubric?
      <PanelRubric text={title} disabled={false} classes={'panelRubric'}/>:null}
    {children}
  </div>
}
export function PanelRow(props:RowPanelProps){
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
export function newFormField(spec:FieldSpec,facets:Facets,key:any){
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
