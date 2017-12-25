import {
  TogglingCoupler
} from 'facets-js';
import {TargetCore} from './_globals';
export class Toggling extends TargetCore{
  constructor(title:string, private readonly coupler:TogglingCoupler){
    super(title);
    this.state_=coupler.passSet;
  }
}
