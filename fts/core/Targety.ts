import {Notifying} from './_locals';
import { SimpleState,Target} from 'facets-js';
export interface Targety extends Notifying,Target{
  title():string;
  elements():Targety[];
  updateState(update:SimpleState);
  state():SimpleState;
  isLive():boolean;
  setLive(live:boolean)
}
