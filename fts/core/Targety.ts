import {Notifying} from './local';
import { SimpleState,Target} from '../../facets/Facets';
export interface Targety extends Notifying,Target{
  title():string;
  elements():Targety[];
  updateState(update:SimpleState);
  state():SimpleState;
}
