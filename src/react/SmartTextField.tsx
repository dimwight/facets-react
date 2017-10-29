import React from 'react';
import {
  FnPassString,
  FnGetString,
  FnGetBoolean,
} from './local'
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
  constructor(props){
    super(props);
    let hint=props.hint,startText=props.getStartText();
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
  onChange=(e)=>{
    this.setText(e.target.value)
  };
  onKeyPress=(e)=>{
    if(e.key==='Enter'){
      e.preventDefault();
      let text=this.state.text;
      this.props.onEnter(text);
    }
  };
  onKeyDown=(e)=>{
    if(e.keyCode===27)this.setText(this.state.startText)
  };
  componentWillReceiveProps(){
    let startText=this.props.getStartText(),
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
         onKeyPress={this.onKeyPress}
         onKeyDown={this.onKeyDown}
         onChange={this.onChange}
         onMouseDown={this.onClick}
         disabled={this.state.disabled}
        />
      </span>
    );
  }
}

