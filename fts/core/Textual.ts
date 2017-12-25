import {
  TextualCoupler,
  SimpleState,
} from 'facets-js';
import {TargetCore} from './_globals';
export class Textual extends TargetCore{
  constructor(title:string, private readonly coupler:TextualCoupler){
    super(title);
    if(coupler.passText)this.state_=coupler.passText;
  }
  state(): SimpleState {
    return this.state_!==TargetCore.NoState?this.state_
      :this.coupler.getText(this.title());
  }

}
