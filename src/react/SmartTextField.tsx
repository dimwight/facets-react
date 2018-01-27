import React,{ChangeEvent} from 'react';
import {
  FnPassString,
  FnGetString,
  FnGetBoolean,
} from './Facet'
import {traceThing} from '../Util/Bits';
interface TextFieldProps{
  getStartText?:FnGetString
  onEnter:FnPassString
  isDisabled:FnGetBoolean
  hint?:string
  cols?:number
}
interface TextFieldState{
  text:string
  disabled:boolean
  startText?:string
}
export class SmartTextField extends React.Component<TextFieldProps,TextFieldState> {
  constructor(props:TextFieldProps){
    super(props);
    let hint=props.hint,startText:string=props.getStartText?props.getStartText():' ';
    this.state={
      text:startText?startText:hint?hint:'',
      disabled:props.isDisabled(),
      startText:startText
    }
  }
  setText=(set:string)=>{
    this.setState({
      text:set,
    })
  };
  onClick=()=>{
    let hint=this.props.hint;
    if(hint&&this.state.text===hint)
      this.setText('');
  };
  onChange=(e:ChangeEvent<any>)=>{
    this.setText((e.target as HTMLInputElement).value)
  };
  onKeyPress=(e:KeyboardEvent)=>{
    if(e.key==='Enter'){
      e.preventDefault();
      let text=this.state.text;
      this.props.onEnter(text);
    }
  };
  onKeyDown=(e:KeyboardEvent)=>{
    if(e.keyCode===27)this.setText(this.state.startText as string)
  };
  componentWillReceiveProps(){
    let startText=this.props.getStartText?this.props.getStartText():'',
      disabled=this.props.isDisabled();
    this.setState({
      startText: startText,
      text:startText,
      disabled:disabled,
    });
  }
  render() {
    return (
      <span>
        <input type="text"
         className={this.state.disabled?'textDisabled':''}
         size={this.props.cols||20}
         value={this.state.text}
         onKeyPress={this.onKeyPress as any}
         onKeyDown={this.onKeyDown as any}
         onChange={this.onChange as any}
         onMouseDown={this.onClick as any}
         disabled={this.state.disabled}
        />
      </span>
    );
  }
}

