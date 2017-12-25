import {
  TogglingCoupler,
} from 'facets-js';
import {TargetCore} from './_globals';
export class Toggling extends TargetCore{
  constructor(title:string, private readonly coupler:TogglingCoupler){
    super(title,coupler);
    this.state_=coupler.passSet;
  }
}
