import {
  TextualCoupler,
  SimpleState,
} from 'facets-js';
import {TargetCore} from './_globals';
export class Textual extends TargetCore{
  constructor(title:string, coupler:TextualCoupler){
    super(title,coupler);
    if(coupler.passText)this.state_=coupler.passText;
  }
  state(): SimpleState {
    const coupler=!this.extra?null:this.extra as TextualCoupler;
    if(this.state_!==TargetCore.NoState){return this.state_;}
    else if(!coupler||!coupler.getText)return '';
    else {
      const text=coupler.getText(this.title());
      if(!text)if(text===null)throw new Error('Null text');
      return text;
    }
  }
}
