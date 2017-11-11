import React from 'react';
import {traceThing} from '../util/export';
import {Facets,SimpleState} from 'facets-js';
import {SmartTextField} from './local';
import './Facet.css';
export type FnGetBoolean=()=>boolean
export type FnPassString=(string)=>void
export type FnGetString=()=>string
export interface TargetValues{
  title:string
  facets:Facets
  state?:SimpleState
  live?:boolean
}
export class Facet<I extends TargetValues,K extends TargetValues>
  extends React.Component<I,K>{
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
export function LabelRubric (props:LabelValues){
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
      <LabelRubric text={this.props.title} disabled={disabled}/>
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
    all.forEach((each,at)=>{
      traceThing('ShowPanel',each.props.key);
      if(each.props.rubric===this.state.text)show=each;
    });
    let children=React.Children.map(false?all:show,child=>{
      return <div className={'panelMount'}>{child}</div>
    });
    return <div className={'panel'}>{children}</div>
  }
}
interface RowPanelProps{
  rubric?:string
  key?:string
  children:any[]
}
function PanelRubric (props:LabelValues){
  let text=props.text,
    className=props.classes+' '+(props.disabled?'rubricDisabled':'rubric');
  return <div className={className}>{text}&nbsp;</div>
}
export function RowPanel(props:RowPanelProps){
  let children=React.Children.map(props.children,child=>{
    return <div className={'panelMount'}>{child}</div>
  });
  return <div className={'panel'} key={props.rubric}>
    {props.rubric?<PanelRubric text={props.rubric} disabled={false} classes={'panelRubric'}/>
    :null}
    {children}
  </div>
}
export function PanelRow(props){
  let children=React.Children.map(props.children,child=>{
    return (<span>{child} </span>)
  });
  return <div className={'panelRow'}>{children}</div>
}
