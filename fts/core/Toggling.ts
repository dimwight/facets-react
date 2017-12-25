import {
  SimpleState,
  TogglingCoupler,
} from 'facets-js';
import {TargetCore} from './_globals';
export class Toggling extends TargetCore{
  constructor(title:string, private readonly coupler:TogglingCoupler){
    super(title);
    this.state_=coupler.passSet;
  }
  updateState(update:SimpleState){
    super.updateState(update);
    const updater=this.coupler.targetStateUpdated;
    if(updater)updater(this.state(),this.title())
  }
}
