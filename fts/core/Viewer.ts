import {
  ViewerCoupler,
} from 'facets-js';
import {TargetCore} from './_globals';
export class Viewer extends TargetCore{
  constructor(title:string, coupler:ViewerCoupler){
    super(title,coupler);
    this.state_=coupler.passViewable;
  }
}
