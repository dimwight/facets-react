import React from 'react';
import {traceThing} from '../util/_globals';
import {
  Facets,
  TargetState,
  Viewable,
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
  state?:TargetState
  live?:boolean
}
export class FacetCore<I extends TargetValues,K extends TargetValues>
    extends React.Component<I,K>{
  private canSetState:boolean=false;
  public static ids=0;
  protected readonly unique:string;
  constructor(props:I){
    super(props);
    this.unique=props.title+FacetCore.ids++;
    traceThing('^ FacetCore',{'title':props.title});
    props.facets.attachFacet(props.title,this.facetUpdated);
  }
  facetUpdated=(update:any)=>{
    const {title,facets}=this.props;
    const updateWithLive:{}=Object.assign({},
      this.readUpdate(update),{
        live:facets.isTargetLive(title),
        showTitle:title.replace(/\|.*/,''),
      });
    if(!this.canSetState)
      this.state=Object.assign({}as K,this.props,updateWithLive,);
    else this.setState(updateWithLive);
  };
  protected stateChanged(state:TargetState){
    const {facets,title}=this.props;
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
  protected isDisabled=()=>!this.state.live as boolean;
}
export class TextViewer extends FacetCore<TargetValues,TargetValues>{
  protected readUpdate(update:any){
    const content=(update as Viewable).getContent();
    traceThing('TextViewer.readUpdate',content);
    return {text:String(content)}
  }
  onFieldEnter=(text:string)=>{
    this.stateChanged(text);
  };
  getStateText=():string=>'Hi';
  render(){
    return (<div className={'textualField'}>
        <SmartTextField
          getStartText={this.getStateText}
          onEnter={this.onFieldEnter as FnPassString}
          cols={20}
          isDisabled={this.isDisabled}
          hint={'Hint'}
        />
      </div>
    );
  }
}
export class TriggerButton extends FacetCore<TargetValues,TargetValues>{
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
  const {target:htmlFor,text,disabled}=props,
    className=(disabled?'rubricDisabled':'rubric');
  return htmlFor?<label htmlFor={htmlFor} className={className}>
      {text}&nbsp;</label>
    :<span className={className}>
      {text}&nbsp;</span>
}
interface TogglingValues extends TargetValues{
  set?:boolean
}
export class TogglingCheckbox extends FacetCore<TogglingValues,TogglingValues>{
  protected readUpdate(update:any):{}{
    return {set:Boolean(update)}
  }
  onChange=(e:Event)=>{
    const set=(e.target as HTMLInputElement).checked;
    this.stateChanged(set);
    this.setState({
      set:set,
    })
  };
  render(){
    const state=this.state;
    return (<span>
      <LabelRubric text={state.showTitle as string} disabled={!state.live}
                   target={state.showTitle}/>
        <input
          id={this.props.title}

          type='checkbox'
          style={{verticalAlign:'middle'}}
          onChange={this.onChange as any}
          checked={state.set}
          disabled={!state.live}
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
export class TextualField extends FacetCore<TextualValues,TextualValues>{
  protected readUpdate(update:any){
    return {text:String(update)}
  }
  onFieldEnter=(text:string)=>{
    this.stateChanged(text);
  };
  getStateText=():string=>this.state.text as string;
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
export class TextualLabel extends FacetCore<TextualValues,TextualValues>{
  constructor(props:TextualValues){
    super(props);
    traceThing('^TextualLabel.constructor',this.props);
  }
  protected readUpdate(update:any):{}{
    return {text:String(update)}
  }
  render(){
    const state=this.state;
    traceThing('^TextualLabel',state);
    const disabled=!state.live;
    return (<span>
      <LabelRubric text={state.showTitle as string} disabled={disabled}/>
      &nbsp;
      <LabelText text={state.text as string} disabled={disabled}/>
        </span>)
  }
}
export class ShowPanel extends FacetCore<TextualValues,TextualValues>{
  protected readUpdate(update:any):{}{
    return {text:String(update)}
  }
  render(){
    const all:any[]|any=this.props.children;
    let show=all;
    all.forEach((child:any,at:number)=>{
      traceThing('^ShowPanel_',child);
      if(child.props.title===this.state.text) show=child;
    });
    const children=React.Children.map(false?all:show,child=>{
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
  const text=props.text,
    className=props.classes+' '+(props.disabled?'rubricDisabled':'rubric');
  return <div className={className}>{text}&nbsp;</div>
}
export function RowPanel(props:RowPanelProps){
  const children=React.Children.map(props.children,child=>{
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
  const children=React.Children.map(props.children,child=>{
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
