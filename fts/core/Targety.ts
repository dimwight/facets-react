import {Notifying} from './_locals';
import { TargetState,Target} from 'facets-js';
export interface Targety extends Notifying,Target{
  title():string;
  elements():Targety[];
  updateState(update:TargetState):void;
  state():TargetState;
  isLive():boolean;
  setLive(live:boolean):void
}
